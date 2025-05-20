from flask import Flask, request, jsonify
import requests
import re
from flask_cors import CORS
import html
import urllib.parse
import logging

# Thiết lập logging đơn giản
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='sqlmap_protection.log'
)
logger = logging.getLogger('waf')

app = Flask(__name__)
CORS(app)

def normalize_input(input_string):
    """Chuẩn hóa input để phát hiện các tấn công SQLmap."""
    if not isinstance(input_string, str):
        return str(input_string)
        
    # Decode URL encoding
    try:
        decoded = urllib.parse.unquote(input_string)
    except Exception:
        decoded = input_string
        
    # Decode HTML entities
    try:
        decoded = html.unescape(decoded)
    except Exception:
        pass
        
    # Xử lý các kỹ thuật obfuscation
    decoded = re.sub(r'(?:\/\*.*?\*\/)|(?:--.*?$)|(?:#.*?$)', ' ', decoded, flags=re.MULTILINE)
    decoded = re.sub(r'\s+', ' ', decoded)  # Chuẩn hóa khoảng trắng
    
    # Lowercase, strip spaces
    decoded = decoded.lower().strip()
    return decoded

def detect_sqli(input_string):
    """Phát hiện SQL Injection với các biểu thức regex nhắm vào SQLmap."""
    if not input_string:
        return False
        
    input_string = normalize_input(input_string)
    
    # Các biểu thức regex cơ bản
    basic_patterns = [
        r"(union\s+select)",
        r"(or\s+1\s*=\s*1)",
        r"(\sor\s+[\d]+=[\d])",  # Phát hiện OR boolean
        r"(--|\#|;)",
        r"(drop\s+table)",
        r"(information_schema)",
        r"(sleep\s*\()",
        r"(benchmark\s*\()",
        r"(waitfor\s+delay)",
        r"(select\s+.*from)",
        r"(insert\s+into)",
        r"(update\s+.*set)",
        r"(delete\s+from)",
        r"(xp_cmdshell)",
    ]
    
    # Các biểu thức regex nhắm vào SQLmap cụ thể
    sqlmap_patterns = [
        # Phát hiện boolean-based blind SQL injection
        r"(['\"]\s+OR\s+NOT\s+[\d]+=[\d])",
        r"(['\"]\s+AND\s+[\d]+=[\d])",
        r"(OR\s+NOT\s+[\d]+=[\d]+#)",
        r"(AND\s+[\d]+=[\d]+#)",
        r"(OR\s+SLEEP\s*\(\d+\)#)",
        
        # SQLmap specific fingerprints
        r"(sqlmap)",
        r"(AND\s+\d+=\d+)",
        r"(ORDER\s+BY\s+\d+)",
        r"(\)\s*LIMIT\s+\d+,\s*\d+)",
        r"(CONCAT\s*\(\d+,\s*\d+\))",
        r"(CONCAT_WS\s*\(\d+,\s*\d+\))",
        r"(0x[0-9a-f]{6,})",  # Hex encoded strings SQLmap thường dùng
        
        # SQLmap time-based techniques
        r"(pg_sleep\s*\()",
        r"(SLEEP\s*\(\d+\))",
        r"(SELECT\s+IF\s*\()",
        r"(CASE\s+WHEN\s+\(.*\)\s+THEN)",
        
        # SQLmap boolean-based techniques
        r"(1\s*AND\s*\d+=\d+\s*--)",
        r"(1\s*OR\s*\d+=\d+\s*--)",
        r"(1\s*AND\s*\(SELECT\s*\d+\s*FROM)",
        r"(1\s*OR\s*\(SELECT\s*\d+\s*FROM)",
        
        # SQLmap UNION based techniques
        r"(UNION\s+ALL\s+SELECT\s+NULL)",
        r"(UNION\s+ALL\s+SELECT\s+\d+)",
        r"(LIMIT\s+\d+,\s*\d+)",
        
        # SQLmap error-based payloads
        r"(extractvalue\s*\()",
        r"(updatexml\s*\()",
        r"(floor\s*\(rand\s*\()",
        r"(procedure\s+analyse\s*\()",
        
        # SQLmap specific orderings
        r"(ORDER\s+BY\s+\d+--)",
        r"(ORDER\s+BY\s+\d+#)",
        
        # SQLmap specific comments
        r"(/\*!)", 
        r"(/\*\d+)",
    ]
    
    # Kiểm tra tất cả các mẫu
    all_patterns = basic_patterns + sqlmap_patterns
    for pattern in all_patterns:
        if re.search(pattern, input_string, re.IGNORECASE):
            logger.warning(f"Phát hiện SQLmap attack pattern: {pattern} trong: {input_string}")
            return True
    
    # Kiểm tra thêm các mẫu boolean-based và time-based cụ thể của SQLmap
    if re.search(r"['\"]\s*or\s+not\s+", input_string, re.IGNORECASE):
        logger.warning(f"Phát hiện boolean-based pattern: {input_string}")
        return True
        
    if re.search(r"['\"]\s*or\s+sleep\s*\(", input_string, re.IGNORECASE):
        logger.warning(f"Phát hiện time-based pattern: {input_string}")
        return True
    
    # Kiểm tra User-Agent nếu đó là một trong các tham số
    if "sqlmap" in input_string or "acunetix" in input_string:
        logger.warning(f"Phát hiện công cụ tấn công trong văn bản: {input_string}")
        return True
    
    return False

def detect_sqlmap_useragent(user_agent):
    """Phát hiện SQLmap thông qua User-Agent."""
    if not user_agent:
        return False
        
    user_agent = user_agent.lower()
    sqlmap_agents = [
        "sqlmap", "acunetix", "netsparker", "havij", "appscan"
    ]
    
    for agent in sqlmap_agents:
        if agent in user_agent:
            logger.warning(f"Phát hiện công cụ tấn công trong User-Agent: {user_agent}")
            return True
            
    return False

@app.route("/api/register", methods=["POST"])
def waf_register():
    """Endpoint đăng ký với bảo vệ chống SQLmap."""
    # Lấy IP cho logging
    ip = request.remote_addr
    if request.headers.get('X-Forwarded-For'):
        ip = request.headers.get('X-Forwarded-For').split(',')[0].strip()
    
    # Kiểm tra User-Agent
    user_agent = request.headers.get('User-Agent', '')
    if detect_sqlmap_useragent(user_agent):
        logger.warning(f"Chặn request từ IP {ip} với User-Agent đáng ngờ: {user_agent}")
        return jsonify({
            "success": False, 
            "message": "Phát hiện công cụ tấn công không được phép!"
        }), 403
    
    # Kiểm tra các tham số trong URL
    for param, value in request.args.items():
        if detect_sqli(value):
            logger.warning(f"Phát hiện SQLmap từ IP {ip} trong tham số URL: {param}={value}")
            return jsonify({
                "success": False, 
                "message": "Phát hiện SQL Injection!"
            }), 403  # Sử dụng 403 thay vì 400
    
    # Kiểm tra các tham số trong form
    for param, value in request.form.items():
        if detect_sqli(value):
            logger.warning(f"Phát hiện SQLmap từ IP {ip} trong tham số form: {param}={value}")
            return jsonify({
                "success": False, 
                "message": "Phát hiện SQL Injection!"
            }), 403  # Sử dụng 403 thay vì 400
    
    # Kiểm tra JSON data
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"success": False, "message": "Không nhận được dữ liệu từ client"}), 400
        
        # Log input để debug
        safe_data = {k: v for k, v in data.items() if k.lower() != 'password'}
        logger.info(f"Input từ IP {ip}: {safe_data}")
        
        # Kiểm tra từng trường trong JSON
        for key, value in data.items():
            value_str = str(value)
            if detect_sqli(value_str):
                logger.warning(f"Phát hiện SQLmap từ IP {ip} trong trường JSON {key}: {value_str}")
                return jsonify({
                    "success": False, 
                    "message": "Phát hiện SQL Injection!"
                }), 403  # Sử dụng 403 thay vì 400
        
        # Kiểm tra các kiểu tấn công kết hợp
        combined_input = ' '.join(str(v) for v in data.values())
        if detect_sqli(combined_input):
            logger.warning(f"Phát hiện SQLmap từ IP {ip} trong dữ liệu kết hợp")
            return jsonify({
                "success": False, 
                "message": "Phát hiện SQL Injection!"
            }), 403
    except Exception as e:
        logger.error(f"Lỗi xử lý input từ IP {ip}: {str(e)}")
        return jsonify({
            "success": False, 
            "message": "Dữ liệu không hợp lệ"
        }), 400
    
    # Gửi request đến backend
    headers = {
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
        'X-WAF-Scan-Result': 'clean'
    }
    
    try:
        resp = requests.post(
            "http://localhost/BaiTapNhom/backend/register.php", 
            json=data, 
            headers=headers,
            timeout=5
        )
        
        # Kiểm tra response trước khi trả về
        # Nếu có thông tin nhạy cảm, hãy loại bỏ
        try:
            resp_json = resp.json()
            # Lọc bỏ dữ liệu nhạy cảm nếu cần
            return jsonify(resp_json), resp.status_code
        except ValueError:
            return jsonify({
                "success": False, 
                "message": f"Lỗi từ backend: {resp.text}"
            }), resp.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({
            "success": False, 
            "message": "Kết nối backend quá hạn"
        }), 504
        
    except requests.exceptions.RequestException as req_err:
        return jsonify({
            "success": False, 
            "message": f"Lỗi kết nối backend: {str(req_err)}"
        }), 500

# Thêm honeypot database để đánh lừa SQLmap
FAKE_DATABASE = {
    "tables": ["users", "products", "orders", "categories"],
    "users": ["id", "username", "email", "password", "created_at"],
    "columns": {
        "users": ["id", "username", "email", "password", "created_at"],
        "products": ["id", "name", "description", "price", "stock"],
        "orders": ["id", "user_id", "total", "status", "created_at"],
        "categories": ["id", "name", "parent_id"]
    }
}

# Thêm route kiểm tra SQLmap riêng biệt
@app.route("/api/check", methods=["GET", "POST"])
def check_sqlmap():
    """Route kiểm tra SQLmap để giúp điều hướng các cuộc tấn công vào honeypot."""
    ip = request.remote_addr
    if request.headers.get('X-Forwarded-For'):
        ip = request.headers.get('X-Forwarded-For').split(',')[0].strip()
    
    query_param = request.args.get('id', '')
    
    # Nếu có tham số id, giả vờ bị lỗi SQL để SQLmap tập trung vào endpoint này
    if query_param:
        if detect_sqli(query_param):
            logger.warning(f"Phát hiện SQLmap trong honeypot từ IP {ip}: {query_param}")
            
            # Trả về lỗi SQL giả với tên database giả để đánh lừa SQLmap
            if "UNION" in query_param.upper() or "SELECT" in query_param.upper():
                return "Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version", 200
            elif "database" in query_param.lower() or "schema" in query_param.lower():
                return "Error: Database 'form_dummy' selected", 200
            
    # Mặc định trả về OK
    return "OK", 200

# Thêm route chuyên biệt để đánh lừa SQLmap
@app.route("/api/products", methods=["GET"])
def fake_products():
    """Route giả để đánh lừa SQLmap."""
    id_param = request.args.get('id', '')
    
    # Nếu có dấu hiệu SQLi, trả về dữ liệu giả
    if id_param and detect_sqli(id_param):
        logger.info(f"Trả về dữ liệu giả cho SQLmap với tham số: {id_param}")
        # Trả về dữ liệu giả
        if "1=1" in id_param or "SLEEP" in id_param.upper():
            return jsonify([
                {"id": 1, "name": "Fake Product 1", "price": 99.99},
                {"id": 2, "name": "Fake Product 2", "price": 199.99}
            ])
        else:
            return "Error executing query: You have an error in your SQL syntax", 200
    
    # Trả về danh sách sản phẩm trống
    return jsonify([])

if __name__ == "__main__":
    # Thêm danh sách IP được phép (whitelist) nếu cần
    app.run(host="0.0.0.0", port=5000)