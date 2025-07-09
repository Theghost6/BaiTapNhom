import React from "react";
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
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
    if (loadingDashboard) {
        return (
            <div className="loading">
                <div className="loading_spinner"></div>
                <p>Đang tải dữ liệu thống kê...</p>
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
                        <p className="stats_progress" title="Tỷ lệ đạt mục tiêu doanh thu">
                            <span className="progress_bar" style={{ width: `${revenuePercentage}%` }}></span>
                            <span className="progress_text">{revenuePercentage.toFixed(1)}%</span>
                        </p>
                    </div>
                </div>
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card_content">
                        <h3>Đơn hàng</h3>
                        <p className="stats_value">{orders.length || 0}</p>
                        <p className="stats_progress" title="Tỷ lệ đơn hàng đã thanh toán">
                            <span className="progress_bar" style={{ width: `${orderCompletionPercentage}%` }}></span>
                            <span className="progress_text">{orderCompletionPercentage.toFixed(1)}%</span>
                        </p>
                    </div>
                </div>
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="card_content">
                        <h3>Người dùng</h3>
                        <p className="stats_value">{users.length || 0}</p>
                        <p className="stats_progress" title="Tỷ lệ người dùng hoạt động">
                            <span className="progress_bar" style={{ width: `${userActivePercentage}%` }}></span>
                            <span className="progress_text">{userActivePercentage.toFixed(1)}%</span>
                        </p>
                    </div>
                </div>
                <div className="stats_card">
                    <div className="card_icon">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="card_content">
                        <h3>Đánh giá</h3>
                        <p className="stats_value">{reviews.length || 0}</p>
                        <p className="stats_progress" title="Tỷ lệ đánh giá tích cực (≥ 3 sao)">
                            <span className="progress_bar" style={{ width: `${positiveReviewPercentage}%` }}></span>
                            <span className="progress_text">{positiveReviewPercentage.toFixed(1)}%</span>
                        </p>
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
