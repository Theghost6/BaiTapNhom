import { useState, useMemo, useCallback } from 'react';

/**
 * Hook để xử lý logic tìm kiếm chung cho tất cả các tab admin
 * @param {Array} data - Dữ liệu gốc cần search
 * @param {string} tabType - Loại tab (users, orders, payments, reviews, contacts, products)
 * @param {Object} initialFilters - Bộ lọc mặc định
 * @returns {Object} - Kết quả search và các hàm xử lý
 */
function useAdminSearch(data = [], tabType = '', initialFilters = {}) {
    const [searchParams, setSearchParams] = useState({
        term: "",
        field: "all",
        filter: "",
        status: "",
        dateFrom: "",
        dateTo: "",
        ...initialFilters
    });

    // Cấu hình cho từng tab
    const getTabConfig = (type) => {
        const configs = {
            users: {
                placeholder: "Tìm kiếm tài khoản (tên, email, số điện thoại...)",
                searchFields: [
                    { value: "user", label: "Tên người dùng" },
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Số điện thoại" }
                ],
                filterOptions: [
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "Người dùng" }
                ],
                statusOptions: [
                    { value: "1", label: "Hoạt động" },
                    { value: "0", label: "Bị khóa" }
                ],
                showDateFilter: false,
                showStatusFilter: true
            },
            orders: {
                placeholder: "Tìm kiếm đơn hàng (ID, tên khách hàng, email...)",
                searchFields: [
                    { value: "id", label: "ID đơn hàng" },
                    { value: "ma_nguoi_dung", label: "Mã người dùng" },
                    { value: "ten_nguoi_dung", label: "Tên khách hàng" },
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Số điện thoại" }
                ],
                filterOptions: [],
                statusOptions: [
                    { value: "Chờ xử lý", label: "Chờ xử lý" },
                    { value: "Đang xử lý", label: "Đang xử lý" },
                    { value: "Đã thanh toán", label: "Đã thanh toán" },
                    { value: "Đã giao", label: "Đã giao" },
                    { value: "Đã hủy", label: "Đã hủy" }
                ],
                showDateFilter: true,
                showStatusFilter: true
            },
            payments: {
                placeholder: "Tìm kiếm thanh toán (mã đơn hàng, mã giao dịch...)",
                searchFields: [
                    { value: "ma_don_hang", label: "Mã đơn hàng" },
                    { value: "ma_giao_dich", label: "Mã giao dịch" },
                    { value: "phuong_thuc", label: "Phương thức thanh toán" }
                ],
                filterOptions: [
                    { value: "vnpay", label: "VNPay" },
                    { value: "momo", label: "MoMo" },
                    { value: "banking", label: "Banking" },
                    { value: "cod", label: "COD" }
                ],
                statusOptions: [
                    { value: "Thành công", label: "Thành công" },
                    { value: "Chờ thanh toán", label: "Chờ thanh toán" },
                    { value: "Thất bại", label: "Thất bại" }
                ],
                showDateFilter: true,
                showStatusFilter: true
            },
            reviews: {
                placeholder: "Tìm kiếm đánh giá (nội dung, người đánh giá, sản phẩm...)",
                searchFields: [
                    { value: "noi_dung", label: "Nội dung đánh giá" },
                    { value: "ten_nguoi_dung", label: "Tên người đánh giá" },
                    { value: "ten_san_pham", label: "Tên sản phẩm" }
                ],
                filterOptions: [
                    { value: "5", label: "5 sao" },
                    { value: "4", label: "4 sao" },
                    { value: "3", label: "3 sao" },
                    { value: "2", label: "2 sao" },
                    { value: "1", label: "1 sao" }
                ],
                statusOptions: [],
                showDateFilter: true,
                showStatusFilter: false
            },
            contacts: {
                placeholder: "Tìm kiếm liên hệ (tên, email, tiêu đề, nội dung...)",
                searchFields: [
                    { value: "ten", label: "Tên người liên hệ" },
                    { value: "email", label: "Email" },
                    { value: "tieu_de", label: "Tiêu đề" },
                    { value: "noi_dung", label: "Nội dung" }
                ],
                filterOptions: [],
                statusOptions: [
                    { value: "chua_xu_ly", label: "Chưa xử lý" },
                    { value: "dang_xu_ly", label: "Đang xử lý" },
                    { value: "da_xu_ly", label: "Đã xử lý" }
                ],
                showDateFilter: true,
                showStatusFilter: true
            },
            products: {
                placeholder: "Tìm kiếm sản phẩm (tên, hãng, mô tả...)",
                searchFields: [
                    { value: "ten_sp", label: "Tên sản phẩm" },
                    { value: "ten_nha_san_xuat", label: "Hãng" },
                    { value: "ma_sp", label: "Mã sản phẩm" },
                    { value: "mo_ta", label: "Mô tả" }
                ],
                filterOptions: [
                    { value: "1", label: "Ổ cứng" },
                    { value: "2", label: "Card màn hình" },
                    { value: "3", label: "RAM" },
                    { value: "4", label: "CPU" },
                    { value: "5", label: "Mainboard" },
                    { value: "6", label: "Nguồn máy tính" },
                    { value: "7", label: "Vỏ case" },
                    { value: "8", label: "Tản nhiệt" },
                    { value: "9", label: "Linh kiện khác" },
                    { value: "10", label: "Màn hình" },
                    { value: "19", label: "Bàn phím" },
                    { value: "20", label: "Chuột" }
                ],
                statusOptions: [
                    { value: "1", label: "Hoạt động" },
                    { value: "0", label: "Ngừng hoạt động" }
                ],
                showDateFilter: false,
                showStatusFilter: true
            },
            favorites: {
                placeholder: "Tìm kiếm yêu thích (tên sản phẩm, mã sản phẩm...)",
                searchFields: [
                    { value: "ten_san_pham", label: "Tên sản phẩm" },
                    { value: "ma_sp", label: "Mã sản phẩm" }
                ],
                filterOptions: [],
                statusOptions: [],
                showDateFilter: true,
                showStatusFilter: false
            }
        };

        return configs[type] || {
            placeholder: "Tìm kiếm...",
            searchFields: [],
            filterOptions: [],
            statusOptions: [],
            showDateFilter: false,
            showStatusFilter: false
        };
    };

    const tabConfig = getTabConfig(tabType);

    // Hàm search chính với memoization tốt hơn và tối ưu cho lượng lớn dữ liệu
    const filteredData = useMemo(() => {
        // Nếu không có dữ liệu hoặc đang loading thì return array rỗng
        if (!data || data.length === 0) return [];

        // Nếu không có filter nào thì return toàn bộ dữ liệu
        const hasFilters = searchParams.term ||
            searchParams.filter ||
            searchParams.status ||
            searchParams.dateFrom ||
            searchParams.dateTo;

        if (!hasFilters) return data;

        let result = data; // Không clone ngay để tiết kiệm memory

        // 1. Lọc theo từ khóa search - tối ưu hóa
        if (searchParams.term && searchParams.term.trim() !== "") {
            const searchTerm = searchParams.term.toLowerCase().trim();
            const searchWords = searchTerm.split(/\s+/); // Split thành nhiều từ

            result = result.filter(item => {
                if (searchParams.field === "all") {
                    // Tìm kiếm tất cả các field - tối ưu hóa
                    const searchableValues = Object.values(item)
                        .filter(value => value !== null && value !== undefined)
                        .map(value => value.toString().toLowerCase());

                    const combinedText = searchableValues.join(' ');

                    // Kiểm tra tất cả từ khóa có trong text không
                    return searchWords.every(word => combinedText.includes(word));
                } else {
                    // Tìm kiếm theo field cụ thể
                    const fieldValue = item[searchParams.field];
                    if (!fieldValue) return false;

                    const fieldText = fieldValue.toString().toLowerCase();
                    return searchWords.every(word => fieldText.includes(word));
                }
            });
        }

        // 1. Lọc theo từ khóa search
        if (searchParams.term && searchParams.term.trim() !== "") {
            const searchTerm = searchParams.term.toLowerCase().trim();

            result = result.filter(item => {
                if (searchParams.field === "all") {
                    // Tìm kiếm tất cả các field
                    return Object.values(item).some(value =>
                        value && value.toString().toLowerCase().includes(searchTerm)
                    );
                } else {
                    // Tìm kiếm theo field cụ thể
                    const fieldValue = item[searchParams.field];
                    return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm);
                }
            });
        }

        // 2. Lọc theo filter (loại, hãng, phương thức...)
        if (searchParams.filter && searchParams.filter !== "") {
            result = result.filter(item => {
                // Kiểm tra các field có thể là filter
                const filterFields = ['loai', 'hang', 'ten_nha_san_xuat', 'id_danh_muc', 'phuong_thuc', 'role', 'so_sao'];

                for (const field of filterFields) {
                    if (item[field] && item[field].toString() === searchParams.filter) {
                        return true;
                    }
                }
                return false;
            });
        }

        // 3. Lọc theo trạng thái
        if (searchParams.status && searchParams.status !== "") {
            result = result.filter(item => {
                const statusFields = ['trang_thai', 'trang_thai_thanh_toan', 'is_active'];

                for (const field of statusFields) {
                    if (item[field] !== undefined) {
                        // Xử lý trường hợp is_active (0/1)
                        if (field === 'is_active' || field === 'trang_thai') {
                            return item[field].toString() === searchParams.status;
                        }
                        // Xử lý các trường hợp khác
                        return item[field] === searchParams.status;
                    }
                }
                return false;
            });
        }

        // 4. Lọc theo khoảng thời gian
        if (searchParams.dateFrom || searchParams.dateTo) {
            result = result.filter(item => {
                const dateFields = ['created_at', 'thoi_gian_thanh_toan', 'thoi_gian_cap_nhat', 'ngay_tao'];

                for (const field of dateFields) {
                    if (item[field]) {
                        const itemDate = new Date(item[field]);

                        // Kiểm tra từ ngày
                        if (searchParams.dateFrom) {
                            const fromDate = new Date(searchParams.dateFrom);
                            if (itemDate < fromDate) continue;
                        }

                        // Kiểm tra đến ngày
                        if (searchParams.dateTo) {
                            const toDate = new Date(searchParams.dateTo);
                            toDate.setHours(23, 59, 59, 999); // Set to end of day
                            if (itemDate > toDate) continue;
                        }

                        return true;
                    }
                }

                // Nếu không có date field nào thì bỏ qua filter date
                if (!searchParams.dateFrom && !searchParams.dateTo) return true;

                return false;
            });
        }

        return result;
    }, [data, searchParams]);

    // Hàm xử lý search từ SearchBar component
    const handleSearch = (newSearchParams) => {
        setSearchParams(prev => ({
            ...prev,
            ...newSearchParams
        }));
    };

    // Hàm reset search
    const resetSearch = () => {
        setSearchParams({
            term: "",
            field: "all",
            filter: "",
            status: "",
            dateFrom: "",
            dateTo: "",
            ...initialFilters
        });
    };

    // Hàm set filter cụ thể
    const setFilter = (key, value) => {
        setSearchParams(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Thống kê kết quả search
    const searchStats = {
        total: data.length,
        filtered: filteredData.length,
        isFiltered: searchParams.term !== "" ||
            searchParams.filter !== "" ||
            searchParams.status !== "" ||
            searchParams.dateFrom !== "" ||
            searchParams.dateTo !== ""
    };

    return {
        filteredData,
        searchParams,
        handleSearch,
        resetSearch,
        setFilter,
        searchStats,
        tabConfig
    };
}

export default useAdminSearch;
