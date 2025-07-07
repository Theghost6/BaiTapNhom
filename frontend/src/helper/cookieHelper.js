// Simple cookie helper functions for get/set/remove
// Helper: Base64 encode/decode
function b64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}
function b64Decode(str) {
    return decodeURIComponent(escape(atob(str)));
}

export function setCookie(name, value, days = 7) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    const encoded = b64Encode(value);
    document.cookie = name + '=' + encoded + expires + '; path=/';
}

export function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            const raw = c.substring(nameEQ.length, c.length);
            try {
                return b64Decode(raw);
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

export function removeCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Hàm lấy tên hiển thị từ object user (ưu tiên các trường tên, user, email, nếu không có thì trả về "Ẩn danh")
export function getDisplayNameFromObj(obj) {
    if (!obj) return "Ẩn danh";
    return (
        obj.ten_nguoi_dung ||
        obj.ten_nguoi_tra_loi ||
        obj.ten ||
        obj.name ||
        obj.ho_ten ||
        obj.user ||
        obj.email ||
        (typeof obj.id === 'string' && isNaN(Number(obj.id)) ? obj.id : null) ||
        "Ẩn danh"
    );
}
