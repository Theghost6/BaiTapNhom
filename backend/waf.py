from flask import Flask, request, jsonify
import requests
import re
import urllib.parse
import html
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# SQLMap patterns
SQLMAP_PATTERNS = [
    r"AND\s+\d+=\d+", r"OR\s+\d+=\d+", r"UNION\s+ALL\s+SELECT", r"ORDER\s+BY\s+\d+",
    r"SLEEP\s*\(\s*\d+\s*\)", r"pg_sleep\s*\(", r"WAITFOR\s+DELAY", r"BENCHMARK\s*\(",
    r"extractvalue\s*\(", r"updatexml\s*\(", r"floor\s*\(\s*rand", r"0x[0-9a-f]{8,}",
    r"information_schema\.", r"@@version", r"version\(\)", r"CONCAT\s*\("
]

compiled_patterns = [re.compile(p, re.IGNORECASE) for p in SQLMAP_PATTERNS]

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

def is_sqlmap(data):
    if isinstance(data, dict):
        for k, v in data.items():
            if is_sqlmap(k) or is_sqlmap(v):
                return True
    elif isinstance(data, list):
        for item in data:
            if is_sqlmap(item):
                return True
    else:
        text = normalize(str(data))
        for pattern in compiled_patterns:
            if pattern.search(text):
                return True
    return False

@app.route("/api/register", methods=["POST"])
def register():
    # Check all inputs
    for v in request.args.values():
        if is_sqlmap(v):
            return jsonify({"success": False, "message": "Invalid input"}), 400
    
    for v in request.form.values():
        if is_sqlmap(v):
            return jsonify({"success": False, "message": "Invalid input"}), 400
    
    try:
        data = request.get_json(silent=True)
        if data and is_sqlmap(data):
            return jsonify({"success": False, "message": "Invalid input"}), 400
    except:
        pass
    
    # Forward to backend
    try:
        resp = requests.post("http://localhost/BaiTapNhom/backend/register.php", 
                           json=data, headers={'Content-Type': 'application/json'}, timeout=10)
        return jsonify(resp.json()), resp.status_code
    except:
        return jsonify({"success": False, "message": "Server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)