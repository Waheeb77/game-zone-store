import http.server
import socketserver
import json
import os
import urllib.parse
from pymongo import MongoClient

PORT = 8000
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')

# جلب الرابط من بيئة Render، أو استخدام الرابط الخاص بك مباشرة للتجارب المحلية
MONGO_URI = os.environ.get(
    "MONGO_URI", 
    "mongodb+srv://waheeb77:A3qwsa771514@cluster0.zrx42tv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)

try:
    # الاتصال بالخادم السحابي
    client = MongoClient(MONGO_URI)
    db = client['game_zone_store']
    # فحص كفاءة الاتصال
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"MongoDB Connection Error: {e}")

def init_db():
    """ نظام المهاجرة الذكية والآلية لنقل البيانات القديمة من الـ JSON إلى السحابة """
    try:
        if db.products.count_documents({}) == 0:
            json_prod = os.path.join(os.path.dirname(__file__), 'products.json')
            if os.path.exists(json_prod):
                with open(json_prod, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data: db.products.insert_many(data)
                os.rename(json_prod, json_prod + '.bak')
    except Exception: pass

    try:
        if db.settings.count_documents({}) == 0:
            json_sett = os.path.join(os.path.dirname(__file__), 'settings.json')
            if os.path.exists(json_sett):
                with open(json_sett, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for k, v in data.items():
                        db.settings.insert_one({'key': k, 'value': v})
                os.rename(json_sett, json_sett + '.bak')
    except Exception: pass
        
    try:
        if db.orders.count_documents({}) == 0:
            json_ord = os.path.join(os.path.dirname(__file__), 'orders.json')
            if os.path.exists(json_ord):
                with open(json_ord, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data: db.orders.insert_many(data)
                os.rename(json_ord, json_ord + '.bak')
    except Exception: pass


class StoreHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    
    def log_message(self, format, *args):
        pass

    def _set_headers(self, status=200, content_type='text/html; charset=utf-8', cache_control='no-cache, no-store, must-revalidate'):
        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password')
        self.send_header('Cache-Control', cache_control)
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == '/api/products':
            self._handle_get_products()
        elif path == '/api/orders':
            if not self._is_admin_authorized():
                self._set_headers(401, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": "غير مصرح لك"}).encode('utf-8'))
                return
            self._handle_get_orders()
        elif path == '/api/settings':
            self._handle_get_settings()
        else:
            if path == '/' or path == '':
                filename = 'index.html'
            else:
                filename = path.lstrip('/')

            filepath = os.path.join(STATIC_DIR, filename)
            
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
        admin_pass_header = self.headers.get('X-Admin-Password')
        if not admin_pass_header:
            return False
        
        doc = db.settings.find_one({'key': 'adminPassword'})
        password = doc['value'] if doc else "admin"
        return admin_pass_header == password

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path in ['/api/products', '/api/orders', '/api/settings']:
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
                    db.products.delete_many({})
                    if json_data:
                        db.products.insert_many(json_data)
                    self._set_headers(200, 'application/json; charset=utf-8')
                    self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                    
                elif path == '/api/settings':
                    for k, v in json_data.items():
                        db.settings.update_one({'key': k}, {'$set': {'value': v}}, upsert=True)
                    self._set_headers(200, 'application/json; charset=utf-8')
                    self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                    
                elif path == '/api/orders':
                    if isinstance(json_data, list):
                        if not self._is_admin_authorized():
                            self._set_headers(401, 'application/json')
                            self.wfile.write(json.dumps({"success": False, "error": "غير مصرح"}).encode('utf-8'))
                            return
                        db.orders.delete_many({})
                        if json_data:
                            db.orders.insert_many(json_data)
                        self._set_headers(200, 'application/json; charset=utf-8')
                        self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                    else:
                        validated_order = self._validate_and_recalculate_order_mg(json_data)
                        if not validated_order:
                            self._set_headers(400, 'application/json')
                            self.wfile.write(json.dumps({"success": False, "error": "الكمية غير متوفرة أو البيانات غير صالحة"}).encode('utf-8'))
                            return
                        self._set_headers(200, 'application/json; charset=utf-8')
                        self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                    
            except Exception as e:
                self._set_headers(400, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404, 'text/plain')
            self.wfile.write(b"Endpoint Not Found")

    def _validate_and_recalculate_order_mg(self, order_data):
        """ حماية المخزون والأسعار باستخدام معاملات السحابة المعزولة ومطابقة الأكواد """
        if not order_data.get('customerName') or not order_data.get('customerPhone'):
            return None

        items = order_data.get('items', [])
        if not items:
            return None

        with client.start_session() as session:
            with session.start_transaction():
                usdToSar_doc = db.settings.find_one({'key': 'usdToSarRate'}, session=session)
                usdToYer_doc = db.settings.find_one({'key': 'usdToYerRate'}, session=session)
                usdToSar = usdToSar_doc['value'] if usdToSar_doc else 3.75
                usdToYer = usdToYer_doc['value'] if usdToYer_doc else 1600.0

                calculated_subtotal_usd = 0
                updated_items = []

                for item in items:
                    p_id = item.get('id')
                    qty = item.get('quantity', 0)
                    if qty <= 0:
                        session.abort_transaction()
                        return None

                    db_prod = db.products.find_one({'id': p_id}, session=session)
                    if not db_prod or db_prod.get('stock', 0) < qty:
                        session.abort_transaction()
                        return None

                    # حجز الكمية وخصمها من السحابة آلياً
                    db.products.update_one(
                        {'id': p_id},
                        {'$inc': {'stock': -qty}},
                        session=session
                    )

                    price_usd = db_prod['price']
                    calculated_subtotal_usd += price_usd * qty

                    currency = order_data.get('currency', 'USD')
                    item_converted_price = price_usd
                    if currency == 'SAR': item_converted_price = round(price_usd * usdToSar)
                    elif currency == 'YER': item_converted_price = round(price_usd * usdToYer)

                    updated_items.append({
                        "id": p_id,
                        "title": item.get('title', db_prod['title']),
                        "price": item_converted_price,
                        "quantity": qty
                    })

                # تطبيق خصم كوبون الترويج إن وُجد وكان صالحاً
                promo_code = order_data.get('promoCode')
                discount_rate = 0
                if promo_code:
                    coupons_doc = db.settings.find_one({'key': 'coupons'}, session=session)
                    coupons = coupons_doc['value'] if coupons_doc else []
                    for cp in coupons:
                        if cp.get('code') == promo_code:
                            is_valid = True
                            # التحقق من تاريخ انتهاء الصلاحية
                            exp_date_str = cp.get('expiryDate')
                            if exp_date_str:
                                try:
                                    import datetime
                                    exp_date = datetime.datetime.strptime(exp_date_str, "%Y-%m-%d").date()
                                    if datetime.date.today() > exp_date:
                                        is_valid = False
                                except Exception:
                                    pass
                            # التحقق من حد الاستخدام
                            usage_limit = cp.get('usageLimit', 0)
                            usage_count = cp.get('usageCount', 0)
                            if usage_limit > 0 and usage_count >= usage_limit:
                                is_valid = False
                                
                            if is_valid:
                                discount_rate = cp.get('discount', 0) / 100.0
                                cp['usageCount'] = usage_count + 1
                                # حفظ الكوبونات المحدثة في قاعدة البيانات السحابية
                                db.settings.update_one(
                                    {'key': 'coupons'},
                                    {'$set': {'value': coupons}},
                                    session=session
                                )
                            break

                currency = order_data.get('currency', 'USD')
                final_total = calculated_subtotal_usd
                if discount_rate > 0:
                    final_total = final_total - (final_total * discount_rate)

                if currency == 'SAR': final_total = round(final_total * usdToSar)
                elif currency == 'YER': final_total = round(final_total * usdToYer)

                order_data['items'] = updated_items
                order_data['totalPrice'] = final_total

                # تسجيل الطلب دائمياً في السحابة
                db.orders.insert_one(order_data, session=session)
                
                if '_id' in order_data:
                    del order_data['_id']

                return order_data

    def _handle_get_products(self):
        products = list(db.products.find({}, {'_id': 0}))
        self._set_headers(200, 'application/json; charset=utf-8')
        self.wfile.write(json.dumps(products, ensure_ascii=False, indent=2).encode('utf-8'))

    def _handle_get_orders(self):
        orders = list(db.orders.find({}, {'_id': 0}))
        self._set_headers(200, 'application/json; charset=utf-8')
        self.wfile.write(json.dumps(orders, ensure_ascii=False, indent=2).encode('utf-8'))

    def _handle_get_settings(self):
        settings = {}
        for doc in db.settings.find({}, {'_id': 0}):
            settings[doc['key']] = doc['value']
            
        if not settings:
            settings = {
                "storeName": "Game Zone Store", "currency": "USD",
                "enableCod": True, "enableBank": True, "enableCard": True,
                "usdToSarRate": 3.75, "usdToYerRate": 1600.0,
                "enableBcash": True, "enableQurooshi": True, "enableKuraimi": True
            }
        self._set_headers(200, 'application/json; charset=utf-8')
        self.wfile.write(json.dumps(settings, ensure_ascii=False, indent=2).encode('utf-8'))


class ThreadingTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == '__main__':
    os.makedirs(STATIC_DIR, exist_ok=True)
    init_db()  # تشغيل نظام التحقق والمهاجرة للبيانات القديمة
    with ThreadingTCPServer(("", PORT), StoreHTTPRequestHandler) as httpd:
        print(f"Server is running globally and securely via MongoDB Atlas at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()
