import React, { useState, useEffect } from "react";
import "./EditLinhKienModal.css";

function EditLinhKienModal({ isOpen, onClose, linhKien, loai, onSave, loaiLinhKienList, getFieldLabel, getFieldPlaceholder, getInputType }) {
    const [editData, setEditData] = useState({});

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
        } else if (isOpen) {
            // Thêm mới: tạo object đủ trường
            const initial = {};
            requiredFields.forEach(f => {
                if (f === 'trang_thai') initial[f] = 1;
                else if (f === 'so_luong') initial[f] = 0;
                else initial[f] = '';
            });
            setEditData(initial);
        }
    }, [linhKien, isOpen]);

    if (!isOpen) return null;
    return (
        <div className="modal-overlay modal-open">
            <div className="modal-content">
                <h2>Chỉnh sửa linh kiện</h2>
                <form
                    onSubmit={e => {
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
                        onSave(submitData);
                        onClose();
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
