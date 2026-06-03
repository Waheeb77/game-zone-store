import http.server
import socketserver
import json
import os
import urllib.parse

PORT = 8000
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'products.json')
ORDERS_FILE = os.path.join(os.path.dirname(__file__), 'orders.json')
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), 'settings.json')

class StoreHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    
    def log_message(self, format, *args):
        # Override to prevent stdout spam
        pass

    def _set_headers(self, status=200, content_type='text/html; charset=utf-8'):
        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        # Handle API Routes
        if path == '/api/products':
            self._handle_get_json(PRODUCTS_FILE)
        elif path == '/api/orders':
            self._handle_get_json(ORDERS_FILE)
        elif path == '/api/settings':
            self._handle_get_json(SETTINGS_FILE)
        else:
            # Handle Static Files
            if path == '/' or path == '':
                filename = 'index.html'
            else:
                filename = path.lstrip('/')

            filepath = os.path.join(STATIC_DIR, filename)
            
            # Prevent directory traversal attacks
            real_filepath = os.path.realpath(filepath)
            real_static_dir = os.path.realpath(STATIC_DIR)
            if not real_filepath.startswith(real_static_dir):
                self._set_headers(403, 'text/plain')
                self.wfile.write(b"403 Forbidden")
                return

            if os.path.exists(filepath) and os.path.isfile(filepath):
                # Determine Content-Type
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
                # Page not found
                # Fallback to index.html if you want SPA behavior, but for simplicity: 404
                self._set_headers(404, 'text/html; charset=utf-8')
                error_html = b"""<!DOCTYPE html>
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>404 Not Found</h1>
                    <p>The requested file was not found on this server.</p>
                </body>
                </html>"""
                self.wfile.write(error_html)

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path in ['/api/products', '/api/orders', '/api/settings']:
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                json_data = json.loads(post_data.decode('utf-8'))
                
                if path == '/api/products':
                    self._handle_save_json(PRODUCTS_FILE, json_data)
                elif path == '/api/orders':
                    # For orders, we want to append to the list rather than overwrite entirely if it's a single order,
                    # or if the admin sends a full updated list of orders, handle it accordingly.
                    # Standard checkout sends a single order object.
                    # Admin can send a list of orders (e.g. to update status / delete an order).
                    if isinstance(json_data, list):
                        self._handle_save_json(ORDERS_FILE, json_data)
                    else:
                        # Append single order
                        orders = []
                        if os.path.exists(ORDERS_FILE):
                            try:
                                with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
                                    orders = json.load(f)
                            except Exception:
                                orders = []
                        orders.append(json_data)
                        self._handle_save_json(ORDERS_FILE, orders)
                elif path == '/api/settings':
                    self._handle_save_json(SETTINGS_FILE, json_data)
                    
            except Exception as e:
                self._set_headers(400, 'application/json')
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404, 'text/plain')
            self.wfile.write(b"Endpoint Not Found")

    def _handle_get_json(self, filepath):
        if not os.path.exists(filepath):
            # Create empty array/object if file doesn't exist
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
    # Ensure static directory exists
    os.makedirs(STATIC_DIR, exist_ok=True)
    
    # Start server
    with ThreadingTCPServer(("", PORT), StoreHTTPRequestHandler) as httpd:
        print(f"Server is running at: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()
