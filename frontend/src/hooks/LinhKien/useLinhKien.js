import { useEffect, useState } from "react";
import axios from "axios";

export default function useLinhKien(apiUrl, trigger) {
    const [linhKien, setLinhKien] = useState([]); // Mảng sản phẩm
    const [loaiLinhKienList, setLoaiLinhKienList] = useState([]); // Danh sách loại
    const [loading, setLoading] = useState(false);

    // Lấy danh sách sản phẩm
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/api.php?action=get_products`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setLinhKien(res.data);
                    // Lấy danh sách loại từ dữ liệu
                    const loaiList = [...new Set(res.data.map(item => item.loai || item.id_danh_muc || "khac"))];
                    setLoaiLinhKienList(loaiList);
                } else {
                    setLinhKien([]);
                    setLoaiLinhKienList([]);
                }
            })
            .catch(() => {
                setLinhKien([]);
                setLoaiLinhKienList([]);
            })
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    // Thêm sản phẩm
    const addLinhKien = (newLK, cb) => {
        // Đảm bảo apiUrl không có dấu / ở cuối
        const baseUrl = apiUrl.replace(/\/+$/, "");
        axios.post(`${baseUrl}/api.php?action=add_product`, newLK)
            .then((res) => {
                if (res.data && res.data.success) {
                    return axios.get(`${baseUrl}/api.php?action=get_products`);
                } else {
                    throw new Error(res.data && res.data.error ? res.data.error : 'Thêm thất bại');
                }
            })
            .then((res) => {
                setLinhKien(res.data);
                const loaiList = [...new Set(res.data.map(item => item.loai || item.id_danh_muc || "khac"))];
                setLoaiLinhKienList(loaiList);
                if (cb) cb(true);
            })
            .catch((err) => {
                if (cb) cb(false);
                // Hiển thị lỗi chi tiết nếu có
                if (err && err.message) alert("Lỗi thêm sản phẩm: " + err.message);
            });
    };

    // Cập nhật sản phẩm
    const updateLinhKien = (lk, cb) => {
        axios.post(`${apiUrl}/api.php?action=update_product&id=${lk.id}`, lk)
            .then((res) => {
                if (res.data.success) {
                    return axios.get(`${apiUrl}/api.php?action=get_products`);
                } else {
                    throw new Error(res.data.error || 'Cập nhật thất bại');
                }
            })
            .then((res) => {
                setLinhKien(res.data);
                const loaiList = [...new Set(res.data.map(item => item.loai || item.id_danh_muc || "khac"))];
                setLoaiLinhKienList(loaiList);
                if (cb) cb(true);
            })
            .catch(() => { if (cb) cb(false); });
    };

    // Xóa sản phẩm
    const deleteLinhKien = (id, loai, cb) => {
        axios.delete(`${apiUrl}/api.php?action=delete_product&id=${id}`)
            .then((res) => {
                if (res.data.success) {
                    return axios.get(`${apiUrl}/api.php?action=get_products`);
                } else {
                    throw new Error(res.data.error || 'Xóa thất bại');
                }
            })
            .then((res) => {
                setLinhKien(res.data);
                const loaiList = [...new Set(res.data.map(item => item.loai || item.id_danh_muc || "khac"))];
                setLoaiLinhKienList(loaiList);
                if (cb) cb(true);
            })
            .catch(() => { if (cb) cb(false); });
    };

    return { linhKien, loaiLinhKienList, loading, setLinhKien, setLoaiLinhKienList, addLinhKien, updateLinhKien, deleteLinhKien };
}
