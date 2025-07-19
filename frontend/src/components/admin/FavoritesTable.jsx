import React, { useState, useMemo } from "react";
import "./CommonTable.css";

function FavoritesTable({ favorites, mostFavorited }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Tính toán thống kê theo tháng
    const monthlyStats = useMemo(() => {
        const currentDate = new Date();
        const filteredFavorites = favorites.filter(f => {
            const favoriteDate = new Date(f.created_at);
            return favoriteDate.getMonth() === selectedMonth && favoriteDate.getFullYear() === selectedYear;
        });

        // Debug: Log một vài record để kiểm tra cấu trúc dữ liệu
        if (filteredFavorites.length > 0) {
            console.log('Sample favorite record:', filteredFavorites[0]);
            console.log('Available fields:', Object.keys(filteredFavorites[0]));
        }

        // Nhóm theo sản phẩm và đếm số lần yêu thích
        const productCounts = {};
        filteredFavorites.forEach(f => {
            if (productCounts[f.ma_sp]) {
                productCounts[f.ma_sp].count++;
                // Cập nhật thông tin nếu record hiện tại có đầy đủ hơn
                if (!productCounts[f.ma_sp].ten_san_pham && f.ten_san_pham) {
                    productCounts[f.ma_sp].ten_san_pham = f.ten_san_pham;
                }
                if (!productCounts[f.ma_sp].danh_muc && f.danh_muc) {
                    productCounts[f.ma_sp].danh_muc = f.danh_muc;
                }
                if (!productCounts[f.ma_sp].gia && f.gia) {
                    productCounts[f.ma_sp].gia = f.gia;
                }
            } else {
                productCounts[f.ma_sp] = {
                    count: 1,
                    ten_san_pham: f.ten_san_pham || "Không xác định",
                    ma_sp: f.ma_sp,
                    danh_muc: f.danh_muc || null,
                    gia: f.gia || null
                };
            }
        });

        // Sắp xếp theo số lần yêu thích
        const topProducts = Object.values(productCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Thống kê theo ngày trong tháng
        const dailyStats = {};
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            dailyStats[day] = 0;
        }

        filteredFavorites.forEach(f => {
            const day = new Date(f.created_at).getDate();
            dailyStats[day]++;
        });

        return {
            totalMonth: filteredFavorites.length,
            uniqueProducts: Object.keys(productCounts).length,
            topProducts,
            dailyStats,
            avgPerDay: (filteredFavorites.length / daysInMonth).toFixed(1)
        };
    }, [favorites, selectedMonth, selectedYear]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    // Tạo data cho biểu đồ cột đơn giản
    const maxDailyCount = Math.max(...Object.values(monthlyStats.dailyStats));
    const chartHeight = 100;
    return (
        <div className="table-container">
            {/* Header với bộ chọn tháng/năm */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
            }}>
                <h2 style={{ margin: 0, color: '#1e293b' }}>📊 Thống kê yêu thích theo tháng</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="table-select"
                    >
                        {monthNames.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="table-select"
                    >
                        {[2023, 2024, 2025].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Thống kê tổng quan tháng */}
            <div className="stats-container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div className="stat-card" style={{
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>{monthlyStats.totalMonth}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Lượt yêu thích trong tháng</div>
                </div>
                <div className="stat-card" style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #dcfce7',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{monthlyStats.uniqueProducts}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Sản phẩm được yêu thích</div>
                </div>
                <div className="stat-card" style={{
                    padding: '16px',
                    backgroundColor: '#fefce8',
                    borderRadius: '8px',
                    border: '1px solid #fef3c7',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>{monthlyStats.avgPerDay}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Trung bình/ngày</div>
                </div>
                <div className="stat-card" style={{
                    padding: '16px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '8px',
                    border: '1px solid #f3e8ff',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea' }}>{Math.max(...Object.values(monthlyStats.dailyStats))}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Cao nhất trong ngày</div>
                </div>
            </div>

            {/* Biểu đồ cột theo ngày */}
            <div style={{
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>📈 Biểu đồ yêu thích theo ngày</h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'end',
                    height: `${chartHeight}px`,
                    gap: '2px',
                    padding: '10px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '4px',
                    overflowX: 'auto'
                }}>
                    {Object.entries(monthlyStats.dailyStats).map(([day, count]) => (
                        <div key={day} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '20px'
                        }}>
                            <div
                                style={{
                                    width: '16px',
                                    height: maxDailyCount > 0 ? `${(count / maxDailyCount) * (chartHeight - 30)}px` : '2px',
                                    backgroundColor: count > 0 ? '#3b82f6' : '#e5e7eb',
                                    borderRadius: '2px 2px 0 0',
                                    marginBottom: '4px',
                                    transition: 'all 0.3s ease'
                                }}
                                title={`Ngày ${day}: ${count} lượt yêu thích`}
                            />
                            <span style={{
                                fontSize: '10px',
                                color: '#64748b',
                                transform: 'rotate(-45deg)',
                                whiteSpace: 'nowrap'
                            }}>
                                {day}
                            </span>
                        </div>
                    ))}
                </div>
                <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#64748b'
                }}>
                    Ngày trong tháng {monthNames[selectedMonth]} {selectedYear}
                </div>
            </div>
            {/* Top sản phẩm được yêu thích nhất trong tháng */}
            <div className="table-scroll-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="id-column">Hạng</th>
                            <th className="id-column">Mã sản phẩm</th>
                            <th className="name-column">Tên sản phẩm</th>
                            <th className="quantity-column">Số lượt yêu thích</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyStats.topProducts.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="table-empty">
                                    Không có dữ liệu yêu thích trong {monthNames[selectedMonth]} {selectedYear}
                                </td>
                            </tr>
                        ) : (
                            monthlyStats.topProducts.map((product, index) => (
                                <tr key={product.ma_sp} style={{
                                    backgroundColor: index === 0 ? '#fef3c7' : index === 1 ? '#e0f2fe' : index === 2 ? '#fce7f3' : 'inherit'
                                }}>
                                    <td className="id-column">
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px'
                                        }}>
                                            {index === 0 && <span style={{ fontSize: '16px' }}>🥇</span>}
                                            {index === 1 && <span style={{ fontSize: '16px' }}>🥈</span>}
                                            {index === 2 && <span style={{ fontSize: '16px' }}>🥉</span>}
                                            <span style={{ fontWeight: 'bold' }}>#{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="id-column">
                                        <span style={{
                                            fontFamily: 'Monaco, monospace',
                                            backgroundColor: '#f3f4f6',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {product.ma_sp}
                                        </span>
                                    </td>
                                    <td className="name-column">
                                        <span title={product.ten_san_pham}>
                                            {product.ten_san_pham || "Không xác định"}
                                        </span>
                                    </td>
                                    <td className="quantity-column">
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px'
                                        }}>
                                            <span style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                color: '#dc2626'
                                            }}>
                                                {product.count}
                                            </span>
                                            <span style={{ fontSize: '12px' }}>❤️</span>
                                        </div>
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

export default FavoritesTable;
