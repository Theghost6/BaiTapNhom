import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";


import "./LinhKienManager.css";

const apiUrl = import.meta.env.VITE_HOST;

// Mapping id sang mã loại nếu cần (ví dụ, bạn cần chỉnh lại cho đúng project của bạn)
const idToLoai = {
    1: "Ổ cứng",
    2: "Card màn hình",
    3: "RAM",
    4: "CPU",
    5: "Mainboard",
    6: "Nguồn máy tính",
    7: "Vỏ case",
    8: "Tản nhiệt",
    9: "Linh kiện khác",
    // Thêm các id khác nếu có
};

// Danh sách loại linh kiện chuẩn theo thứ tự mong muốn (nếu muốn động thì convert trước)
const loaiLinhKienArray = [
    "Ổ cứng", "Card màn hình", "RAM", "CPU", "Mainboard", "Nguồn máy tính", "Vỏ case", "Tản nhiệt", "Linh kiện khác"
    // Thêm các loại khác nếu có
];

function LinhKienManager({
    linhKien,
    loaiLinhKienList,
    selectedLoaiTable,
    setSelectedLoaiTable,
    searchKeyword,
    setSearchKeyword,
    formatPrice,
    handleDelete,
    deleteLinhKien,
    setEditLinhKien,
    setIsEditModalOpen,
    setIsAddFormVisible,
    isAddFormVisible
}) {
    // Local state for add form
    const [newLinhKien, setNewLinhKien] = useState({
        loai: selectedLoaiTable || loaiLinhKienArray[0],
        ten: "",
        hang: "",
        gia: "",
        so_luong: "",
        mo_ta: ""
    });

    // Đồng bộ newLinhKien.loai với selectedLoaiTable khi chuyển tab
    useEffect(() => {
        setNewLinhKien((prev) => ({ ...prev, loai: selectedLoaiTable }));
    }, [selectedLoaiTable]);

    // Helper: get sample keys for table columns (ẩn mô tả khỏi bảng chính)
    function getSampleKeys(linhKienArr, loai) {
        const filtered = linhKienArr.filter(item => (item.loai || item.id_danh_muc || "khac") === loai);
        if (!filtered.length) return ["ten_sp", "hang", "gia_sau", "so_luong"];
        return Object.keys(filtered[0]).filter(
            (k) => k !== "rating" && k !== "reviewCount" && k !== "id" && k !== "loai" && k !== "id_danh_muc" && k !== "mo_ta"
        );
    }

    // Các cột cố định cho bảng sản phẩm
    const columns = [
        "ma_sp", "ten_sp", "ten_nha_san_xuat", "gia_sau", "gia_truoc", "so_luong", "bao_hanh", "id_nha_san_xuat", "trang_thai"
    ];

    // Helper: get field label
    function getFieldLabel(key) {
        const labels = {
            ma_sp: "Mã sản phẩm",
            ten_sp: "Tên sản phẩm",
            ten_nha_san_xuat: "Hãng",
            gia_sau: "Giá bán",
            gia_truoc: "Giá trước",
            so_luong: "Tồn kho",
            bao_hanh: "Bảo hành",
            id_nha_san_xuat: "Nhà sản xuất",
            trang_thai: "Trạng thái",
            mo_ta: "Mô tả",
        };
        return labels[key] || key;
    }

    // Helper: get input type
    function getInputType(key) {
        if (key === "gia" || key === "so_luong") return "number";
        return "text";
    }

    // Handle add form input change
    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewLinhKien((prev) => ({ ...prev, [name]: value }));
    };

    // Helper: lấy id danh mục từ tên loại
    function getIdDanhMucByTenLoai(tenLoai) {
        for (const [id, ten] of Object.entries(idToLoai)) {
            if (ten === tenLoai) return Number(id);
        }
        return null;
    }

    // Handle add linh kiện (call parent handler via props if needed)
    const handleAddLinhKien = async (e) => {
        e.preventDefault();
        // Validate input
        if (!newLinhKien.ten && !newLinhKien.ten_sp) {
            alert("Vui lòng nhập tên sản phẩm!");
            return;
        }
        // Build đúng object backend yêu cầu
        const payload = {
            ma_sp: newLinhKien.ma_sp || '',
            ten_sp: newLinhKien.ten_sp || newLinhKien.ten || '',
            gia_sau: Number(newLinhKien.gia_sau || newLinhKien.gia || 0),
            gia_truoc: newLinhKien.gia_truoc ? Number(newLinhKien.gia_truoc) : null,
            so_luong: Number(newLinhKien.so_luong || 0),
            bao_hanh: newLinhKien.bao_hanh || '',
            mo_ta: newLinhKien.mo_ta || '',
            id_danh_muc: getIdDanhMucByTenLoai(newLinhKien.loai),
            id_nha_san_xuat: newLinhKien.id_nha_san_xuat ? Number(newLinhKien.id_nha_san_xuat) : null,
            trang_thai: Number(newLinhKien.trang_thai || 1)
        };
        try {
            const res = await fetch(`${apiUrl}/api.php?action=add_product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            // Kiểm tra response có phải JSON không trước khi parse
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Lỗi parse JSON:', text);
                alert("Lỗi backend không trả về JSON hợp lệ!\n" + text);
                return;
            }
            if (data.success) {
                alert("Thêm sản phẩm thành công!");
                setIsAddFormVisible(false);
                setNewLinhKien({
                    loai: loaiLinhKienList[0] || "cpu",
                    ten: "",
                    hang: "",
                    gia: "",
                    so_luong: "",
                    mo_ta: ""
                });
                // Reload lại danh sách sản phẩm nếu có hàm setLinhKien
                if (typeof window !== 'undefined' && window.location) {
                    window.location.reload();
                }
            } else {
                alert("Thêm sản phẩm thất bại: " + (data.error || "Lỗi không xác định"));
            }
        } catch (err) {
            alert("Lỗi khi thêm sản phẩm: " + err.message);
        }
    };

    // Filtered data for current tab (lọc theo loại, ánh xạ id sang tên tiếng Việt)
    const filteredData = selectedLoaiTable
        ? linhKien.filter(item => {
            const tenLoai = idToLoai[item.id_danh_muc];
            return tenLoai === selectedLoaiTable &&
                Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(searchKeyword.toLowerCase()));
        })
        : [];

    // Hàm ánh xạ mã loại sang tên hiển thị
    function getLoaiLabel(loai) {
        const labels = {
            cpu: "CPU",
            ram: "RAM",
            vga: "Card đồ họa",
            main: "Mainboard",
            ssd: "SSD",
            hdd: "HDD",
            psu: "Nguồn",
            case: "Case",
            fan: "Quạt tản nhiệt",
            // Thêm các loại khác nếu có
        };
        return labels[loai] || loai.toUpperCase();
    }

    // Các trường cần nhập cho form thêm mới
    const fieldsForAddForm = [
        "ma_sp", "ten", "hang", "gia", "gia_truoc", "so_luong", "bao_hanh", "id_nha_san_xuat", "trang_thai"
    ];

    return (
        <div className="linh-kien-manager" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="lk-header">
                <div className="lk-tabs">
                    {loaiLinhKienArray.map((loai) => (
                        <button
                            key={loai}
                            className={`lk-tab ${selectedLoaiTable === loai ? "active" : ""}`}
                            onClick={() => setSelectedLoaiTable(loai)}
                        >
                            {getLoaiLabel(loai)}
                        </button>
                    ))}
                </div>
                <div className="lk-actions">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="lk-search"
                    />
                    <button className="button-green" onClick={() => setIsAddFormVisible(true)}>
                        <i className="fas fa-plus"></i> Thêm sản phẩm
                    </button>
                </div>
            </div>
            {isAddFormVisible && (
                <form className="lk-add-form" onSubmit={handleAddLinhKien}>
                    <div className="lk-add-fields">
                        <select
                            name="loai"
                            value={newLinhKien.loai}
                            onChange={handleAddInputChange}
                        >
                            {loaiLinhKienArray.map((loai) => (
                                <option key={loai} value={loai}>{loai}</option>
                            ))}
                        </select>
                        {fieldsForAddForm.map((key) => (
                            <input
                                key={key}
                                name={key}
                                type={getInputType(key)}
                                placeholder={getFieldLabel(key)}
                                value={newLinhKien[key] || ""}
                                onChange={handleAddInputChange}
                                required={key === "ten" || key === "ma_sp"}
                            />
                        ))}
                        {/* Luôn hiển thị textarea cho mô tả */}
                        <textarea
                            name="mo_ta"
                            placeholder="Mô tả sản phẩm"
                            value={newLinhKien.mo_ta || ""}
                            onChange={handleAddInputChange}
                            rows={3}
                            style={{ width: '100%', marginTop: 8 }}
                            required
                        />
                    </div>
                    <div className="lk-add-actions">
                        <button type="submit" className="button-green">Lưu</button>
                        <button type="button" className="button-red" onClick={() => setIsAddFormVisible(false)}>Hủy</button>
                    </div>
                </form>
            )}
            <div
                className="lk-table-wrapper"
                style={{
                    overflowX: 'auto',
                    overflowY: 'auto',
                    maxHeight: '60vh',
                    maxWidth: '100vw',
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    marginTop: 16,
                    boxSizing: 'border-box',
                }}
            >
                <table className="table" style={{ minWidth: 700, width: 'max-content' }}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{getFieldLabel(col)}</th>
                            ))}
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr><td colSpan={columns.length + 2} style={{ textAlign: "center" }}>Không có dữ liệu</td></tr>
                        ) : (
                            filteredData.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    {columns.map((col) => (
                                        <td key={col}>{col === "gia" || col === "gia_sau" ? formatPrice(item[col]) : item[col]}</td>
                                    ))}
                                    <td>
                                        <button
                                            className="button-blue"
                                            title={item.mo_ta || "Không có mô tả"}
                                            style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        >
                                            <i className="fas fa-info-circle"></i> Xem mô tả
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="button-yellow"
                                            onClick={() => {
                                                setEditLinhKien(item);
                                                setIsEditModalOpen(true);
                                            }}
                                            title="Chỉnh sửa"
                                        >
                                            <CiEdit />

                                        </button>
                                        <button
                                            className="button-red"
                                            onClick={() => handleDelete(item.id, "linh kiện", () => deleteLinhKien(item.id, selectedLoaiTable))}
                                            title="Xóa"
                                            style={{ marginLeft: 8 }}
                                        >
                                            <FaRegTrashAlt />

                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LinhKienManager;
