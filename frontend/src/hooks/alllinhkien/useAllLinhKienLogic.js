import { useState, useEffect, useMemo } from "react";

export function useAllLinhKienLogic() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [sortOrder, setSortOrder] = useState("default");
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 12;

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = import.meta.env.VITE_HOST;
                const response = await fetch(`${apiUrl}/products.php`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (data.success && Array.isArray(data.data)) {
                    setAllProducts(data.data);
                } else {
                    setError(data.message || 'Không thể tải sản phẩm');
                }
            } catch (err) {
                setError('Lỗi khi tải sản phẩm: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        "Tất cả loại hàng",
        "Bộ xử lý (CPU)",
        "Bo mạch chủ (Mainboard)",
        "Bộ nhớ (RAM)",
        "Ổ cứng (Storage)",
        "Card đồ họa (GPU)",
        "Nguồn (PSU)",
        "Tản nhiệt (Cooling)",
        "Vỏ máy (Case)",
        "Chuột",
        "Bàn phím",
        "Màn hình",
    ];

    const categoryMapping = {
        "Tất cả loại hàng": "Tất cả loại hàng",
        "Bộ xử lý (CPU)": "CPU",
        "Bo mạch chủ (Mainboard)": "Mainboard",
        "Bộ nhớ (RAM)": "RAM",
        "Ổ cứng (Storage)": "storage",
        "Card đồ họa (GPU)": "GPU",
        "Nguồn (PSU)": "PSU",
        "Tản nhiệt (Cooling)": "tan_nhiet",
        "Vỏ máy (Case)": "Case",
        "Chuột": "Chuột",
        "Bàn phím": "Bàn phím",
        "Màn hình": "Màn hình",
    };

    const brands = useMemo(() => {
        const arr = allProducts.map(item => item?.ten_nha_san_xuat).filter(x => x && x.trim() !== "");
        return ["Tất cả hãng", ...Array.from(new Set(arr))];
    }, [allProducts]);

    const priceRanges = [
        "Tất cả giá",
        "Dưới 2 triệu",
        "2-5 triệu",
        "5-10 triệu",
        "Trên 10 triệu",
    ];

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedOptions, searchTerm, sortOrder]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter-bar')) {
                setActiveFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        let newSelectedOptions = [...selectedOptions];
        if (selectedOptions.includes(option)) {
            newSelectedOptions = selectedOptions.filter(item => item !== option);
        } else {
            if (categories.includes(option)) {
                // Nếu chọn loại khác 'Tất cả loại hàng', chỉ giữ lại loại này
                if (option !== "Tất cả loại hàng") {
                    newSelectedOptions = newSelectedOptions.filter(item => !categories.includes(item));
                } else {
                    // Nếu chọn 'Tất cả loại hàng', loại bỏ tất cả loại khác
                    newSelectedOptions = newSelectedOptions.filter(item => !categories.includes(item));
                }
            }
            if (brands.includes(option)) {
                if (option !== "Tất cả hãng") {
                    newSelectedOptions = newSelectedOptions.filter(item => !brands.includes(item));
                } else {
                    newSelectedOptions = newSelectedOptions.filter(item => !brands.includes(item));
                }
            }
            if (priceRanges.includes(option)) {
                if (option !== "Tất cả giá") {
                    newSelectedOptions = newSelectedOptions.filter(item => !priceRanges.includes(item));
                } else {
                    newSelectedOptions = newSelectedOptions.filter(item => !priceRanges.includes(item));
                }
            }
            if (!newSelectedOptions.includes(option)) {
                newSelectedOptions.push(option);
            }
        }
        setSelectedOptions(newSelectedOptions);
        setCurrentPage(1);
    };

    const normalizeText = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    const matchesSearchTerm = (product) => {
        if (!searchTerm) return true;
        const normalizedSearchTerm = normalizeText(searchTerm);
        const normalizedProductName = normalizeText(product.ten_sp || product.ten || "");
        const normalizedBrand = product.hang ? normalizeText(product.hang) : "";
        const normalizedCategory = product.danh_muc ? normalizeText(product.danh_muc) : "";
        // Nếu tìm kiếm là 'màn hình' thì chỉ khớp với sản phẩm có danh mục là màn hình
        if (normalizedSearchTerm.includes('man hinh') || normalizedSearchTerm.includes('monitor')) {
            return (
                normalizedProductName.includes(normalizedSearchTerm) ||
                normalizedCategory === 'man hinh' // chỉ đúng danh mục màn hình
            );
        }
        let matches =
            normalizedProductName.includes(normalizedSearchTerm) ||
            normalizedBrand.includes(normalizedSearchTerm) ||
            normalizedCategory.includes(normalizedSearchTerm);
        if (normalizedSearchTerm.includes('chuot') || normalizedSearchTerm.includes('mouse')) {
            matches = matches || normalizedCategory === 'chuot';
        }
        if (normalizedSearchTerm.includes('ban phim') || normalizedSearchTerm.includes('keyboard')) {
            matches = matches || normalizedCategory === 'ban phim';
        }
        return matches;
    };

    // Tính activeCategory, activeBrand, activePrice bên trong useMemo để đảm bảo cập nhật đúng
    const filteredItems = useMemo(() => {
        const activeCategory = categories.find(cat => cat !== "Tất cả loại hàng" && selectedOptions.includes(cat)) || "Tất cả loại hàng";
        const activeBrand = brands.find(br => br !== "Tất cả hãng" && selectedOptions.includes(br)) || "Tất cả hãng";
        const activePrice = priceRanges.find(price => price !== "Tất cả giá" && selectedOptions.includes(price)) || "Tất cả giá";
        const activeStatus = selectedOptions.find(opt => opt === "Còn hàng" || opt === "Hết hàng");

        // Lấy các filter thông số kỹ thuật
        const specsFilters = selectedOptions.filter(opt => opt.includes(":"));

        const result = allProducts.filter((product) => {
            if (!product.ten_sp || !product.gia_sau) return false;
            const originalCategory = categoryMapping[activeCategory];
            const matchesCategory =
                activeCategory === "Tất cả loại hàng" || (product.ten_danh_muc && product.ten_danh_muc.toLowerCase() === originalCategory.toLowerCase());
            const matchesBrand =
                activeBrand === "Tất cả hãng" || (product.ten_nha_san_xuat === activeBrand);
            const productPrice = parseFloat(product.gia_sau);
            const matchesPrice =
                activePrice === "Tất cả giá" ||
                (activePrice === "Dưới 2 triệu" && productPrice < 2000000) ||
                (activePrice === "2-5 triệu" && productPrice >= 2000000 && productPrice <= 5000000) ||
                (activePrice === "5-10 triệu" && productPrice >= 5000000 && productPrice <= 10000000) ||
                (activePrice === "Trên 10 triệu" && productPrice > 10000000);
            let matchesStatus = true;
            if (activeStatus === "Còn hàng") matchesStatus = Number(product.gia_sau) > 0;
            if (activeStatus === "Hết hàng") matchesStatus = Number(product.gia_sau) === 0;

            // Kiểm tra thông số kỹ thuật
            let matchesSpecs = true;
            if (specsFilters.length > 0 && product.thong_so) {
                matchesSpecs = specsFilters.every(filter => {
                    const [, specValue] = filter.split(": ");
                    return Object.values(product.thong_so).some(value =>
                        value && value.toString().toLowerCase().includes(specValue.toLowerCase())
                    );
                });
            }

            return matchesSearchTerm(product) && matchesCategory && matchesBrand && matchesPrice && matchesStatus && matchesSpecs;
        });
        console.log('Filtered items:', result); // Debug: log sản phẩm sau khi lọc
        return result;
    }, [allProducts, searchTerm, selectedOptions, categories, brands, priceRanges, categoryMapping]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const priceA = parseFloat(a.gia_sau);
            const priceB = parseFloat(b.gia_sau);
            if (sortOrder === "lowToHigh") return priceA - priceB;
            if (sortOrder === "highToLow") return priceB - priceA;
            return 0;
        });
    }, [filteredItems, sortOrder]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

    const clearAllFilters = () => {
        setSelectedOptions([]);
        setSearchTerm("");
        setActiveFilter(null);
        setSortOrder("default");
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    // Chuyển hướng sang trang chi tiết sản phẩm
    const handleProductClick = (id) => {
        window.location.href = `/linh-kien/${id}`;
    };

    // Suggest related products by category or brand
    const suggestRelatedProducts = (product, count = 4) => {
        if (!allProducts.length) return [];
        if (!product) {
            // Nếu không có sản phẩm gốc, trả về 4 sản phẩm đầu tiên
            return allProducts.slice(0, count);
        }
        // Suggest products from the same category, then same brand, then fill with random
        const sameCategory = allProducts.filter(
            p => p.ma_sp !== product.ma_sp && p.loai === product.loai
        );
        const sameBrand = allProducts.filter(
            p => p.ma_sp !== product.ma_sp && p.thong_so?.hang_san_xuat === product.thong_so?.hang_san_xuat
        );
        let related = [...sameCategory];
        if (related.length < count) {
            const remaining = count - related.length;
            const additionalFromBrand = sameBrand.slice(0, remaining);
            related = [...related, ...additionalFromBrand];
        }
        if (related.length < count) {
            const remaining = count - related.length;
            const randomProducts = allProducts
                .filter(p => !related.includes(p) && p.ma_sp !== product.ma_sp)
                .sort(() => 0.5 - Math.random())
                .slice(0, remaining);
            related = [...related, ...randomProducts];
        }
        return related;
    };

    return {
        currentPage,
        searchTerm,
        isSearchExpanded,
        selectedOptions,
        activeFilter,
        sortOrder,
        allProducts,
        loading,
        error,
        itemsPerPage,
        categories,
        categoryMapping,
        brands,
        priceRanges,
        setCurrentPage,
        setSearchTerm,
        setIsSearchExpanded,
        setSelectedOptions,
        setActiveFilter,
        setSortOrder,
        clearAllFilters,
        handlePageChange,
        handleFilterClick,
        handleSortChange,
        handleProductClick,
        suggestRelatedProducts,
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        sortedItems,
        toggleOption, // Thêm hàm này để component có thể sử dụng
        loading, // Thêm loading state
        error, // Thêm error state
    };
}
