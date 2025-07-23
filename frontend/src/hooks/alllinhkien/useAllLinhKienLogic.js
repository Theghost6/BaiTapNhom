import { useState, useEffect, useMemo, useCallback } from "react";

// Utility function for formatting currency
const formatCurrency = (amount) => {
    const validAmount = typeof amount === 'number' ? amount : (typeof amount === 'object' && amount.value ? amount.value : 0);
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(validAmount);
};

const normalizeText = (str) => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

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

    // Sidebar filter states
    const [sidebarCategory, setSidebarCategory] = useState("");
    const [sidebarBrand, setSidebarBrand] = useState("");
    const [sidebarPrice, setSidebarPrice] = useState("");
    const [sidebarStatus, setSidebarStatus] = useState("");
    const [sidebarSpecs, setSidebarSpecs] = useState({});
    const [specsCache, setSpecsCache] = useState({});
    const [openSection, setOpenSection] = useState('category');
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [debouncedCategory, setDebouncedCategory] = useState("");

    // Debounce category change để tránh lag
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCategory(sidebarCategory);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [sidebarCategory]);

    // Định nghĩa categoryMapping trước khi sử dụng
    const allCategories = [
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
        "Ổ cứng (Storage)": "Ổ cứng", // Sửa để khớp với database thực tế
        "Card đồ họa (GPU)": "GPU",
        "Nguồn (PSU)": "Nguồn",
        "Tản nhiệt (Cooling)": "Cooling",
        "Vỏ máy (Case)": "Case",
        "Chuột": "Chuột",
        "Bàn phím": "Bàn phím",
        "Màn hình": "Màn hình",
    };

    // Chỉ hiển thị categories có sản phẩm thực tế
    const categories = useMemo(() => {
        if (!allProducts.length) return ["Tất cả loại hàng"];

        const availableCategories = [...new Set(allProducts.map(p => p.ten_danh_muc || p.loai || p.danh_muc).filter(Boolean))];
        console.log('Real categories in database:', availableCategories);

        // Tìm các categories UI tương ứng với dữ liệu thực tế
        const mappedCategories = ["Tất cả loại hàng"];

        // Thay vì sử dụng mapping phức tạp, hãy sử dụng trực tiếp categories từ database
        availableCategories.forEach(realCategory => {
            // Tìm UI category tương ứng
            const uiCategory = Object.keys(categoryMapping).find(key =>
                categoryMapping[key].toLowerCase() === realCategory.toLowerCase()
            );

            if (uiCategory && !mappedCategories.includes(uiCategory)) {
                mappedCategories.push(uiCategory);
            } else if (!Object.values(categoryMapping).some(val => val.toLowerCase() === realCategory.toLowerCase())) {
                // Nếu không có mapping, thêm trực tiếp
                mappedCategories.push(realCategory);
            }
        });

        console.log('Available UI categories:', mappedCategories);
        return mappedCategories;
    }, [allProducts]);

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

    // Sidebar filter handlers
    const handleClearSidebarFilters = () => {
        setSidebarCategory("");
        setSidebarBrand("");
        setSidebarPrice("");
        setSidebarStatus("");
        setSidebarSpecs({});
        setSelectedOptions([]);
    };

    // Clear sidebar category nếu category đã chọn không còn có sẵn
    useEffect(() => {
        if (sidebarCategory && !categories.includes(sidebarCategory)) {
            setSidebarCategory("");
        }
    }, [categories, sidebarCategory]);

    // Hàm lấy tên hiển thị cho thông số kỹ thuật
    const getSpecDisplayName = (specKey, category) => {
        const specNames = {
            // CPU
            cores: "Số nhân",
            threads: "Số luồng",
            base_clock: "Tần số cơ bản",
            boost_clock: "Tần số tối đa",
            socket: "Socket",
            tdp: "TDP",
            cache: "Bộ nhớ đệm",

            // RAM
            dung_luong: "Dung lượng",
            toc_do: "Tốc độ",
            loai_ram: "Loại RAM",
            timing: "Timing",
            voltage: "Điện áp",

            // VGA/GPU
            Chipset: "Chipset",
            vram: "VRAM",
            memory_type: "Loại bộ nhớ",
            memory_bus: "Bus bộ nhớ",
            core_clock: "Tần số nhân",
            memory_clock: "Tần số bộ nhớ",

            // Mainboard
            chipset: "Chipset",
            socket_cpu: "Socket CPU",
            memorySlots: "Số khe RAM",
            max_memory: "RAM tối đa",
            form_factor: "Form Factor",

            // Storage
            dung_luong_luu_tru: "Dung lượng",
            toc_do_doc: "Tốc độ đọc",
            toc_do_ghi: "Tốc độ ghi",
            ket_noi: "Kết nối",
            loai_o_cung: "Loại ổ cứng",

            // PSU
            cong_suat_nguon: "Công suất",
            efficiency: "Hiệu suất",
            modular: "Modular",

            // Cooling
            loai_tan_nhiet: "Loại tản nhiệt",
            kich_thuoc_quat: "Kích thước quạt",
            rpm: "RPM",
            noise_level: "Độ ồn",

            // Peripherals
            type: "Loại",
            connection: "Kết nối",
            switch_type: "Loại switch",
            dpi: "DPI",
            polling_rate: "Polling Rate"
        };

        return specNames[specKey] || specKey;
    };

    // Khi bấm Áp dụng, cập nhật selectedOptions dựa trên các filter sidebar
    const handleApplySidebarFilters = () => {
        const newOptions = [];
        if (sidebarCategory) newOptions.push(sidebarCategory);
        if (sidebarBrand) newOptions.push(sidebarBrand);
        if (sidebarPrice) newOptions.push(sidebarPrice);
        if (sidebarStatus) newOptions.push(sidebarStatus);

        // Thêm thông số kỹ thuật vào selectedOptions
        Object.entries(sidebarSpecs).forEach(([specKey, specValue]) => {
            if (specValue) {
                const displayName = getSpecDisplayName(specKey, sidebarCategory);
                newOptions.push(`${displayName}: ${specValue}`);
            }
        });

        setSelectedOptions(newOptions);
        setActiveFilter(null);
    };

    // Hàm xóa từng filter đã chọn
    const handleRemoveSelectedFilter = (filter) => {
        if (categories.includes(filter)) setSidebarCategory("");
        if (brands.includes(filter)) setSidebarBrand("");
        if (priceRanges.includes(filter)) setSidebarPrice("");
        if (["Còn hàng", "Hết hàng"].includes(filter)) setSidebarStatus("");

        // Xóa thông số kỹ thuật
        if (filter.includes(":")) {
            const newSpecs = { ...sidebarSpecs };
            Object.keys(newSpecs).forEach(specKey => {
                const displayName = getSpecDisplayName(specKey, sidebarCategory);
                if (filter.startsWith(`${displayName}:`)) {
                    delete newSpecs[specKey];
                }
            });
            setSidebarSpecs(newSpecs);
        }

        // Cập nhật selectedOptions
        setSelectedOptions(selectedOptions.filter(opt => opt !== filter));
    };

    // Memoized và cached function để lấy thông số kỹ thuật
    const getSpecsForCategory = useCallback((category) => {
        // Kiểm tra cache trước
        if (specsCache[category]) {
            console.log('Using cached specs for:', category);
            return specsCache[category];
        }

        console.log('Computing specs for category:', category);

        // Lấy originalCategory từ mapping, nếu không có thì dùng chính category
        const originalCategory = categoryMapping[category] || category;
        if (!originalCategory || originalCategory === "Tất cả loại hàng") {
            return {};
        }

        // Tối ưu: Chỉ lọc sản phẩm cần thiết
        const filteredProducts = allProducts.filter(product => {
            // Kiểm tra nhiều trường có thể chứa thông tin danh mục
            const productCategory = product.ten_danh_muc || product.loai || product.danh_muc || "";
            return productCategory.toLowerCase() === originalCategory.toLowerCase();
        });

        console.log('Filtered products for', category, ':', filteredProducts.length);

        const specs = {};
        let processedCount = 0;

        // Tối ưu: Chỉ xử lý 100 sản phẩm đầu tiên để lấy specs
        const sampleProducts = filteredProducts.slice(0, 100);

        sampleProducts.forEach(product => {
            if (product.thong_so) {
                Object.keys(product.thong_so).forEach(specKey => {
                    const specValue = product.thong_so[specKey];
                    if (specValue && specValue !== "" && typeof specValue !== 'object') {
                        if (!specs[specKey]) {
                            specs[specKey] = new Set();
                        }
                        specs[specKey].add(String(specValue));
                    }
                });
                processedCount++;
            }
        });

        // Chuyển Set thành Array và sắp xếp (giới hạn 10 items per spec)
        const finalSpecs = {};
        Object.keys(specs).forEach(key => {
            const values = Array.from(specs[key]).sort();
            finalSpecs[key] = values.slice(0, 10); // Chỉ lấy 10 giá trị đầu
        });

        console.log('Final specs (processed', processedCount, 'products):', finalSpecs);

        // Cache kết quả
        setSpecsCache(prev => ({
            ...prev,
            [category]: finalSpecs
        }));

        return finalSpecs;
    }, [allProducts, specsCache, categoryMapping]);

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

                    // Debug: Log ra cấu trúc dữ liệu để kiểm tra
                    if (data.data.length > 0) {
                        console.log('Sample product structure:', data.data[0]);
                        console.log('Available categories in data:', [...new Set(data.data.map(p => p.ten_danh_muc || p.loai || p.danh_muc).filter(Boolean))]);
                    }
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

        // Debug log để hiểu vấn đề
        console.log('Active filters:', { activeCategory, activeBrand, activePrice, activeStatus, selectedOptions });

        // Lấy các filter thông số kỹ thuật
        const specsFilters = selectedOptions.filter(opt => opt.includes(":"));

        const result = allProducts.filter((product) => {
            // Kiểm tra cơ bản
            if (!product.ten_sp) return false;

            // Lọc theo category
            let matchesCategory = true;
            if (activeCategory !== "Tất cả loại hàng") {
                // Kiểm tra nhiều trường có thể chứa thông tin danh mục
                const productCategory = product.ten_danh_muc || product.loai || product.danh_muc || "";

                // Lấy expected category từ mapping, nếu không có thì dùng chính activeCategory
                const expectedCategory = categoryMapping[activeCategory] || activeCategory;

                matchesCategory = productCategory.toLowerCase() === expectedCategory.toLowerCase();

                // Debug: chỉ log khi category không khớp để tránh spam
                if (!matchesCategory && expectedCategory) {
                    console.log(`Product: ${product.ten_sp}, Category: ${productCategory}, Expected: ${expectedCategory}, Matches: ${matchesCategory}`);
                }
            }

            // Lọc theo brand
            let matchesBrand = true;
            if (activeBrand !== "Tất cả hãng") {
                matchesBrand = product.ten_nha_san_xuat === activeBrand;
            }

            // Lọc theo giá
            let matchesPrice = true;
            if (activePrice !== "Tất cả giá") {
                const productPrice = parseFloat(product.gia_sau || product.gia || 0);
                matchesPrice =
                    (activePrice === "Dưới 2 triệu" && productPrice < 2000000) ||
                    (activePrice === "2-5 triệu" && productPrice >= 2000000 && productPrice <= 5000000) ||
                    (activePrice === "5-10 triệu" && productPrice >= 5000000 && productPrice <= 10000000) ||
                    (activePrice === "Trên 10 triệu" && productPrice > 10000000);
            }

            // Lọc theo trạng thái hàng
            let matchesStatus = true;
            if (activeStatus === "Còn hàng") {
                matchesStatus = Number(product.gia_sau || product.gia || 0) > 0;
            }
            if (activeStatus === "Hết hàng") {
                matchesStatus = Number(product.gia_sau || product.gia || 0) === 0;
            }

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

            // Kiểm tra search term
            const matchesSearch = matchesSearchTerm(product);

            return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStatus && matchesSpecs;
        });

        console.log('Filtered items:', result.length, 'from', allProducts.length, 'for category:', activeCategory); // Debug: log số lượng sản phẩm sau khi lọc
        return result;
    }, [allProducts, searchTerm, selectedOptions, categories, brands, priceRanges, categoryMapping]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const priceA = parseFloat(a.gia_sau) || 0;
            const priceB = parseFloat(b.gia_sau) || 0;

            if (sortOrder === "lowToHigh") {
                // Loại bỏ sản phẩm hết hàng (giá ≤ 0) khỏi việc sắp xếp thấp đến cao
                if (priceA <= 0 && priceB > 0) return 1; // A hết hàng, đẩy xuống cuối
                if (priceB <= 0 && priceA > 0) return -1; // B hết hàng, đẩy xuống cuối
                if (priceA <= 0 && priceB <= 0) return 0; // Cả hai hết hàng, giữ nguyên thứ tự
                return priceA - priceB;
            }
            if (sortOrder === "highToLow") {
                // Với sắp xếp cao đến thấp, cũng loại bỏ sản phẩm hết hàng
                if (priceA <= 0 && priceB > 0) return 1; // A hết hàng, đẩy xuống cuối
                if (priceB <= 0 && priceA > 0) return -1; // B hết hàng, đẩy xuống cuối
                if (priceA <= 0 && priceB <= 0) return 0; // Cả hai hết hàng, giữ nguyên thứ tự
                return priceB - priceA;
            }
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
        toggleOption,
        loading,
        error,
        // Sidebar filter states and handlers
        sidebarCategory,
        setSidebarCategory,
        sidebarBrand,
        setSidebarBrand,
        sidebarPrice,
        setSidebarPrice,
        sidebarStatus,
        setSidebarStatus,
        sidebarSpecs,
        setSidebarSpecs,
        specsCache,
        setSpecsCache,
        openSection,
        setOpenSection,
        showAllBrands,
        setShowAllBrands,
        showAllCategories,
        setShowAllCategories,
        debouncedCategory,
        setDebouncedCategory,
        handleClearSidebarFilters,
        handleApplySidebarFilters,
        handleRemoveSelectedFilter,
        getSpecsForCategory,
        getSpecDisplayName,
        formatCurrency,
        normalizeText,
    };
}
