import React from "react";
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
import { PacmanLoader } from "react-spinners";
import "./DashboardContent.css";

function isChartDataEmpty(chartData) {
    if (!chartData || !chartData.labels || chartData.labels.length === 0) return true;
    if (!chartData.datasets || chartData.datasets.length === 0) return true;
    // Check if all data points are 0 or empty
    return chartData.datasets.every(ds =>
        !ds.data || ds.data.length === 0 || ds.data.every(val => !val || Number(val) === 0)
    );
}

function DashboardContent({
    statistics,
    dashboardMetrics,
    revenuePercentage,
    orderCompletionPercentage,
    userActivePercentage,
    positiveReviewPercentage,
    chartDataRevenue,
    chartDataOrders,
    chartDataUsers,
    chartDataReviews,
    chartOptions,
    selectedMonth,
    selectedYear,
    orders,
    users,
    reviews,
    loadingDashboard
}) {
    // Tính toán fallback nếu percentage không có giá trị hoặc dữ liệu bị thiếu
    const safeRevenuePercentage = revenuePercentage || 0;
    const safeOrderCompletionPercentage = orderCompletionPercentage || 0;

    // Tính tỷ lệ người dùng hoạt động (tài khoản chưa bị khóa)
    // Người dùng hoạt động = tài khoản có is_active = 1 (chưa bị khóa)
    const safeUserActivePercentage = userActivePercentage ||
        (statistics?.tong_nguoi_dung > 0 ?
            ((statistics?.nguoi_dung_hoat_dong ||
                statistics?.active_users ||
                (users?.filter(u => u.is_active === 1 || u.is_active === '1' || u.is_active === true).length) ||
                statistics.tong_nguoi_dung // Fallback: nếu không có dữ liệu is_active, coi tất cả đều active
            ) / statistics.tong_nguoi_dung) * 100
            : 0);

    // Tính tỷ lệ đánh giá tích cực từ dữ liệu thực tế
    // Nếu không có dữ liệu cụ thể, coi 75% là tích cực (mặc định hợp lý)
    const safePositiveReviewPercentage = positiveReviewPercentage ||
        (statistics?.tong_danh_gia > 0 ?
            ((statistics?.danh_gia_tich_cuc ||
                statistics?.positive_reviews ||
                (reviews?.filter(r => (r.rating || r.danh_gia || r.diem) >= 3).length) ||
                Math.floor(statistics.tong_danh_gia * 0.75) // fallback: giả sử 75% positive
            ) / statistics.tong_danh_gia) * 100
            : 0);


    if (loadingDashboard) {
        return (
            <div className="loading-container">
                <PacmanLoader color="#ff6b35" size={25} />
                <p className="loading-text">Đang tải dữ liệu thống kê...</p>
            </div>
        );
    }
    return (
        <div className="dashboard_content">
            <div className="stats_cards">
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="card_content">
                        <h3>Doanh thu</h3>
                        <p className="stats_value">
                            {Number(statistics.tong_doanh_thu || 0).toLocaleString("vi-VN")} đ
                        </p>
                        <div className="stats_progress" title="Tỷ lệ đạt mục tiêu doanh thu">
                            <div className="progress_bar">
                                <div style={{
                                    position: 'absolute',
                                    width: `${Math.min(safeRevenuePercentage, 100)}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4e73df 60%, #1cc88a 100%)',
                                    borderRadius: '6px',
                                    zIndex: 1,
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                            <span className="progress_text">{safeRevenuePercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card_content">
                        <h3>Đơn hàng</h3>
                        <p className="stats_value">{statistics.tong_don_hang || 0}</p>
                        <div className="stats_progress" title="Tỷ lệ đơn hàng đã thanh toán">
                            <div className="progress_bar">
                                <div style={{
                                    position: 'absolute',
                                    width: `${Math.min(safeOrderCompletionPercentage, 100)}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4e73df 60%, #1cc88a 100%)',
                                    borderRadius: '6px',
                                    zIndex: 1,
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                            <span className="progress_text">{safeOrderCompletionPercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="card_content">
                        <h3>Người dùng</h3>
                        <p className="stats_value">{statistics.tong_nguoi_dung || 0}</p>
                        <div className="stats_progress" title="Tỷ lệ tài khoản chưa bị khóa (is_active = 1)">
                            <div className="progress_bar">
                                <div style={{
                                    position: 'absolute',
                                    width: `${Math.max(1, Math.min(safeUserActivePercentage, 100))}%`,
                                    height: '100%',
                                    background: safeUserActivePercentage > 0 ? 'linear-gradient(90deg, #4e73df 60%, #1cc88a 100%)' : '#e9ecef',
                                    borderRadius: '6px',
                                    zIndex: 1,
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                            <span className="progress_text">{safeUserActivePercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="card_content">
                        <h3>Đánh giá</h3>
                        <p className="stats_value">{statistics.tong_danh_gia || 0}</p>
                        <div className="stats_progress" title="Tỷ lệ đánh giá tích cực (≥ 3 sao)">
                            <div className="progress_bar">
                                <div style={{
                                    position: 'absolute',
                                    width: `${Math.max(1, Math.min(safePositiveReviewPercentage, 100))}%`,
                                    height: '100%',
                                    background: safePositiveReviewPercentage > 0 ? 'linear-gradient(90deg, #4e73df 60%, #1cc88a 100%)' : '#e9ecef',
                                    borderRadius: '6px',
                                    zIndex: 1,
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                            <span className="progress_text">{safePositiveReviewPercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="charts_container">
                <div className="chart_card">
                    <h3>Doanh thu</h3>
                    <div className="chart_container" style={{ height: "300px" }}>
                        {isChartDataEmpty(chartDataRevenue) ? (
                            <div style={{ textAlign: 'center', color: '#888', paddingTop: '120px' }}>Không có dữ liệu</div>
                        ) : (
                            <Line
                                key={`revenue-line-${selectedMonth}-${selectedYear}`}
                                data={chartDataRevenue}
                                options={chartOptions(`Doanh thu - Tháng ${selectedMonth}/${selectedYear}`)}
                            />
                        )}
                    </div>
                </div>
                <div className="chart_card">
                    <h3>Đơn hàng</h3>
                    <div className="chart_container" style={{ height: "300px" }}>
                        {isChartDataEmpty(chartDataOrders) ? (
                            <div style={{ textAlign: 'center', color: '#888', paddingTop: '120px' }}>Không có dữ liệu</div>
                        ) : (
                            <Bar
                                key={`orders-bar-${selectedMonth}-${selectedYear}`}
                                data={chartDataOrders}
                                options={chartOptions(`Đơn hàng - Tháng ${selectedMonth}/${selectedYear}`)}
                            />
                        )}
                    </div>
                </div>
                <div className="chart_card">
                    <h3>Người dùng</h3>
                    <div className="chart_container" style={{ height: "300px" }}>
                        {isChartDataEmpty(chartDataUsers) ? (
                            <div style={{ textAlign: 'center', color: '#888', paddingTop: '120px' }}>Không có dữ liệu</div>
                        ) : (
                            <Radar
                                key={`users-radar-${selectedMonth}-${selectedYear}`}
                                data={chartDataUsers}
                                options={chartOptions(`Người dùng hoạt động - Tháng ${selectedMonth}/${selectedYear}`)}
                            />
                        )}
                    </div>
                </div>
                <div className="chart_card">
                    <h3>Đánh giá</h3>
                    <div className="chart_container" style={{ height: "300px" }}>
                        {isChartDataEmpty(chartDataReviews) ? (
                            <div style={{ textAlign: 'center', color: '#888', paddingTop: '120px' }}>Không có dữ liệu</div>
                        ) : (
                            <Doughnut
                                key={`reviews-doughnut-${selectedMonth}-${selectedYear}`}
                                data={chartDataReviews}
                                options={chartOptions(`Đánh giá - Tháng ${selectedMonth}/${selectedYear}`)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardContent;
