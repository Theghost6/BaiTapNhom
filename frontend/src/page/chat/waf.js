let addWafLog = null;
let wafEnabled = true;
try {
    const stored = localStorage.getItem('wafEnabled');
    if (stored !== null) wafEnabled = stored === 'true';
} catch { }

export function setWafEnabled(enabled) {
    wafEnabled = !!enabled;
    try {
        localStorage.setItem('wafEnabled', wafEnabled ? 'true' : 'false');
    } catch { }
}

export function getWafEnabled() {
    return wafEnabled;
}

export const WAF_CONFIG = {
    get ENABLED() {
        return wafEnabled;
    },
    XSS_PROTECTION: true,
    SQL_INJECTION_PROTECTION: true,
    RATE_LIMITING: true,
    DDOS_PROTECTION: true,
    MALICIOUS_FILE_DETECTION: true,
    GEO_BLOCKING: false,
    WAF_URL: 'http://localhost:5000',
    MAX_XSS_ATTEMPTS: 5,
    MAX_SQL_ATTEMPTS: 3,
    MAX_REQUESTS_PER_MINUTE: 100,
    MAX_REQUESTS_PER_HOUR: 1000,
    BLOCK_DURATION: 3600000,
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    MAX_MESSAGE_LENGTH: 5000,
    MIN_MESSAGE_LENGTH: 1,
};

export const blockedIPs = new Map();
const rateLimits = new Map();
const threatAttempts = new Map();
const suspiciousPatterns = new Map();
const geoBlockedCountries = new Set(['CN', 'RU', 'KP']);

export function blockIP(ip, reason = 'Manual block', duration = WAF_CONFIG.BLOCK_DURATION) {
    const expires = Date.now() + duration;
    blockedIPs.set(ip, {
        reason,
        timestamp: new Date().toISOString(),
        attempts: threatAttempts.get(ip) || {},
        expires
    });
    rateLimits.delete(ip);
    const msg = `[WAF] IP ${ip} blocked: ${reason} (expires: ${new Date(expires).toLocaleString()})`;
    console.warn(msg);
    try {
        addWafLog && addWafLog(msg);
        if (typeof global !== 'undefined' && global.io) {
            global.io.emit('waf_log_updated');
        }
    } catch { }
}

export function unblockIP(ip) {
    const wasBlocked = blockedIPs.has(ip);
    blockedIPs.delete(ip);
    threatAttempts.delete(ip);
    suspiciousPatterns.delete(ip);
    rateLimits.delete(ip);
    if (wasBlocked) {
        const msg = `[WAF] IP ${ip} unblocked by admin`;
        console.info(msg);
        try {
            addWafLog && addWafLog(msg);
            if (typeof global !== 'undefined' && global.io) {
                global.io.emit('waf_log_updated');
            }
        } catch { }
    }
}

export function isIPBlocked(ip) {
    const blockInfo = blockedIPs.get(ip);
    if (!blockInfo) return false;
    if (Date.now() > blockInfo.expires) {
        blockedIPs.delete(ip);
        const msg = `[WAF] Block expired for IP ${ip}`;
        console.info(msg);
        try { addWafLog && addWafLog(msg); } catch { }
        return false;
    }
    return true;
}

function checkRateLimit(ip, options = {}) {
    const wafEnabledFlag = typeof options.wafEnabled === 'boolean' ? options.wafEnabled : wafEnabled;
    if (!wafEnabledFlag) return { allowed: true, reason: "WAF is disabled (client)" };
    if (!WAF_CONFIG.RATE_LIMITING) return { allowed: true };
    const now = Date.now();
    const limit = rateLimits.get(ip) || { requests: [], lastRequest: 0 };
    limit.requests = limit.requests.filter(timestamp => now - timestamp < 3600000);
    const lastMinute = limit.requests.filter(timestamp => now - timestamp < 60000).length;
    const lastHour = limit.requests.length;
    if (lastMinute >= WAF_CONFIG.MAX_REQUESTS_PER_MINUTE) {
        return {
            allowed: false,
            reason: 'Rate limit exceeded (per minute)',
            resetTime: 60000
        };
    }
    if (lastHour >= WAF_CONFIG.MAX_REQUESTS_PER_HOUR) {
        return {
            allowed: false,
            reason: 'Rate limit exceeded (per hour)',
            resetTime: 3600000
        };
    }
    limit.requests.push(now);
    limit.lastRequest = now;
    rateLimits.set(ip, limit);
    return { allowed: true };
}

export function advancedXSSDetection(data, options = {}) {
    const wafEnabledFlag = typeof options.wafEnabled === 'boolean' ? options.wafEnabled : wafEnabled;
    if (!wafEnabledFlag) {
        return { valid: true, reason: "WAF is disabled (client)", threats: [], riskScore: 0 };
    }
    const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /<script[^>]*>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /on\w+\s*=\s*['"]/gi,
        /on(load|error|click|focus|blur|change|submit)\s*=/gi,
        /<iframe[^>]*>/gi,
        /<object[^>]*>/gi,
        /<embed[^>]*>/gi,
        /<link[^>]*>/gi,
        /<meta[^>]*>/gi,
        /<form[^>]*>/gi,
        /eval\s*\(/gi,
        /alert\s*\(/gi,
        /confirm\s*\(/gi,
        /prompt\s*\(/gi,
        /document\.(write|cookie|location)/gi,
        /window\.(location|open)/gi,
        /data:text\/html/gi,
        /data:application\/javascript/gi,
        /expression\s*\(/gi,
        /url\s*\(\s*javascript:/gi,
        /%3Cscript/gi,
        /&#x3C;script/gi,
        /&lt;script/gi,
        /style\s*=.*expression/gi,
        /-moz-binding/gi,
        /behavior\s*:/gi,
    ];
    const content = JSON.stringify(data).toLowerCase();
    const detectedPatterns = [];
    for (let i = 0; i < xssPatterns.length; i++) {
        const pattern = xssPatterns[i];
        if (pattern.test(content)) {
            detectedPatterns.push(`XSS_PATTERN_${i + 1}`);
        }
    }
    return {
        valid: detectedPatterns.length === 0,
        reason: detectedPatterns.length > 0 ? "XSS patterns detected" : "XSS validation passed",
        threats: detectedPatterns,
        riskScore: detectedPatterns.length * 10
    };
}

export function sqlInjectionDetection(data, options = {}) {
    const wafEnabledFlag = typeof options.wafEnabled === 'boolean' ? options.wafEnabled : wafEnabled;
    if (!wafEnabledFlag) {
        return { valid: true, threats: [], riskScore: 0, reason: "WAF is disabled (client)" };
    }
    if (!WAF_CONFIG.SQL_INJECTION_PROTECTION) {
        return { valid: true, threats: [], riskScore: 0 };
    }
    const sqlPatterns = [
        /union\s+select/gi,
        /union\s+all\s+select/gi,
        /'\s*or\s*'.*'=/gi,
        /'\s*or\s*1\s*=\s*1/gi,
        /'\s*and\s*1\s*=\s*1/gi,
        /'\s*or\s*true/gi,
        /'\s*and\s*false/gi,
        /sleep\s*\(/gi,
        /benchmark\s*\(/gi,
        /waitfor\s+delay/gi,
        /extractvalue\s*\(/gi,
        /updatexml\s*\(/gi,
        /group_concat\s*\(/gi,
        /;\s*(drop|delete|update|insert|create|alter)\s/gi,
        /information_schema/gi,
        /sysobjects/gi,
        /syscolumns/gi,
        /version\s*\(\s*\)/gi,
        /user\s*\(\s*\)/gi,
        /database\s*\(\s*\)/gi,
        /@@version/gi,
        /\/\*.*\*\//gi,
        /--\s/gi,
        /#.*$/gm,
    ];
    const content = JSON.stringify(data).toLowerCase();
    const detectedPatterns = [];
    for (let i = 0; i < sqlPatterns.length; i++) {
        const pattern = sqlPatterns[i];
        if (pattern.test(content)) {
            detectedPatterns.push(`SQL_PATTERN_${i + 1}`);
        }
    }
    return {
        valid: detectedPatterns.length === 0,
        reason: detectedPatterns.length > 0 ? "SQL injection patterns detected" : "SQL validation passed",
        threats: detectedPatterns,
        riskScore: detectedPatterns.length * 15
    };
}

export function malwareDetection(data, filename = '', options = {}) {
    const wafEnabledFlag = typeof options.wafEnabled === 'boolean' ? options.wafEnabled : wafEnabled;
    if (!wafEnabledFlag) {
        return { valid: true, threats: [], riskScore: 0, reason: "WAF is disabled (client)" };
    }
    if (!WAF_CONFIG.MALICIOUS_FILE_DETECTION) {
        return { valid: true, threats: [], riskScore: 0 };
    }
    const malwarePatterns = [
        /MZ[\x00-\xFF]{2}/,
        /\x7fELF/,
        /%PDF-1\.[0-7]/,
        /powershell\s+-enc/gi,
        /cmd\.exe/gi,
        /rundll32/gi,
        /regsvr32/gi,
        /auto_open\s*\(/gi,
        /workbook_open\s*\(/gi,
        /document_open\s*\(/gi,
        /https?:\/\/[a-z0-9\-\.]+\.(tk|ml|ga|cf)/gi,
        /FromBase64String/gi,
        /base64,/gi,
        /eval\s*\(\s*atob\s*\(/gi,
    ];
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    const detectedPatterns = [];
    if (filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext && !WAF_CONFIG.ALLOWED_FILE_TYPES.includes(ext)) {
            detectedPatterns.push('SUSPICIOUS_FILE_TYPE');
        }
    }
    for (let i = 0; i < malwarePatterns.length; i++) {
        const pattern = malwarePatterns[i];
        if (pattern.test(content)) {
            detectedPatterns.push(`MALWARE_PATTERN_${i + 1}`);
        }
    }
    return {
        valid: detectedPatterns.length === 0,
        reason: detectedPatterns.length > 0 ? "Malicious patterns detected" : "Malware scan passed",
        threats: detectedPatterns,
        riskScore: detectedPatterns.length * 20
    };
}

function validateContent(data) {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    if (content.length > WAF_CONFIG.MAX_MESSAGE_LENGTH) {
        return {
            valid: false,
            reason: "Content too long",
            threats: ["CONTENT_LENGTH_EXCEEDED"],
            riskScore: 5
        };
    }
    if (content.length < WAF_CONFIG.MIN_MESSAGE_LENGTH) {
        return {
            valid: false,
            reason: "Content too short",
            threats: ["SUSPICIOUS_EMPTY_CONTENT"],
            riskScore: 2
        };
    }
    return { valid: true, threats: [], riskScore: 0 };
}

export async function validateWithWAF(data, clientIP, options = {}) {
    const { filename, userAgent, referer, wafEnabled: clientWafEnabled } = options;
    const effectiveWafEnabled = typeof clientWafEnabled === 'boolean' ? clientWafEnabled : wafEnabled;
    if (!effectiveWafEnabled) {
        const msg = `[WAF] Validation skipped for IP ${clientIP}: WAF is disabled`;
        console.info(msg);
        try { addWafLog && addWafLog(msg); } catch { }
        return {
            valid: true,
            reason: "WAF is disabled (client)",
            threats: [],
            riskScore: 0
        };
    }
    if (isIPBlocked(clientIP)) {
        const blockInfo = blockedIPs.get(clientIP);
        const msg = `[WAF] Blocked IP attempt: ${clientIP} (${blockInfo?.reason})`;
        console.warn(msg);
        try { addWafLog && addWafLog(msg); } catch { }
        return {
            valid: false,
            reason: "IP is blocked",
            threats: ["BLOCKED_IP"],
            blockInfo,
            riskScore: 100
        };
    }
    const rateCheck = checkRateLimit(clientIP, { wafEnabled: effectiveWafEnabled });
    if (!rateCheck.allowed) {
        const msg = `[WAF] Rate limit exceeded for IP: ${clientIP} - ${rateCheck.reason}`;
        console.warn(msg);
        try { addWafLog && addWafLog(msg); } catch { }
        return {
            valid: false,
            reason: rateCheck.reason,
            threats: ["RATE_LIMIT_EXCEEDED"],
            resetTime: rateCheck.resetTime,
            riskScore: 30
        };
    }
    let totalRiskScore = 0;
    let allThreats = [];
    let reasons = [];
    const contentCheck = validateContent(data);
    if (!contentCheck.valid) {
        return {
            valid: false,
            reason: contentCheck.reason,
            threats: contentCheck.threats,
            riskScore: contentCheck.riskScore
        };
    }
    const xssResult = advancedXSSDetection(data, { wafEnabled: effectiveWafEnabled });
    if (!xssResult.valid) {
        totalRiskScore += xssResult.riskScore;
        allThreats.push(...xssResult.threats);
        reasons.push(xssResult.reason);
        const attempts = threatAttempts.get(clientIP) || { xss: 0, malware: 0 };
        attempts.xss++;
        threatAttempts.set(clientIP, attempts);
        const msg = `[WAF] XSS detected from IP: ${clientIP} - Attempt ${attempts.xss}/${WAF_CONFIG.MAX_XSS_ATTEMPTS}`;
        console.warn(msg);
        try {
            addWafLog && addWafLog(msg);
            if (typeof global !== 'undefined' && global.io) {
                global.io.emit('waf_log_updated');
            }
        } catch { }
        if (attempts.xss >= WAF_CONFIG.MAX_XSS_ATTEMPTS) {
            blockIP(clientIP, `Multiple XSS attempts (${attempts.xss})`);
        }
    }
    const malwareResult = malwareDetection(data, filename, { wafEnabled: effectiveWafEnabled });
    if (!malwareResult.valid) {
        totalRiskScore += malwareResult.riskScore;
        allThreats.push(...malwareResult.threats);
        reasons.push(malwareResult.reason);
        try {
            addWafLog && addWafLog(`[WAF] Malware detected from IP: ${clientIP}`);
            if (typeof global !== 'undefined' && global.io) {
                global.io.emit('waf_log_updated');
            }
        } catch { }
        blockIP(clientIP, "Malware detected", WAF_CONFIG.BLOCK_DURATION * 2);
    }
    if (allThreats.length > 0) {
        return {
            valid: false,
            reason: reasons.join('; '),
            threats: allThreats,
            riskScore: totalRiskScore,
            attempts: threatAttempts.get(clientIP)
        };
    }
    if (WAF_CONFIG.ENABLED) {
        try {
            const axios = await import('axios').then(m => m.default || m);
            const response = await axios.post(`${WAF_CONFIG.WAF_URL}/api/validate`, {
                data: data,
                ip: clientIP,
                type: 'chat_message',
                userAgent,
                referer,
                filename
            }, {
                timeout: 3000,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Forwarded-For': clientIP,
                    'User-Agent': userAgent || 'WAF-Client/1.0'
                }
            });
            if (!response.data.success) {
                const msg = `[WAF] External WAF blocked request from ${clientIP}: ${response.data.message}`;
                console.warn(msg);
                try { addWafLog && addWafLog(msg); } catch { }
                return {
                    valid: false,
                    reason: response.data.message || "External WAF validation failed",
                    threats: response.data.threats || ["EXTERNAL_WAF_BLOCK"],
                    riskScore: response.data.riskScore || 50
                };
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.warn('[WAF] External WAF service unavailable, using local validation only');
                const msg = `[WAF] External WAF unavailable, local validation passed for ${clientIP}`;
                try { addWafLog && addWafLog(msg); } catch { }
            } else {
                console.error('[WAF] External validation error:', error.message);
                const msg = `[WAF] External validation error for ${clientIP}: ${error.message}`;
                try { addWafLog && addWafLog(msg); } catch { }
            }
        }
    }
    if (threatAttempts.has(clientIP)) {
        threatAttempts.delete(clientIP);
    }
    return {
        valid: true,
        reason: "All security validations passed",
        threats: [],
        riskScore: 0
    };
}

export function getWAFStats() {
    const now = Date.now();
    const stats = {
        blockedIPs: blockedIPs.size,
        activeRateLimits: rateLimits.size,
        threatAttempts: threatAttempts.size,
        blockedIPDetails: Array.from(blockedIPs.entries()).map(([ip, info]) => ({
            ip,
            ...info,
            timeRemaining: Math.max(0, info.expires - now)
        })),
        topThreatIPs: Array.from(threatAttempts.entries())
            .sort(([, a], [, b]) => (a.xss + a.sql + a.malware) - (b.xss + b.sql + b.malware))
            .slice(0, 10),
        config: WAF_CONFIG
    };
    return stats;
}

export function cleanupWAFData() {
    const now = Date.now();
    for (const [ip, info] of blockedIPs.entries()) {
        if (now > info.expires) {
            blockedIPs.delete(ip);
        }
    }
    for (const [ip, limit] of rateLimits.entries()) {
        if (now - limit.lastRequest > 3600000) {
            rateLimits.delete(ip);
        }
    }
    console.log(`[WAF] Cleaned up expired data. Active blocks: ${blockedIPs.size}, Rate limits: ${rateLimits.size}`);
}

setInterval(cleanupWAFData, 5 * 60 * 1000);

export function setWafLogger(fn) {
    addWafLog = fn;
}

export { threatAttempts, rateLimits, suspiciousPatterns };