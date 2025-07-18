import React, { useState, useEffect } from "react";
import "./EditLinhKienModal.css";

const apiUrl = import.meta.env.VITE_HOST;

function EditLinhKienModal({ isOpen, onClose, linhKien, loai, onSave, loaiLinhKienList, getFieldLabel, getFieldPlaceholder, getInputType }) {
    const [editData, setEditData] = useState({});
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imageUrls, setImageUrls] = useState('');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
    const [thongSo, setThongSo] = useState([]); // Array of {ten_thong_so, gia_tri_thong_so, thu_tu}

    // Các trường backend yêu cầu
    const requiredFields = [
        'ma_sp', 'ten_sp', 'gia_sau', 'gia_truoc', 'so_luong', 'bao_hanh', 'mo_ta', 'id_danh_muc', 'id_nha_san_xuat', 'trang_thai'
    ];
    // Khi mở modal, nếu thiếu trường nào thì bổ sung giá trị mặc định
    useEffect(() => {
        if (linhKien) {
            const initial = { ...linhKien };
            requiredFields.forEach(f => {
                if (typeof initial[f] === 'undefined') {
                    if (f === 'trang_thai') initial[f] = 1;
                    else if (f === 'so_luong') initial[f] = 0;
                    else initial[f] = '';
                }
            });
            setEditData(initial);

            // Load existing images if available
            if (linhKien.ma_sp) {
                loadExistingImages(linhKien.ma_sp);
                loadExistingThongSo(linhKien.ma_sp);
            }
        } else if (isOpen) {
            // Thêm mới: tạo object đủ trường
            const initial = {};
            requiredFields.forEach(f => {
                if (f === 'trang_thai') initial[f] = 1;
                else if (f === 'so_luong') initial[f] = 0;
                else initial[f] = '';
            });
            setEditData(initial);
            setExistingImages([]);
            setThongSo([]);
        }

        // Reset image states when modal opens/closes
        if (!isOpen) {
            setSelectedImages([]);
            setImagePreview([]);
            setImageUrls('');
            setUploadMode('file');
            setThongSo([]);
        }
    }, [linhKien, isOpen]);

    // Load existing images from server
    const loadExistingImages = async (productId) => {
        try {
            const response = await fetch(`${apiUrl}/api.php?action=get_product_images&ma_sp=${productId}`);
            const data = await response.json();

            if (data.success) {
                setExistingImages(data.images);
            }
        } catch (error) {
            console.error('Error loading existing images:', error);
        }
    };

    // Load existing thong so from server
    const loadExistingThongSo = async (productId) => {
        try {
            const response = await fetch(`${apiUrl}/api.php?action=get_product_thongso&ma_sp=${productId}`);
            const data = await response.json();

            if (data.success) {
                setThongSo(data.thongso || []);
            }
        } catch (error) {
            console.error('Error loading existing thong so:', error);
        }
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
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate files
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            alert('Một số file không hợp lệ (chỉ chấp nhận ảnh < 5MB)');
        }

        setSelectedImages(prev => [...prev, ...validFiles]);

        // Create preview URLs
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(prev => [...prev, {
                    file: file,
                    url: e.target.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove image from preview
    const removeImage = async (index, isExisting = false) => {
        if (isExisting) {
            const imageToDelete = existingImages[index];
            if (imageToDelete && imageToDelete.id) {
                try {
                    const response = await fetch(`${apiUrl}/api.php?action=delete_product_image`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: imageToDelete.id })
                    });

                    const data = await response.json();
                    if (data.success) {
                        setExistingImages(prev => prev.filter((_, i) => i !== index));
                    } else {
                        alert('Không thể xóa ảnh: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error deleting image:', error);
                    alert('Có lỗi xảy ra khi xóa ảnh');
                }
            } else {
                setExistingImages(prev => prev.filter((_, i) => i !== index));
            }
        } else {
            setSelectedImages(prev => prev.filter((_, i) => i !== index));
            setImagePreview(prev => prev.filter((_, i) => i !== index));
        }
    };

    if (!isOpen) return null;
    return (
        <div className="modal-overlay modal-open">
            <div className="modal-content">
                <h2>Chỉnh sửa linh kiện</h2>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();

                        // Build object đúng format backend
                        const submitData = {
                            ...editData,
                            gia_sau: Number(editData.gia_sau) || 0,
                            gia_truoc: editData.gia_truoc ? Number(editData.gia_truoc) : null,
                            so_luong: Number(editData.so_luong) || 0,
                            id_danh_muc: Number(editData.id_danh_muc) || null,
                            id_nha_san_xuat: editData.id_nha_san_xuat ? Number(editData.id_nha_san_xuat) : null,
                            trang_thai: Number(editData.trang_thai) || 1
                        };

                        try {
                            // Save product data first
                            console.log('Submitting product data:', submitData);
                            const savedProduct = await onSave(submitData);
                            console.log('Saved product response:', savedProduct);

                            const productId = savedProduct?.id || savedProduct?.ma_sp || editData.id || editData.ma_sp;
                            console.log('Using product ID for images:', productId);

                            // Handle image uploads if there are any
                            if (selectedImages.length > 0 && productId) {
                                console.log('Uploading images for product:', productId);
                                console.log('Selected images:', selectedImages);

                                // Use ma_sp instead of ID for foreign key constraint
                                const productCode = savedProduct?.ma_sp || editData.ma_sp;
                                console.log('Using product code for upload:', productCode);

                                if (!productCode) {
                                    console.error('No product code available for image upload');
                                    alert('Không thể upload ảnh: Thiếu mã sản phẩm');
                                    return;
                                }

                                const formData = new FormData();
                                formData.append('ma_sp', productCode);

                                selectedImages.forEach((file, index) => {
                                    console.log(`Adding file ${index}:`, file.name, file.size);
                                    formData.append('images[]', file);
                                });

                                // Upload images
                                const response = await fetch(`${apiUrl}/api.php?action=upload_product_image`, {
                                    method: 'POST',
                                    body: formData
                                });

                                const uploadResult = await response.json();
                                console.log('Upload result:', uploadResult);

                                if (!response.ok || !uploadResult.success) {
                                    console.error('Image upload failed:', uploadResult);
                                    alert('Lỗi upload ảnh: ' + (uploadResult.message || 'Unknown error'));
                                } else {
                                    console.log('Images uploaded successfully');
                                    // Reset file upload states
                                    setSelectedImages([]);
                                    setImagePreview([]);
                                    // Reload existing images to show newly uploaded ones
                                    const reloadCode = savedProduct?.ma_sp || editData.ma_sp;
                                    if (reloadCode) {
                                        await loadExistingImages(reloadCode);
                                    }
                                }
                            }

                            // Handle URL images if there are any
                            if (imageUrls.trim() && productId) {
                                const urls = imageUrls.split('\n').map(url => url.trim()).filter(url => url);

                                if (urls.length > 0) {
                                    // Use ma_sp instead of ID for foreign key constraint
                                    const productCode = savedProduct?.ma_sp || editData.ma_sp;
                                    console.log('Using product code for URL upload:', productCode);

                                    if (!productCode) {
                                        console.error('No product code available for URL upload');
                                        alert('Không thể thêm URL ảnh: Thiếu mã sản phẩm');
                                        return;
                                    }

                                    const response = await fetch(`${apiUrl}/api.php?action=add_product_image_urls`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            ma_sp: productCode,
                                            urls: urls
                                        })
                                    });

                                    const urlResult = await response.json();
                                    console.log('URL upload result:', urlResult);

                                    if (!response.ok || !urlResult.success) {
                                        console.error('URL images failed:', urlResult);
                                        alert('Lỗi thêm URL ảnh: ' + (urlResult.message || 'Unknown error'));
                                    } else {
                                        console.log('URL images added successfully');
                                        // Reset URL input
                                        setImageUrls('');
                                        // Reload existing images to show newly added ones
                                        const reloadCode = savedProduct?.ma_sp || editData.ma_sp;
                                        if (reloadCode) {
                                            await loadExistingImages(reloadCode);
                                        }
                                    }
                                }
                            }

                            // Handle thong so if there are any
                            if (thongSo.length > 0 && productId) {
                                const validThongSo = thongSo.filter(ts =>
                                    ts.ten_thong_so.trim() && ts.gia_tri_thong_so.trim()
                                );

                                if (validThongSo.length > 0) {
                                    const productCode = savedProduct?.ma_sp || editData.ma_sp;

                                    const response = await fetch(`${apiUrl}/api.php?action=save_product_thongso`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            ma_sp: productCode,
                                            thongso: validThongSo
                                        })
                                    });

                                    const thongsoResult = await response.json();
                                    console.log('Thong so save result:', thongsoResult);

                                    if (!response.ok || !thongsoResult.success) {
                                        console.error('Thong so save failed:', thongsoResult);
                                        alert('Lỗi lưu thông số: ' + (thongsoResult.message || 'Unknown error'));
                                    }
                                }
                            }

                            onClose();
                        } catch (error) {
                            console.error('Error saving product:', error);
                            alert('Có lỗi xảy ra khi lưu sản phẩm');
                        }
                    }}
                >
                    {/* Loại linh kiện giữ nguyên */}
                    <div className="form-group">
                        <label>Mã sản phẩm:</label>
                        <input
                            type="text"
                            value={editData.ma_sp || ''}
                            onChange={e => setEditData(d => ({ ...d, ma_sp: e.target.value }))}
                            required
                        />
                    </div>
                    {/* Nếu là thêm mới, luôn render đủ trường (không phụ thuộc vào getFieldLabel/getFieldPlaceholder) */}
                    {requiredFields.filter(key => key !== 'ma_sp').map(key => (
                        <div className="form-group" key={key}>
                            <label htmlFor={`edit-${key}`}>{getFieldLabel ? getFieldLabel(key) : key}:</label>
                            {key === 'mo_ta' ? (
                                <textarea
                                    id={`edit-${key}`}
                                    placeholder={getFieldPlaceholder ? getFieldPlaceholder(key) : key}
                                    value={editData[key] || ''}
                                    onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                                />
                            ) : key === 'gia_sau' || key === 'gia_truoc' ? (
                                <div className="price-input">
                                    <input
                                        id={`edit-${key}`}
                                        type="number"
                                        placeholder={getFieldPlaceholder ? getFieldPlaceholder(key) : key}
                                        value={editData[key] || ''}
                                        onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                                    />
                                    <span className="price-suffix">VNĐ</span>
                                </div>
                            ) : key === 'id_danh_muc' || key === 'id_nha_san_xuat' ? (
                                <input
                                    id={`edit-${key}`}
                                    type="number"
                                    placeholder={getFieldPlaceholder ? getFieldPlaceholder(key) : key}
                                    value={editData[key] || ''}
                                    onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                                />
                            ) : key === 'trang_thai' ? (
                                <select
                                    id={`edit-${key}`}
                                    value={editData[key]}
                                    onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                                >
                                    <option value={1}>Hiển thị</option>
                                    <option value={0}>Ẩn</option>
                                </select>
                            ) : (
                                <input
                                    id={`edit-${key}`}
                                    type={getInputType ? getInputType(key) : 'text'}
                                    placeholder={getFieldPlaceholder ? getFieldPlaceholder(key) : key}
                                    value={editData[key] || ''}
                                    onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                                />
                            )}
                        </div>
                    ))}

                    {/* Image Upload Section */}
                    <div className="form-group">
                        <label>Ảnh sản phẩm:</label>

                        {/* Upload Mode Selection */}
                        <div className="upload-mode-selector">
                            <button
                                type="button"
                                className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
                                onClick={() => setUploadMode('file')}
                            >
                                <i className="fas fa-upload"></i> Tải file
                            </button>
                            <button
                                type="button"
                                className={`mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
                                onClick={() => setUploadMode('url')}
                            >
                                <i className="fas fa-link"></i> Nhập URL
                            </button>
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="existing-images-section">
                                <h4>Ảnh hiện tại:</h4>
                                <div className="image-preview-container">
                                    {existingImages.map((image, index) => (
                                        <div key={`existing-${index}`} className="image-preview-item">
                                            <img src={image.url || image} alt={`Existing ${index}`} />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => removeImage(index, true)}
                                                title="Xóa ảnh"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Upload Mode */}
                        {uploadMode === 'file' && (
                            <div className="image-upload-section">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="image-upload-input"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="image-upload-label">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                    <span>Chọn ảnh mới (Ctrl để chọn nhiều)</span>
                                    <small>JPG, PNG, GIF - Tối đa 5MB mỗi ảnh</small>
                                </label>
                            </div>
                        )}

                        {/* URL Input Mode */}
                        {uploadMode === 'url' && (
                            <div className="url-input-section">
                                <textarea
                                    className="url-input"
                                    placeholder="Nhập URL ảnh (mỗi URL một dòng)&#10;Ví dụ:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.png"
                                    value={imageUrls}
                                    onChange={(e) => setImageUrls(e.target.value)}
                                    rows={4}
                                />
                                <small className="url-hint">
                                    <i className="fas fa-info-circle"></i>
                                    Nhập mỗi URL ảnh trên một dòng. Hỗ trợ JPG, PNG, GIF, WebP
                                </small>
                            </div>
                        )}

                        {/* New Images Preview (for file upload) */}
                        {uploadMode === 'file' && imagePreview.length > 0 && (
                            <div className="new-images-section">
                                <h4>Ảnh mới sẽ thêm:</h4>
                                <div className="image-preview-container">
                                    {imagePreview.map((preview, index) => (
                                        <div key={`new-${index}`} className="image-preview-item">
                                            <img src={preview.url} alt={preview.name} />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => removeImage(index, false)}
                                                title="Xóa ảnh"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <span className="image-name">{preview.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thong So Section */}
                    <div className="form-group">
                        <label>Thông số kỹ thuật:</label>

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
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            <i className="fas fa-times"></i> Hủy
                        </button>
                        <button type="submit" className="save-button">
                            <i className="fas fa-save"></i> Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditLinhKienModal;
