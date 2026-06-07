import http.server
import socketserver
import json
import os
import urllib.parse
import threading  # ميزة أمان مضافة لمنع تلف البيانات عند الطلبات المتزامنة

PORT = 8000
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'products.json')
ORDERS_FILE = os.path.join(os.path.dirname(__file__), 'orders.json')
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), 'settings.json')

# قفل لمنع الخيوط المتعددة (Threads) من الكتابة أو القراءة من الملفات في نفس اللحظة
file_lock = threading.Lock()

class StoreHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    
    def log_message(self, format, *args):
        # إلغاء تفعيل طباعة السجلات في الـ Terminal لتسريع الأداء ومنع الازدحام
        pass

    def _set_headers(self, status=200, content_type='text/html; charset=utf-8'):
        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        # السماح بترويسة كلمة مرور المدير لمنع حظرها من المتصفحات
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        # مسارات واجهة برمجة التطبيقات (API)
        if path == '/api/products':
            self._handle_get_json(PRODUCTS_FILE)
        elif path == '/api/orders':
            # ميزة أمان: منع الزوار من رؤية طلبات الزبائن الآخرين، فقط المدير المخول يمكنه ذلك
            if not self._is_admin_authorized():
                self._set_headers(401, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": "غير مصرح لك بالوصول"}).encode('utf-8'))
                return
            self._handle_get_json(ORDERS_FILE)
        elif path == '/api/settings':
            self._handle_get_json(SETTINGS_FILE)
        else:
            # التعامل مع الملفات الثابتة (Static Files)
            if path == '/' or path == '':
                filename = 'index.html'
            else:
                filename = path.lstrip('/')

            filepath = os.path.join(STATIC_DIR, filename)
            
            # حماية متقدمة ضد هجمات الـ Directory Traversal لقراءة ملفات النظام الأساسية
            real_filepath = os.path.realpath(filepath)
            real_static_dir = os.path.realpath(STATIC_DIR)
            if not real_filepath.startswith(real_static_dir):
                self._set_headers(403, 'text/plain')
                self.wfile.write(b"403 Forbidden")
                return

            if os.path.exists(filepath) and os.path.isfile(filepath):
                _, ext = os.path.splitext(filepath)
                mime_types = {
                    '.html': 'text/html; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.js': 'application/javascript; charset=utf-8',
                    '.json': 'application/json; charset=utf-8',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.svg': 'image/svg+xml',
                    '.ico': 'image/x-icon'
                }
                content_type = mime_types.get(ext.lower(), 'application/octet-stream')
                
                try:
                    with open(filepath, 'rb') as f:
                        content = f.read()
                    self._set_headers(200, content_type)
                    self.wfile.write(content)
                except Exception as e:
                    self._set_headers(500, 'text/plain')
                    self.wfile.write(f"500 Internal Server Error: {str(e)}".encode())
            else:
                self._set_headers(404, 'text/html; charset=utf-8')
                error_html = """<!DOCTYPE html>
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #0f172a; color: #f8fafc;">
                    <h1>404 Not Found</h1>
                    <p>الملف المطلوب غير موجود في خادم المتجر.</p>
                </body>
                </html>""".encode('utf-8')
                self.wfile.write(error_html)

    def _is_admin_authorized(self):
        """ دالة التحقق من هوية المدير عبر مطابقة الترويسة مع كلمة المرور المخزنة في الإعدادات """
        admin_pass_header = self.headers.get('X-Admin-Password')
        if not admin_pass_header:
            return False
        
        password = "admin"  # افتراضي في حال عدم وجود الملف
        with file_lock:
            if os.path.exists(SETTINGS_FILE):
                try:
                    with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
                        s = json.load(f)
                        password = s.get('adminPassword', 'admin')
                except Exception:
                    pass
        return admin_pass_header == password

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path in ['/api/products', '/api/orders', '/api/settings']:
            # ميزة أمان: فرض التحقق من هوية المدير لتعديل المنتجات أو الإعدادات
            if path in ['/api/products', '/api/settings']:
                if not self._is_admin_authorized():
                    self._set_headers(401, 'application/json')
                    self.wfile.write(json.dumps({"success": False, "error": "عملية غير مصرح بها"}).encode('utf-8'))
                    return

            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                json_data = json.loads(post_data.decode('utf-8'))
                
                if path == '/api/products':
                    self._handle_save_json(PRODUCTS_FILE, json_data)
                elif path == '/api/settings':
                    self._handle_save_json(SETTINGS_FILE, json_data)
                elif path == '/api/orders':
                    if isinstance(json_data, list):
                        # تحديث مصفوفة الطلبات بالكامل (خاص بالمدير لحذف أو تعديل حالة طلب)
                        if not self._is_admin_authorized():
                            self._set_headers(401, 'application/json')
                            self.wfile.write(json.dumps({"success": False, "error": "غير مصرح"}).encode('utf-8'))
                            return
                        self._handle_save_json(ORDERS_FILE, json_data)
                    else:
                        # تقديم طلب جديد من زبون (متاح للعامة ولكن يتم فحص وتدقيق البيانات في السيرفر)
                        validated_order = self._validate_and_recalculate_order(json_data)
                        if not validated_order:
                            self._set_headers(400, 'application/json')
                            self.wfile.write(json.dumps({"success": False, "error": "البيانات غير صالحة أو الكمية غير متوفرة في المخزن"}).encode('utf-8'))
                            return
                        
                        # إضافة الطلب للملف بأمان داخل نطاق القفل البرمجي
                        with file_lock:
                            orders = []
                            if os.path.exists(ORDERS_FILE):
                                try:
                                    with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
                                        orders = json.load(f)
                                except Exception:
                                    orders = []
                            orders.append(validated_order)
                            
                            with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
                                json.dump(orders, f, ensure_ascii=False, indent=2)
                        
                        self._set_headers(200, 'application/json; charset=utf-8')
                        self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                    
            except Exception as e:
                self._set_headers(400, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404, 'text/plain')
            self.wfile.write(b"Endpoint Not Found")

    def _validate_and_recalculate_order(self, order_data):
        """ ميزة أمان حرجة: حماية السيرفر من تلاعب المتصفح بالأسعار والمخزون """
        if not order_data.get('customerName') or not order_data.get('customerPhone'):
            return None

        items = order_data.get('items', [])
        if not items:
            return None

        with file_lock:
            try:
                with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                    db_products = json.load(f)
            except Exception:
                return None
            
            try:
                with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
                    db_settings = json.load(f)
            except Exception:
                db_settings = {}

        prod_map = {p['id']: p for p in db_products}
        calculated_subtotal_usd = 0
        updated_items = []
        
        for item in items:
            p_id = item.get('id')
            qty = item.get('quantity', 0)
            if p_id not in prod_map or qty <= 0:
                return None
            
            db_prod = prod_map[p_id]
            
            # التحقق الفعلي من توفر الكمية المطلوبة بالمخزن وحجزها بالسيرفر
            if db_prod.get('stock', 5) < qty:
                return None
            
            db_prod['stock'] -= qty
            price_usd = db_prod.get('price', 0)
            calculated_subtotal_usd += price_usd * qty
            
            # حساب وتثبيت السعر الحقيقي بناءً على العملة المطلوبة لمنع التلاعب بالقيمة
            currency = order_data.get('currency', 'USD')
            item_converted_price = price_usd
            if currency == 'SAR':
                item_converted_price = round(price_usd * db_settings.get('usdToSarRate', 3.75))
            elif currency == 'YER':
                item_converted_price = round(price_usd * db_settings.get('usdToYerRate', 1600.0))

            updated_items.append({
                "id": p_id,
                "title": item.get('title', db_prod.get('title')),
                "price": item_converted_price,
                "quantity": qty
            })

        # إعادة بناء الحقول بناءً على حسابات الخادم المضمونة وليس مدخلات المتصفح
        currency = order_data.get('currency', 'USD')
        final_total = calculated_subtotal_usd
        if currency == 'SAR':
            final_total = round(final_total * db_settings.get('usdToSarRate', 3.75))
        elif currency == 'YER':
            final_total = round(final_total * db_settings.get('usdToYerRate', 1600.0))
            
        order_data['items'] = updated_items
        order_data['totalPrice'] = final_total
        
        # حفظ كميات المخزون الجديدة المحدثة في ملف المنتجات بأمان
        with file_lock:
            try:
                with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(db_products, f, ensure_ascii=False, indent=2)
            except Exception:
                pass
                
        return order_data

    def _handle_get_json(self, filepath):
        with file_lock:
            if not os.path.exists(filepath):
                initial_data = [] if filepath != SETTINGS_FILE else {}
                try:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(initial_data, f, ensure_ascii=False, indent=2)
                except Exception:
                    pass
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                self._set_headers(200, 'application/json; charset=utf-8')
                self.wfile.write(content.encode('utf-8'))
            except Exception as e:
                self._set_headers(500, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def _handle_save_json(self, filepath, data):
        with file_lock:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                self._set_headers(200, 'application/json; charset=utf-8')
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                self._set_headers(500, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))


class ThreadingTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == '__main__':
    os.makedirs(STATIC_DIR, exist_ok=True)
    with ThreadingTCPServer(("", PORT), StoreHTTPRequestHandler) as httpd:
        print(f"Server is running at: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()
