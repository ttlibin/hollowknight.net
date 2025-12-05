#!/usr/bin/env python3
"""
简单的HTTP服务器启动脚本
用于解决YouTube视频嵌入的Referer标头问题
"""

import http.server
import socketserver
import webbrowser
import os

# 设置端口
PORT = 8000

# 获取当前目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头部，允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🚀 服务器启动成功！")
            print(f"📍 访问地址: http://localhost:{PORT}")
            print(f"📍 访地址: http://127.0.0.1:{PORT}")
            print(f"🎮 Hollow Knight 攻略站已在本地运行")
            print(f"⏹️  按 Ctrl+C 停止服务器")
            print("-" * 50)

            # 自动打开浏览器
            webbrowser.open(f'http://localhost:{PORT}')

            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        print("💡 确保端口 {PORT} 没有被占用")

if __name__ == "__main__":
    main()