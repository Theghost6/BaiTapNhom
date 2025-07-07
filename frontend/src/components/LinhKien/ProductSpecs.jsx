import React from "react";

const specLabels = {
    dung_luong: "Dung lượng",
    loai_ram: "Loại RAM",
    bus_ram: "Bus RAM",
    ho_tro: "Hỗ trợ",
    dien_ap: "Điện áp",
    hang_san_xuat: "Hãng sản xuất",
    do_tre: "Độ trễ",
    den_led: "Đèn LED",
    Voltage: "Điện áp",
    loai_o_cung: "Loại ổ cứng",
    ket_noi: "Kết nối",
    toc_do_doc: "Tốc độ đọc",
    toc_do_ghi: "Tốc độ ghi",
    chat_lieu: "Chất liệu",
    tinh_nang_khac: "Tính năng khác",
    bao_hanh: "Bảo hành",
    Socket: "Socket",
    cores: "Số nhân",
    threads: "Số luồng",
    toc_do_xu_ly: "Tốc độ xử lý",
    Cache: "Bộ nhớ đệm",
    chip_do_hoa: "Chip đồ họa",
    the_he_cpu: "Thế hệ CPU",
    chipset: "Chipset",
    memorySlots: "Số khe RAM",
    ho_tro_ram: "Hỗ trợ RAM",
    dung_luong_max_ram: "Dung lượng RAM tối đa",
    LAN: "Mạng LAN",
    audio: "Âm thanh",
    id: "Mã sản phẩm",
    loai: "Loại sản phẩm",
    so_luong: "Số lượng",
    ten_sp: "Tên sản phẩm",
    images: "Hình ảnh",
    gia_sau: "Giá sau khuyến mãi",
    gia_truoc: "Giá trước khuyến mãi",
    thong_so: "Thông số kỹ thuật",
    mo_ta: "Mô tả",
    ngay_phat_hanh: "Ngày phát hành",
    khuyen_mai: "Khuyến mãi",
    kieu_bo_nho: "Kiểu bộ nhớ",
    giao_dien_bo_nho: "Giao diện bộ nhớ",
    loai_gpu: "Loại GPU",
    gpu_clock: "Xung nhịp GPU",
    pci: "Chuẩn PCI",
    sl_don_vi_xu_ly: "Số đơn vị xử lý",
    dau_cap_nguon: "Đầu cấp nguồn",
    nguon_de_xuat: "Nguồn đề xuất",
    dong_san_pham: "Dòng sản phẩm",
    tan_nhiet: "Tản nhiệt",
    Timing: "Timing",
    kich_thuoc: "Kích thước",
    cong_suat_nguon: "Công suất nguồn",
    quat_lam_mat: "Quạt làm mát",
    bao_mat: "Bảo mật",
    phan_mem: "Phần mềm đi kèm",
    chong_nuoc: "Chống nước",
    chong_soc: "Chống sốc",
    chong_bui: "Chống bụi",
    // ...bổ sung thêm nếu phát hiện key mới...
};

const ProductSpecs = ({ product }) => {
    if (!product) return null;
    return (
        <div className="product-specs">
            <h3>Thông số kỹ thuật</h3>
            <table className="specs-table">
                <tbody>
                    {product.thong_so &&
                        Object.entries(product.thong_so).map(([key, value]) => (
                            <tr key={key}>
                                <td className="spec-name">{specLabels[key] || key}</td>
                                <td className="spec-value">{value}</td>
                            </tr>
                        ))}
                    {(!product.thong_so || Object.keys(product.thong_so).length === 0) && (
                        <tr>
                            <td colSpan="2" className="no-specs">
                                Không có thông số kỹ thuật nào được cung cấp.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductSpecs;
