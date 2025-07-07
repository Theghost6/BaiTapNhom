import { useEffect, useState } from "react";
import axios from "axios";

/**
 * useUsers - Custom hook lấy danh sách người dùng và thao tác CRUD
 *
 * @param {string} apiUrl - Đường dẫn API backend
 * @param {any} trigger - Giá trị trigger để refetch (thường là view hoặc biến thay đổi khi cần reload)
 *
 * @returns {Object} { users, loading, deleteUser, toggleUserStatus }
 *
 * Lưu ý: Nên truyền trigger từ ngoài vào (ví dụ: view, reload, v.v.) để đồng bộ dữ liệu khi cần.
 */
export default function useUsers(apiUrl, trigger) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/api.php?action=get_users`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setUsers(res.data.map((u) => ({ ...u, is_active: Number(u.is_active) })));
                } else setUsers([]);
            })
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    /**
     * Xóa user theo phone
     * @param {string} phone
     * @param {function} cb - callback sau khi xóa
     */
    const deleteUser = (phone, cb) => {
        axios
            .get(`${apiUrl}/api.php?action=delete_user&phone=${phone}`)
            .then(() => {
                setUsers((prev) => prev.filter((u) => u.phone !== phone));
                if (cb) cb();
            });
    };

    /**
     * Đổi trạng thái hoạt động user
     * @param {string} phone
     * @param {number} is_active
     */
    const toggleUserStatus = (phone, is_active) => {
        axios
            .get(`${apiUrl}/api.php?action=toggle_user_status&phone=${phone}&is_active=${is_active ? 0 : 1}`)
            .then(() => {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.phone === phone ? { ...u, is_active: is_active ? 0 : 1 } : u
                    )
                );
            });
    };

    return { users, loading, deleteUser, toggleUserStatus };
}
