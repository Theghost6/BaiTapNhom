import React, { useState, useEffect, useMemo } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import SearchBar from "./SearchBar";
import "./CommonTable.css";
import "./LinhKienManager.css";

const apiUrl = import.meta.env.VITE_HOST;

// Mapping id sang mã loại theo database
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
    10: "Màn hình",
    19: "Bàn phím",
    20: "Chuột"
};

// Danh sách loại linh kiện chuẩn theo thứ tự mong muốn
const loaiLinhKienArray = [
    "Ổ cứng",
    "Card màn hình",
    "RAM",
    "CPU",
    "Mainboard",
    "Nguồn máy tính",
    "Vỏ case",
    "Tản nhiệt",
    "Linh kiện khác",
    "Màn hình",
    "Bàn phím",
    "Chuột"
];

function LinhKienManager({
    linhKien,
    loaiLinhKienList,
    formatPrice,
    handleDelete,
    deleteLinhKien,
    setEditLinhKien,
    setIsEditModalOpen,
    setIsAddFormVisible,
    isAddFormVisible,
    searchConfig,
    onSearch,
    loading = false
}) {
    // Local state for add form
    const [newLinhKien, setNewLinhKien] = useState({
        loai: loaiLinhKienArray[0],
        ma_sp: "",
        ten_sp: "",
        gia_sau: "",
        gia_truoc: "",
        so_luong: "",
        bao_hanh: "",
        id_nha_san_xuat: "",
        trang_thai: "1",
        mo_ta: ""
    });

    // State cho form validation
    const [formErrors, setFormErrors] = useState({});

    // State cho upload ảnh
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    // State cho thông số kỹ thuật
    const [thongSo, setThongSo] = useState([]);

    // Helper: get sample keys for table columns (ẩn mô tả khỏi bảng chính)
    function getSampleKeys(linhKienArr, loai) {
        const filtered = linhKienArr.filter(item => (item.loai || item.id_danh_muc || "khac") === loai);
        if (!filtered.length) return ["ten_sp", "hang", "gia_sau", "so_luong"];
        return Object.keys(filtered[0]).filter(
            (k) => k !== "rating" && k !== "reviewCount" && k !== "id" && k !== "loai" && k !== "id_danh_muc" && k !== "mo_ta"
        );
    }

    // Các cột hiển thị chính - chỉ những cột quan trọng nhất
    const displayColumns = [
        "ma_sp", "ten_sp", "gia_sau", "so_luong", "trang_thai"
    ];

    // Tất cả các cột có thể có (để dùng trong form thêm/sửa)
    const allColumns = [
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
            mo_ta: "Mô tả"
        };
        return labels[key] || key;
    }

    // Helper: get input type
    function getInputType(key) {
        if (key === "gia" || key === "gia_sau" || key === "gia_truoc" || key === "so_luong" || key === "id_nha_san_xuat" || key === "trang_thai") return "number";
        return "text";
    }

    // Handle add form input change với validation
    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewLinhKien((prev) => ({ ...prev, [name]: value }));

        // Clear error khi user bắt đầu nhập
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle upload ảnh
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert("Chỉ được chọn tối đa 5 ảnh!");
            return;
        }

        // Validate file type và size
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} không phải là ảnh!`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert(`File ${file.name} quá lớn! Tối đa 5MB.`);
                return false;
            }
            return true;
        });

        setSelectedImages(validFiles);

        // Tạo preview
        const previews = validFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setImagePreview(previews);
    };

    // Xóa ảnh khỏi preview
    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);

        // Cleanup URL object
        URL.revokeObjectURL(imagePreview[index].url);

        setSelectedImages(newImages);
        setImagePreview(newPreviews);
    };

    // Add new thong so
    const addThongSo = () => {
        setThongSo(prev => [...prev, { ten_thong_so: '', gia_tri_thong_so: '', thu_tu: prev.length + 1 }]);
    };

    // Update thong so
    const updateThongSo = (index, field, value) => {
        setThongSo(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    // Remove thong so
    const removeThongSo = (index) => {
        setThongSo(prev => prev.filter((_, i) => i !== index));
    };    // Validate form fields
    const validateForm = () => {
        const errors = {};

        if (!newLinhKien.ma_sp?.trim()) {
            errors.ma_sp = "Mã sản phẩm là bắt buộc";
        } else if (newLinhKien.ma_sp.length > 50) {
            errors.ma_sp = "Mã sản phẩm không được quá 50 ký tự";
        }

        if (!newLinhKien.ten_sp?.trim()) {
            errors.ten_sp = "Tên sản phẩm là bắt buộc";
        } else if (newLinhKien.ten_sp.length > 255) {
            errors.ten_sp = "Tên sản phẩm không được quá 255 ký tự";
        }

        if (!newLinhKien.gia_sau || Number(newLinhKien.gia_sau) <= 0) {
            errors.gia_sau = "Giá bán phải lớn hơn 0";
        }

        if (newLinhKien.gia_truoc && Number(newLinhKien.gia_truoc) <= Number(newLinhKien.gia_sau)) {
            errors.gia_truoc = "Giá gốc phải lớn hơn giá bán";
        }

        if (!newLinhKien.so_luong || Number(newLinhKien.so_luong) < 0) {
            errors.so_luong = "Số lượng không được âm";
        }

        if (!newLinhKien.mo_ta?.trim()) {
            errors.mo_ta = "Mô tả sản phẩm là bắt buộc";
        }

        return errors;
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

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            const firstError = Object.values(errors)[0];
            alert(`Lỗi nhập liệu: ${firstError}`);
            return;
        }

        try {
            // Bước 1: Thêm sản phẩm trước
            const productPayload = {
                ma_sp: newLinhKien.ma_sp.trim(),
                ten_sp: newLinhKien.ten_sp.trim(),
                gia_sau: Number(newLinhKien.gia_sau),
                gia_truoc: newLinhKien.gia_truoc ? Number(newLinhKien.gia_truoc) : null,
                so_luong: Number(newLinhKien.so_luong),
                bao_hanh: newLinhKien.bao_hanh?.trim() || null,
                mo_ta: newLinhKien.mo_ta.trim(),
                id_danh_muc: getIdDanhMucByTenLoai(newLinhKien.loai),
                id_nha_san_xuat: newLinhKien.id_nha_san_xuat ? Number(newLinhKien.id_nha_san_xuat) : null,
                trang_thai: Number(newLinhKien.trang_thai || 1)
            };

            const productRes = await fetch(`${apiUrl}/api.php?action=add_product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productPayload)
            });

            const productText = await productRes.text();
            let productData;
            try {
                productData = JSON.parse(productText);
            } catch (e) {
                alert("Lỗi backend không trả về JSON hợp lệ!\n" + productText);
                return;
            }

            if (!productData.success) {
                alert("Thêm sản phẩm thất bại: " + (productData.error || "Lỗi không xác định"));
                return;
            }

            // Bước 2: Upload ảnh nếu có
            if (selectedImages.length > 0) {
                let uploadedCount = 0;
                let failedCount = 0;

                for (let i = 0; i < selectedImages.length; i++) {
                    const file = selectedImages[i];
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('ma_sp', newLinhKien.ma_sp.trim());
                    formData.append('thu_tu', i + 1);

                    try {
                        const imageRes = await fetch(`${apiUrl}/api.php?action=upload_product_image`, {
                            method: "POST",
                            body: formData
                        });

                        const imageText = await imageRes.text();
                        let imageData;
                        try {
                            imageData = JSON.parse(imageText);
                        } catch (e) {
                            console.error("Lỗi upload ảnh:", imageText);
                            failedCount++;
                            continue;
                        }

                        if (imageData.success) {
                            uploadedCount++;
                        } else {
                            console.error("Upload ảnh thất bại:", imageData.error);
                            failedCount++;
                        }
                    } catch (err) {
                        console.error("Lỗi upload ảnh:", err);
                        failedCount++;
                    }
                }

                if (failedCount > 0) {
                    alert(`Thêm sản phẩm thành công!\nĐã upload ${uploadedCount}/${selectedImages.length} ảnh. ${failedCount} ảnh thất bại.`);
                } else {
                    alert(`Thêm sản phẩm thành công! Đã upload ${uploadedCount} ảnh.`);
                }
            } else {
                alert("Thêm sản phẩm thành công!");
            }

            // Bước 3: Save thông số kỹ thuật nếu có
            if (thongSo.length > 0) {
                const validThongSo = thongSo.filter(ts =>
                    ts.ten_thong_so.trim() && ts.gia_tri_thong_so.trim()
                );

                if (validThongSo.length > 0) {
                    try {
                        const thongsoRes = await fetch(`${apiUrl}/api.php?action=save_product_thongso`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ma_sp: newLinhKien.ma_sp.trim(),
                                thongso: validThongSo
                            })
                        });

                        const thongsoText = await thongsoRes.text();
                        let thongsoData;
                        try {
                            thongsoData = JSON.parse(thongsoText);
                        } catch (e) {
                            console.error("Lỗi lưu thông số:", thongsoText);
                        }

                        if (thongsoData && thongsoData.success) {
                            console.log(`Đã lưu ${validThongSo.length} thông số kỹ thuật`);
                        } else {
                            console.error("Lưu thông số thất bại:", thongsoData?.error);
                        }
                    } catch (err) {
                        console.error("Lỗi lưu thông số:", err);
                    }
                }
            }

            // Reset form
            setIsAddFormVisible(false);
            setFormErrors({});
            setSelectedImages([]);
            setImagePreview([]);
            setThongSo([]);
            setNewLinhKien({
                loai: loaiLinhKienArray[0] || "Ổ cứng",
                ma_sp: "",
                ten_sp: "",
                gia_sau: "",
                gia_truoc: "",
                so_luong: "",
                bao_hanh: "",
                id_nha_san_xuat: "",
                trang_thai: "1",
                mo_ta: ""
            });

            // Reload lại danh sách sản phẩm
            if (typeof window !== 'undefined' && window.location) {
                window.location.reload();
            }

        } catch (err) {
            alert("Lỗi khi thêm sản phẩm: " + err.message);
        }
    };

    // Pagination state - 50 sản phẩm mỗi trang cho performance tốt
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    // Filtered data - sử dụng linhKien đã được filter từ SearchBar
    const filteredData = linhKien || [];

    // Pagination logic với useMemo để tối ưu performance
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Reset trang khi dữ liệu thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData.length]);

    // Loading state
    if (loading) {
        return (
            <div className="linh-kien-manager" style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#666' }}></i>
                    <p style={{ marginTop: '10px', color: '#666' }}>Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    // Hàm ánh xạ mã loại sang tên hiển thị
    function getLoaiLabel(loai) {
        const labels = {
            "Ổ cứng": "Ổ cứng",
            "Card màn hình": "Card màn hình",
            "RAM": "RAM",
            "CPU": "CPU",
            "Mainboard": "Mainboard",
            "Nguồn máy tính": "Nguồn máy tính",
            "Vỏ case": "Vỏ case",
            "Tản nhiệt": "Tản nhiệt",
            "Linh kiện khác": "Linh kiện khác",
            "Màn hình": "Màn hình",
            "Bàn phím": "Bàn phím",
            "Chuột": "Chuột"
        };
        return labels[loai] || loai;
    }

    // Các trường cần nhập cho form thêm mới - đầy đủ theo database
    const fieldsForAddForm = [
        "ma_sp", "ten_sp", "gia_sau", "gia_truoc", "so_luong", "bao_hanh", "id_nha_san_xuat", "trang_thai"
    ];

    // Các trường bắt buộc phải nhập
    const requiredFields = ["ma_sp", "ten_sp", "gia_sau", "so_luong", "mo_ta"];

    return (
        <div className="linh-kien-manager" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* SearchBar thay thế cho tabs */}
            <SearchBar
                {...searchConfig}
                onSearch={onSearch}
                className="linhkien-search"
            />

            <div className="lk-header">
                <div className="lk-actions">
                    <div className="pagination-info">
                        <span>Hiển thị {filteredData.length} sản phẩm</span>
                    </div>
                    <button className="button-green" onClick={() => setIsAddFormVisible(true)}>
                        <i className="fas fa-plus"></i>
                        <span>Thêm sản phẩm</span>
                    </button>
                </div>
            </div>
            {isAddFormVisible && (
                <form className="lk-add-form" onSubmit={handleAddLinhKien}>
                    <div className="lk-add-fields">
                        {/* Loại sản phẩm (danh mục) */}
                        <div className="form-field">
                            <label>Loại sản phẩm (Danh mục) *</label>
                            <select
                                name="loai"
                                value={newLinhKien.loai}
                                onChange={handleAddInputChange}
                                required
                            >
                                {loaiLinhKienArray.map((loai) => (
                                    <option key={loai} value={loai}>{loai}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mã sản phẩm */}
                        <div className="form-field">
                            <label>Mã sản phẩm *</label>
                            <input
                                name="ma_sp"
                                type="text"
                                placeholder="Nhập mã sản phẩm (VD: SP001)"
                                value={newLinhKien.ma_sp || ""}
                                onChange={handleAddInputChange}
                                required
                                maxLength="50"
                                className={formErrors.ma_sp ? 'error' : ''}
                            />
                            {formErrors.ma_sp && <span className="error-text">{formErrors.ma_sp}</span>}
                        </div>

                        {/* Tên sản phẩm */}
                        <div className="form-field">
                            <label>Tên sản phẩm *</label>
                            <input
                                name="ten_sp"
                                type="text"
                                placeholder="Nhập tên sản phẩm"
                                value={newLinhKien.ten_sp || ""}
                                onChange={handleAddInputChange}
                                required
                                maxLength="255"
                                className={formErrors.ten_sp ? 'error' : ''}
                            />
                            {formErrors.ten_sp && <span className="error-text">{formErrors.ten_sp}</span>}
                        </div>

                        {/* Giá bán */}
                        <div className="form-field">
                            <label>Giá bán (VNĐ) *</label>
                            <input
                                name="gia_sau"
                                type="number"
                                placeholder="Nhập giá bán"
                                value={newLinhKien.gia_sau || ""}
                                onChange={handleAddInputChange}
                                required
                                min="0"
                                step="1000"
                                className={formErrors.gia_sau ? 'error' : ''}
                            />
                            {formErrors.gia_sau && <span className="error-text">{formErrors.gia_sau}</span>}
                        </div>

                        {/* Giá gốc */}
                        <div className="form-field">
                            <label>Giá gốc (VNĐ)</label>
                            <input
                                name="gia_truoc"
                                type="number"
                                placeholder="Nhập giá gốc (không bắt buộc)"
                                value={newLinhKien.gia_truoc || ""}
                                onChange={handleAddInputChange}
                                min="0"
                                step="1000"
                                className={formErrors.gia_truoc ? 'error' : ''}
                            />
                            {formErrors.gia_truoc && <span className="error-text">{formErrors.gia_truoc}</span>}
                        </div>

                        {/* Số lượng */}
                        <div className="form-field">
                            <label>Số lượng tồn kho *</label>
                            <input
                                name="so_luong"
                                type="number"
                                placeholder="Nhập số lượng"
                                value={newLinhKien.so_luong || ""}
                                onChange={handleAddInputChange}
                                required
                                min="0"
                                className={formErrors.so_luong ? 'error' : ''}
                            />
                            {formErrors.so_luong && <span className="error-text">{formErrors.so_luong}</span>}
                        </div>

                        {/* Bảo hành */}
                        <div className="form-field">
                            <label>Thời gian bảo hành</label>
                            <input
                                name="bao_hanh"
                                type="text"
                                placeholder="VD: 12 tháng, 2 năm"
                                value={newLinhKien.bao_hanh || ""}
                                onChange={handleAddInputChange}
                                maxLength="50"
                            />
                        </div>

                        {/* ID nhà sản xuất */}
                        <div className="form-field">
                            <label>ID Nhà sản xuất</label>
                            <input
                                name="id_nha_san_xuat"
                                type="number"
                                placeholder="Nhập ID nhà sản xuất (không bắt buộc)"
                                value={newLinhKien.id_nha_san_xuat || ""}
                                onChange={handleAddInputChange}
                                min="1"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div className="form-field">
                            <label>Trạng thái *</label>
                            <select
                                name="trang_thai"
                                value={newLinhKien.trang_thai || "1"}
                                onChange={handleAddInputChange}
                                required
                            >
                                <option value="1">Hoạt động</option>
                                <option value="0">Ngừng hoạt động</option>
                            </select>
                        </div>

                        {/* Mô tả */}
                        <div className="form-field full-width">
                            <label>Mô tả sản phẩm *</label>
                            <textarea
                                name="mo_ta"
                                placeholder="Nhập mô tả chi tiết về sản phẩm"
                                value={newLinhKien.mo_ta || ""}
                                onChange={handleAddInputChange}
                                rows={4}
                                required
                                className={formErrors.mo_ta ? 'error' : ''}
                            />
                            {formErrors.mo_ta && <span className="error-text">{formErrors.mo_ta}</span>}
                        </div>

                        {/* Upload ảnh sản phẩm */}
                        <div className="form-field full-width">
                            <label>Ảnh sản phẩm</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="image-upload-input"
                            />
                            <div className="upload-info">
                                <i className="fas fa-info-circle"></i>
                                <span>Chọn tối đa 5 ảnh, mỗi ảnh không quá 5MB. Định dạng: JPG, PNG, GIF</span>
                            </div>

                            {/* Preview ảnh */}
                            {imagePreview.length > 0 && (
                                <div className="image-preview-container">
                                    <h4>Xem trước ảnh:</h4>
                                    <div className="image-preview-grid">
                                        {imagePreview.map((preview, index) => (
                                            <div key={index} className="image-preview-item">
                                                <img src={preview.url} alt={preview.name} />
                                                <div className="image-overlay">
                                                    <span className="image-name">{preview.name}</span>
                                                    <button
                                                        type="button"
                                                        className="remove-image-btn"
                                                        onClick={() => removeImage(index)}
                                                        title="Xóa ảnh"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                                <div className="image-order">#{index + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thông số kỹ thuật */}
                        <div className="form-field full-width">
                            <label>Thông số kỹ thuật</label>

                            <div className="thongso-section">
                                {thongSo.map((ts, index) => (
                                    <div key={index} className="thongso-item">
                                        <input
                                            type="number"
                                            placeholder="Thứ tự"
                                            value={ts.thu_tu}
                                            onChange={(e) => updateThongSo(index, 'thu_tu', e.target.value)}
                                            className="thongso-order"
                                            min="1"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tên thông số (VD: CPU, RAM, Ổ cứng...)"
                                            value={ts.ten_thong_so}
                                            onChange={(e) => updateThongSo(index, 'ten_thong_so', e.target.value)}
                                            className="thongso-name"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Giá trị (VD: Intel Core i5, 8GB DDR4...)"
                                            value={ts.gia_tri_thong_so}
                                            onChange={(e) => updateThongSo(index, 'gia_tri_thong_so', e.target.value)}
                                            className="thongso-value"
                                        />
                                        <button
                                            type="button"
                                            className="remove-thongso-btn"
                                            onClick={() => removeThongSo(index)}
                                            title="Xóa thông số"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="add-thongso-btn"
                                    onClick={addThongSo}
                                >
                                    <i className="fas fa-plus"></i> Thêm thông số
                                </button>

                                <div className="thongso-info">
                                    <i className="fas fa-info-circle"></i>
                                    <span>Thông số kỹ thuật giúp khách hàng hiểu rõ hơn về sản phẩm (CPU, RAM, Dung lượng, Kích thước...)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lk-add-actions">
                        <button type="submit" className="button-green">
                            <i className="fas fa-save"></i>
                            <span>Lưu</span>
                        </button>
                        <button type="button" className="button-red" onClick={() => {
                            setIsAddFormVisible(false);
                            setFormErrors({}); // Reset form errors khi đóng
                            setSelectedImages([]);
                            setImagePreview([]);
                            // Cleanup URL objects
                            imagePreview.forEach(preview => URL.revokeObjectURL(preview.url));
                        }}>
                            <i className="fas fa-times"></i>
                            <span>Hủy</span>
                        </button>
                    </div>
                </form>
            )}
            <div className="table-container">
                {filteredData.length === 0 ? (
                    <div className="table-empty">
                        <i className="fas fa-box-open" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
                        <h3 style={{ margin: '0 0 8px 0' }}>Không có sản phẩm nào</h3>
                        <p style={{ margin: 0 }}>Hãy thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                    </div>
                ) : (
                    <>
                        <div className="table-scroll-wrapper" style={{
                            maxHeight: '60vh',
                            overflowY: 'auto',
                            overflowX: 'auto',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px'
                        }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        {displayColumns.map((col) => (
                                            <th key={col} className={
                                                col === "ma_sp" ? "id-column" :
                                                    col === "ten_sp" ? "name-column" :
                                                        (col === "gia_sau" || col === "gia_truoc") ? "price-column" :
                                                            col === "so_luong" ? "quantity-column" :
                                                                ""
                                            }>
                                                {getFieldLabel(col)}
                                            </th>
                                        ))}
                                        <th className="actions-column">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, idx) => (
                                        <tr key={item.id || idx}>
                                            {displayColumns.map((col) => (
                                                <td key={col} className={
                                                    col === "ma_sp" ? "id-column" :
                                                        col === "ten_sp" ? "name-column" :
                                                            (col === "gia_sau" || col === "gia_truoc") ? "price-column" :
                                                                col === "so_luong" ? "quantity-column" :
                                                                    ""
                                                }>
                                                    {(col === "gia" || col === "gia_sau" || col === "gia_truoc") ?
                                                        formatPrice(item[col]) :
                                                        col === "trang_thai" ? (
                                                            <span className={`status-badge ${item[col] === "1" ? 'success' : 'error'}`}>
                                                                {item[col] === "1" ? "Hoạt động" : "Không hoạt động"}
                                                            </span>
                                                        ) :
                                                            col === "so_luong" ? (
                                                                <span className={`status-badge ${parseInt(item[col]) > 0 ? 'success' : 'error'}`}>
                                                                    {item[col]} {parseInt(item[col]) === 0 ? "(Hết hàng)" : ""}
                                                                </span>
                                                            ) :
                                                                item[col]
                                                    }
                                                </td>
                                            ))}
                                            <td className="actions-column">
                                                <button
                                                    className="table-btn btn-primary"
                                                    onClick={() => {
                                                        alert(`Thông tin chi tiết:\n\nMã SP: ${item.ma_sp}\nTên: ${item.ten_sp}\nHãng: ${item.ten_nha_san_xuat || 'N/A'}\nGiá gốc: ${formatPrice(item.gia_truoc)}\nGiá bán: ${formatPrice(item.gia_sau)}\nSố lượng: ${item.so_luong}\nBảo hành: ${item.bao_hanh || 'N/A'}\nMô tả: ${item.mo_ta || 'Không có mô tả'}`);
                                                    }}
                                                    title="Xem thông tin chi tiết"
                                                >
                                                    <i className="fas fa-info-circle"></i>
                                                    <span>Chi tiết</span>
                                                </button>
                                                <button
                                                    className="table-btn btn-warning"
                                                    onClick={() => {
                                                        setEditLinhKien(item);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    title="Chỉnh sửa sản phẩm"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                    <span>Sửa</span>
                                                </button>
                                                <button
                                                    className="table-btn btn-danger"
                                                    onClick={() => handleDelete(item.id, "linh kiện", () => deleteLinhKien(item.id))}
                                                    title="Xóa sản phẩm"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                    <span>Xóa</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls - Điều khiển phân trang */}
                        {totalPages > 1 && (
                            <div className="pagination-wrapper" style={{ marginTop: '20px', textAlign: 'center' }}>
                                <div className="pagination-info" style={{ marginBottom: '10px', color: '#666' }}>
                                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} trong số {filteredData.length} sản phẩm
                                </div>
                                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        className="table-btn btn-primary"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        title="Trang đầu"
                                    >
                                        <i className="fas fa-angle-double-left"></i>
                                    </button>
                                    <button
                                        className="table-btn btn-primary"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        title="Trang trước"
                                    >
                                        <i className="fas fa-angle-left"></i>
                                    </button>

                                    <span style={{ padding: '0 15px', fontWeight: 'bold' }}>
                                        Trang {currentPage} / {totalPages}
                                    </span>

                                    <button
                                        className="table-btn btn-primary"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        title="Trang sau"
                                    >
                                        <i className="fas fa-angle-right"></i>
                                    </button>
                                    <button
                                        className="table-btn btn-primary"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        title="Trang cuối"
                                    >
                                        <i className="fas fa-angle-double-right"></i>
                                    </button>
                                </div>

                                {/* Items per page selector */}
                                <div style={{ marginTop: '10px' }}>
                                    <label style={{ marginRight: '10px', color: '#666' }}>Số sản phẩm mỗi trang:</label>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        style={{
                                            padding: '5px 10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default LinhKienManager;
