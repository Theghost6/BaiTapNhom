from flask import Flask, request, jsonify
import requests
import re
import urllib.parse
import html
from flask_cors import CORS
import datetime
import time
import threading
from collections import defaultdict, deque
from flask_limiter.errors import RateLimitExceeded

app = Flask(__name__)
CORS(app)

# Cấu hình bảo mật
class SecurityConfig:
    MAX_REQUESTS_PER_MINUTE = 60  # Số request tối đa mỗi phút
    MAX_SQLI_ATTEMPTS = 3  # Số lần thử SQLi trước khi ban
    BAN_DURATION = 300  # Thời gian ban (giây) - 5 phút
    CLEANUP_INTERVAL = 60  # Interval để cleanup expired data (giây)
    MAX_INPUT_LENGTH = 128

# Tracking data structures
request_tracker = defaultdict(lambda: deque())  # IP -> timestamps
sqli_attempts = defaultdict(int)  # IP -> count
banned_ips = {}  # IP -> ban_time
threat_scores = defaultdict(int)  # IP -> threat score

# Lock for thread safety
lock = threading.Lock()

def cleanup_expired_data():
    """Cleanup expired tracking data"""
    current_time = time.time()
    
    with lock:
        # Cleanup request tracker (older than 1 minute)
        for ip in list(request_tracker.keys()):
            while request_tracker[ip] and current_time - request_tracker[ip][0] > 60:
                request_tracker[ip].popleft()
            if not request_tracker[ip]:
                del request_tracker[ip]
        
        # Cleanup banned IPs (expired bans)
        expired_ips = []
        for ip, ban_time in banned_ips.items():
            if current_time - ban_time > SecurityConfig.BAN_DURATION:
                expired_ips.append(ip)
        
        for ip in expired_ips:
            del banned_ips[ip]
            sqli_attempts[ip] = 0  # Reset SQLi attempts
            threat_scores[ip] = max(0, threat_scores[ip] - 50)  # Reduce threat score
            log_security_event(ip, "IP_UNBANNED", "Ban expired", {})

def is_ip_banned(ip):
    """Check if IP is currently banned"""
    current_time = time.time()
    if ip in banned_ips:
        if current_time - banned_ips[ip] < SecurityConfig.BAN_DURATION:
            return True
        else:
            # Ban expired, remove from banned list
            with lock:
                del banned_ips[ip]
    return False

def ban_ip(ip, reason):
    """Ban an IP address"""
    current_time = time.time()
    with lock:
        banned_ips[ip] = current_time
        threat_scores[ip] += 100
    log_security_event(ip, "IP_BANNED", reason, {"ban_duration": SecurityConfig.BAN_DURATION})

def check_dos_attack(ip):
    """Check for DoS attack patterns"""
    current_time = time.time()
    
    with lock:
        # Add current request timestamp
        request_tracker[ip].append(current_time)
        
        # Count requests in last minute
        recent_requests = sum(1 for t in request_tracker[ip] if current_time - t <= 60)
        
        # Check if exceeding rate limit
        if recent_requests > SecurityConfig.MAX_REQUESTS_PER_MINUTE:
            threat_scores[ip] += 20
            return True, f"DoS detected: {recent_requests} requests in 1 minute"
    
    return False, ""

def detect_attack_patterns(text, ip):
    """Detect various attack patterns and update threat scores"""
    attacks_detected = []
    
    # SQL Injection patterns
    if has_sql_pattern(text):
        attacks_detected.append("SQLi")
        with lock:
            sqli_attempts[ip] += 1
            threat_scores[ip] += 30
    
    # XSS patterns
    xss_patterns = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>',
        r'eval\s*\(',
        r'alert\s*\(',
    ]
    
    for pattern in xss_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            attacks_detected.append("XSS")
            with lock:
                threat_scores[ip] += 25
            break
    
    # Command injection patterns
    cmd_patterns = [
        r';\s*(ls|cat|pwd|whoami|id|uname)',
        r'\|\s*(ls|cat|pwd|whoami|id|uname)',
        r'`[^`]*`',
        r'\$\([^)]*\)',
    ]
    
    for pattern in cmd_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            attacks_detected.append("CMD_INJECTION")
            with lock:
                threat_scores[ip] += 35
            break
    
    return attacks_detected

@app.errorhandler(RateLimitExceeded)
def handle_rate_limit(e):
    ip = request.remote_addr
    path = request.path
    reason = "Rate limit exceeded"
    
    # Increase threat score for rate limiting
    with lock:
        threat_scores[ip] += 15
    
    log_security_event(ip, "RATE_LIMIT", reason, {})
    
    # Ban IP if too many rate limit violations
    if threat_scores[ip] >= 100:
        ban_ip(ip, "Multiple rate limit violations")
    
    return jsonify({"success": False, "message": "Too many requests, please slow down"}), 429

# Enhanced SQLi patterns
SQLI_PATTERNS = [
    r"(?i)\b(AND|OR)\b\s+\d+=\d+",
    r"(?i)UNION\s+ALL\s+SELECT",
    r"(?i)UNION\s+SELECT",
    r"(?i)ORDER\s+BY\s+\d+",
    r"(?i)GROUP\s+BY\s+\d+",
    r"(?i)HAVING\s+\d+=\d+",
    r"(?i)SLEEP\s*\(\s*\d+\s*\)",
    r"(?i)WAITFOR\s+DELAY",
    r"(?i)BENCHMARK\s*\(",
    r"(?i)information_schema\.",
    r"(?i)mysql\.user",
    r"(?i)pg_database",
    r"(?i)\bCONCAT\s*\(",
    r"(?i)\bversion\(\)",
    r"(?i)\b@@version",
    r"(?i)\buser\(\)",
    r"(?i)\bdatabase\(\)",
    r"(?i)load_file\s*\(",
    r"(?i)into\s+outfile",
    r"(?i)into\s+dumpfile",
    r"(?i)\bxp_cmdshell",
    r"(?i)sp_executesql",
    r"(?i)exec\s*\(",
    r"(?i)execute\s*\(",
    r"(?i)char\s*\(\s*\d+\s*\)",
    r"(?i)ascii\s*\(",
    r"(?i)substring\s*\(",
    r"(?i)mid\s*\(",
    r"(?i)convert\s*\(",
    r"(?i)cast\s*\(",
]

compiled_patterns = [re.compile(p) for p in SQLI_PATTERNS]

# Enhanced dangerous characters
DANGEROUS_CHARS = ["'", '"', ";", "--", "/*", "*/", "#", "\\", "%00", "%", "<", ">", "`", 
                   "0x", "char(", "chr(", "||", "&&"]

def log_security_event(ip, event_type, reason, data):
    """Enhanced logging with threat levels"""
    try:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        threat_level = "HIGH" if threat_scores.get(ip, 0) >= 100 else "MEDIUM" if threat_scores.get(ip, 0) >= 50 else "LOW"
        
        with open("security_log.txt", "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {event_type} | IP: {ip} | Threat: {threat_level} | "
                   f"Score: {threat_scores.get(ip, 0)} | Reason: {reason} | Data: {data}\n")
        
        print(f"Security Event: {event_type} - {ip} - {reason} (Threat Score: {threat_scores.get(ip, 0)})")
    except Exception as e:
        print(f"Error writing security log: {e}")

def normalize(text):
    """Enhanced normalization with more decode attempts"""
    if not isinstance(text, str):
        text = str(text)
    
    # Multiple URL decode attempts
    for _ in range(5):
        try:
            decoded = urllib.parse.unquote(text)
            if decoded == text:
                break
            text = decoded
        except:
            break
    
    # HTML decode
    try:
        text = html.unescape(text)
    except:
        pass
    
    # Remove comments and normalize whitespace
    text = re.sub(r'\/\*.*?\*\/|--.*?(\n|$)|#.*?(\n|$)', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Convert to lowercase for pattern matching
    return text

def has_sql_pattern(text):
    """Check for SQL injection patterns"""
    text_lower = text.lower()
    for pattern in compiled_patterns:
        if pattern.search(text_lower):
            return True
    return False

def has_dangerous_chars(text):
    """Check for dangerous characters"""
    text_lower = text.lower()
    for char in DANGEROUS_CHARS:
        if char in text_lower:
            return True
    return False

def is_valid_email(email):
    """Validate email format"""
    return re.fullmatch(r"^[\w\.-]+@[\w\.-]+\.\w+$", email)

def is_valid_password(password):
    """Validate password format"""
    return re.fullmatch(r"^[A-Za-z0-9@#$%^&+=]{6,32}$", password)

def comprehensive_input_validation(data, ip):
    """Comprehensive input validation with attack detection"""
    for key, value in data.items():
        text = normalize(str(value))
        
        # Length check
        if len(text) > SecurityConfig.MAX_INPUT_LENGTH:
            return False, f"Input too long at {key}", ["LENGTH_VIOLATION"]
        
        # Detect attack patterns
        attacks = detect_attack_patterns(text, ip)
        
        # Basic security checks
        if has_dangerous_chars(text):
            attacks.append("DANGEROUS_CHARS")
            with lock:
                threat_scores[ip] += 10
        
        if attacks:
            return False, f"Security violation at {key}: {', '.join(attacks)}", attacks
    
    return True, "OK", []

@app.before_request
def security_check():
    """Pre-request security check"""
    ip = request.remote_addr
    
    # Check if IP is banned
    if is_ip_banned(ip):
        log_security_event(ip, "BLOCKED_REQUEST", "IP is banned", {"path": request.path})
        return jsonify({"success": False, "message": "Access denied"}), 403
    
    # Check for DoS attack
    is_dos, dos_reason = check_dos_attack(ip)
    if is_dos:
        ban_ip(ip, dos_reason)
        return jsonify({"success": False, "message": "Access denied - DoS detected"}), 429
    
    # Check if SQLi attempts threshold reached
    if sqli_attempts.get(ip, 0) >= SecurityConfig.MAX_SQLI_ATTEMPTS:
        ban_ip(ip, f"Multiple SQLi attempts: {sqli_attempts[ip]}")
        return jsonify({"success": False, "message": "Access denied - Security violation"}), 403

@app.route("/api/register", methods=["POST"])
def register():
    ip = request.remote_addr
    path = request.path

    # Check query parameters
    for key, value in request.args.items():
        text = normalize(value)
        attacks = detect_attack_patterns(text, ip)
        
        if (len(text) > SecurityConfig.MAX_INPUT_LENGTH or 
            has_dangerous_chars(text) or has_sql_pattern(text) or attacks):
            
            log_security_event(ip, "BLOCKED_QUERY", f"Malicious query parameter: {key}", 
                             {"attacks": attacks, "value": value[:50]})
            
            # Check if should ban IP
            if sqli_attempts.get(ip, 0) >= SecurityConfig.MAX_SQLI_ATTEMPTS or threat_scores.get(ip, 0) >= 100:
                ban_ip(ip, "Multiple security violations in query parameters")
            
            return jsonify({"success": False, "message": "Invalid input"}), 400

    # Check form data
    for key, value in request.form.items():
        text = normalize(value)
        attacks = detect_attack_patterns(text, ip)
        
        if (len(text) > SecurityConfig.MAX_INPUT_LENGTH or 
            has_dangerous_chars(text) or has_sql_pattern(text) or attacks):
            
            log_security_event(ip, "BLOCKED_FORM", f"Malicious form data: {key}", 
                             {"attacks": attacks, "value": value[:50]})
            
            if sqli_attempts.get(ip, 0) >= SecurityConfig.MAX_SQLI_ATTEMPTS or threat_scores.get(ip, 0) >= 100:
                ban_ip(ip, "Multiple security violations in form data")
            
            return jsonify({"success": False, "message": "Invalid input"}), 400

    # Check JSON body
    data = request.get_json(silent=True)
    if data:
        valid, reason, attacks = comprehensive_input_validation(data, ip)
        if not valid:
            log_security_event(ip, "BLOCKED_JSON", reason, {"attacks": attacks, "data": str(data)[:100]})
            
            # Check if should ban IP
            if sqli_attempts.get(ip, 0) >= SecurityConfig.MAX_SQLI_ATTEMPTS or threat_scores.get(ip, 0) >= 100:
                ban_ip(ip, "Multiple security violations in JSON data")
            
            return jsonify({"success": False, "message": "Invalid input"}), 400

    # Forward to backend if all checks pass
    try:
        resp = requests.post("http://localhost/BaiTapNhom/backend/register.php",
                             json=data, headers={'Content-Type': 'application/json'}, timeout=10)
        
        # Log successful request
        log_security_event(ip, "ALLOWED_REQUEST", "Request passed all security checks", {"path": path})
        
        return jsonify(resp.json()), resp.status_code
    except requests.exceptions.RequestException as e:
        log_security_event(ip, "BACKEND_ERROR", f"Backend connection failed: {str(e)}", {})
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route("/api/security/status")
def security_status():
    """Admin endpoint to check security status"""
    with lock:
        return jsonify({
            "banned_ips": list(banned_ips.keys()),
            "high_threat_ips": {ip: score for ip, score in threat_scores.items() if score >= 50},
            "total_tracked_ips": len(request_tracker),
            "config": {
                "max_requests_per_minute": SecurityConfig.MAX_REQUESTS_PER_MINUTE,
                "max_sqli_attempts": SecurityConfig.MAX_SQLI_ATTEMPTS,
                "ban_duration": SecurityConfig.BAN_DURATION
            }
        })

# Background cleanup thread
def start_cleanup_thread():
    def cleanup_worker():
        while True:
            time.sleep(SecurityConfig.CLEANUP_INTERVAL)
            cleanup_expired_data()
    
    cleanup_thread = threading.Thread(target=cleanup_worker, daemon=True)
    cleanup_thread.start()

if __name__ == "__main__":
    # Start cleanup thread
    start_cleanup_thread()
    
    print("Enhanced WAF Security Features:")
    print(f"- DoS Protection: Max {SecurityConfig.MAX_REQUESTS_PER_MINUTE} requests/minute")
    print(f"- SQLi Protection: Max {SecurityConfig.MAX_SQLI_ATTEMPTS} attempts before ban")
    print(f"- IP Ban Duration: {SecurityConfig.BAN_DURATION} seconds")
    print(f"- Threat Scoring System: Active")
    print(f"- Attack Pattern Detection: SQLi, XSS, Command Injection")
    print("- Security Logging: Enhanced")
    
    app.run(host="0.0.0.0", port=5000, debug=False)