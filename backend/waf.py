from flask import Flask, request, jsonify
import requests
import re
import urllib.parse
import html
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# SQLi pattern bổ sung (nếu muốn)
SQLI_PATTERNS = [
    r"(?i)\b(AND|OR)\b\s+\d+=\d+",
    r"(?i)UNION\s+ALL\s+SELECT",
    r"(?i)ORDER\s+BY\s+\d+",
    r"(?i)SLEEP\s*\(\s*\d+\s*\)",
    r"(?i)WAITFOR\s+DELAY",
    r"(?i)BENCHMARK\s*\(",
    r"(?i)information_schema\.",
    r"(?i)\bCONCAT\s*\(",
    r"(?i)\bversion\(\)",
    r"(?i)\b@@version"
]
compiled_patterns = [re.compile(p) for p in SQLI_PATTERNS]

# Các ký tự nguy hiểm tuyệt đối không cho phép
DANGEROUS_CHARS = ["'", '"', ";", "--", "/*", "*/", "#", "\\", "%00", "%", "=", "<", ">", "`"]

# Hàm log lại request bị chặn
def log_blocked(ip, path, reason, data):
    with open("waf_log.txt", "a") as f:
        f.write(f"[{datetime.datetime.now()}] BLOCKED {ip} {path} - Reason: {reason} - Data: {data}\n")

# Hàm normalize: decode nhiều lớp + xóa comment + chuẩn hóa khoảng trắng
def normalize(text):
    if not isinstance(text, str):
        text = str(text)
    for _ in range(3):
        try:
            decoded = urllib.parse.unquote(text)
            if decoded == text:
                break
            text = decoded
        except:
            break
    try:
        text = html.unescape(text)
    except:
        pass
    text = re.sub(r'\/\*.*?\*\/|--.*?(\n|$)|#.*?(\n|$)', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

# Hàm kiểm tra pattern SQLi
def has_sql_pattern(text):
    for pattern in compiled_patterns:
        if pattern.search(text):
            return True
    return False

# Hàm kiểm tra ký tự nguy hiểm
def has_dangerous_chars(text):
    for char in DANGEROUS_CHARS:
        if char in text:
            return True
    return False

# Whitelist validation từng input (ví dụ email, password)
def is_valid_email(email):
    return re.fullmatch(r"^[\w\.-]+@[\w\.-]+\.\w+$", email)

def is_valid_password(password):
    return re.fullmatch(r"^[A-Za-z0-9@#$%^&+=]{6,32}$", password)

def validate_input(data):
    for key, value in data.items():
        text = normalize(str(value))
        if len(text) > 128:
            return False, f"Input too long at {key}"
        if has_dangerous_chars(text):
            return False, f"Dangerous characters detected at {key}"
        if has_sql_pattern(text):
            return False, f"SQLi pattern detected at {key}"
    return True, "OK"

@app.route("/api/register", methods=["POST"])
def register():
    ip = request.remote_addr
    path = request.path

    # Kiểm tra query string (nếu có)
    for key, value in request.args.items():
        text = normalize(value)
        if len(text) > 128 or has_dangerous_chars(text) or has_sql_pattern(text):
            log_blocked(ip, path, "Bad query parameter", {key: value})
            return jsonify({"success": False, "message": "Invalid input"}), 400

    # Kiểm tra form data (nếu có)
    for key, value in request.form.items():
        text = normalize(value)
        if len(text) > 128 or has_dangerous_chars(text) or has_sql_pattern(text):
            log_blocked(ip, path, "Bad form data", {key: value})
            return jsonify({"success": False, "message": "Invalid input"}), 400

    # Kiểm tra JSON body
    data = request.get_json(silent=True)
    if data:
        valid, reason = validate_input(data)
        if not valid:
            log_blocked(ip, path, reason, data)
            return jsonify({"success": False, "message": "Invalid input"}), 400

    # Forward tới backend PHP nếu pass hết
    try:
        resp = requests.post("http://localhost/BaiTapNhom/backend/register.php",
                             json=data, headers={'Content-Type': 'application/json'}, timeout=10)
        return jsonify(resp.json()), resp.status_code
    except:
        return jsonify({"success": False, "message": "Server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
