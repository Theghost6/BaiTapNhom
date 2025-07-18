import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({
    placeholder = "Tìm kiếm...",
    onSearch,
    searchFields = [], // Danh sách các field có thể search
    filterOptions = [], // Các option filter (ví dụ: trạng thái, loại...)
    showDateFilter = false,
    showStatusFilter = false,
    statusOptions = [],
    className = "",
    clearOnSearch = false
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedField, setSelectedField] = useState("all");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize component và gọi search ban đầu
    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            // Gọi search với params mặc định để load tất cả dữ liệu
            if (onSearch) {
                onSearch({
                    term: "",
                    field: "all",
                    filter: "",
                    status: "",
                    dateFrom: "",
                    dateTo: ""
                });
            }
        }
    }, [onSearch, isInitialized]);

    // Debounce search - chỉ chạy sau khi đã initialized
    useEffect(() => {
        if (!isInitialized) return;

        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 150); // Giảm debounce time xuống 150ms

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedField, selectedFilter, selectedStatus, dateFrom, dateTo, isInitialized]);

    const handleSearch = () => {
        const searchParams = {
            term: searchTerm.trim(),
            field: selectedField,
            filter: selectedFilter,
            status: selectedStatus,
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        onSearch && onSearch(searchParams);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedField("all");
        setSelectedFilter("");
        setSelectedStatus("");
        setDateFrom("");
        setDateTo("");
        setIsAdvancedOpen(false);

        // Gọi search với params rỗng
        onSearch && onSearch({
            term: "",
            field: "all",
            filter: "",
            status: "",
            dateFrom: "",
            dateTo: ""
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && clearOnSearch) {
            setSearchTerm("");
        }
    };

    return (
        <div className={`search-bar-container ${className} ${isAdvancedOpen ? 'filters-open' : ''}`}>
            <div className="search-bar-main">
                <div className="search-input-group">
                    <div className="search-input-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        {searchTerm && (
                            <button
                                className="clear-search-btn"
                                onClick={() => setSearchTerm("")}
                                type="button"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>

                    {/* Search Field Selector */}
                    {searchFields.length > 0 && (
                        <select
                            className="search-field-select"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                        >
                            <option value="all">Tất cả trường</option>
                            {searchFields.map((field) => (
                                <option key={field.value} value={field.value}>
                                    {field.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="search-actions">
                    <button
                        className="clear-btn"
                        onClick={handleClear}
                        type="button"
                    >
                        <i className="fas fa-eraser"></i>
                        <span>Xóa</span>
                    </button>

                    {(filterOptions.length > 0 || showDateFilter || showStatusFilter) && (
                        <button
                            className={`advanced-btn ${isAdvancedOpen ? 'active' : ''}`}
                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                            type="button"
                        >
                            <i className="fas fa-filter"></i>
                            <span>Bộ lọc</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {isAdvancedOpen && (
                <div className="search-filters">
                    <div className="filters-grid">
                        {/* Custom Filter Options */}
                        {filterOptions.length > 0 && (
                            <div className="filter-group">
                                <label className="filter-label">
                                    <i className="fas fa-filter"></i>
                                    <span>Lọc theo</span>
                                </label>
                                <select
                                    className="filter-select"
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    {filterOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Status Filter */}
                        {showStatusFilter && statusOptions.length > 0 && (
                            <div className="filter-group">
                                <label className="filter-label">
                                    <i className="fas fa-info-circle"></i>
                                    <span>Trạng thái</span>
                                </label>
                                <select
                                    className="filter-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Date Range Filter */}
                        {showDateFilter && (
                            <>
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <i className="fas fa-calendar-alt"></i>
                                        <span>Từ ngày</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="filter-date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <i className="fas fa-calendar-alt"></i>
                                        <span>Đến ngày</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="filter-date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
