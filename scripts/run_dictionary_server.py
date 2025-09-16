from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from dictionary_api import DictionaryAPI
import asyncio
import threading
from typing import Dict, Any

class DictionaryHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.api = DictionaryAPI()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        try:
            # Parse URL
            parsed_url = urllib.parse.urlparse(self.path)
            path = parsed_url.path
            query_params = urllib.parse.parse_qs(parsed_url.query)
            
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            if path == '/api/search':
                # Handle word search
                word = query_params.get('word', [''])[0]
                result = self.api.search_word(word)
                self.wfile.write(json.dumps(result).encode())
            
            elif path == '/api/suggestions':
                # Handle word suggestions
                partial = query_params.get('partial', [''])[0]
                suggestions = self.api.get_word_suggestions(partial)
                result = {'suggestions': suggestions}
                self.wfile.write(json.dumps(result).encode())
            
            elif path == '/api/health':
                # Health check endpoint
                result = {'status': 'healthy', 'service': 'Dictionary API'}
                self.wfile.write(json.dumps(result).encode())
            
            else:
                # 404 for unknown endpoints
                self.send_response(404)
                self.end_headers()
                error = {'error': 'Endpoint not found'}
                self.wfile.write(json.dumps(error).encode())
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error = {'error': f'Server error: {str(e)}'}
            self.wfile.write(json.dumps(error).encode())
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[Dictionary API] {format % args}")

def run_server(port=8000):
    """Run the dictionary server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, DictionaryHandler)
    print(f"Dictionary API server running on http://localhost:{port}")
    print("Available endpoints:")
    print(f"  - GET /api/search?word=<word>")
    print(f"  - GET /api/suggestions?partial=<partial_word>")
    print(f"  - GET /api/health")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == "__main__":
    run_server()
