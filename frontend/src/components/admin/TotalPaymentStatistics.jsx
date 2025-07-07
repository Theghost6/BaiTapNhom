import React from "react";
import "./TotalPaymentStatistics.css";
import { Line } from "react-chartjs-2";

function TotalPaymentStatistics({ statistics, chartData, chartOptions, selectedMonth, selectedYear }) {
    return statistics ? (
        <div className="statistics_content">
            <div className="stats_cards">
                <div className="stats_card revenue">
                    <div className="card_icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="card_content">
                        <h3>Tổng doanh thu</h3>
                        <p className="stats_value">
                            {Number(statistics.tong_doanh_thu || 0).toLocaleString("vi-VN")} đ
                        </p>
                    </div>
                </div>
                <div className="stats_card orders">
                    <div className="card_icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card_content">
                        <h3>Tổng đơn hàng</h3>
                        <p className="stats_value">{statistics.tong_don_hang || 0}</p>
                    </div>
                </div>
                <div className="stats_card avg_order">
                    <div className="card_icon">
                        <i className="fas fa-receipt"></i>
                    </div>
                    <div className="card_content">
                        <h3>Giá trị trung bình/đơn</h3>
                        <p className="stats_value">
                            {statistics.tong_don_hang > 0
                                ? Number(statistics.tong_doanh_thu / statistics.tong_don_hang).toLocaleString("vi-VN")
                                : 0} đ
                        </p>
                    </div>
                </div>
                <div className="stats_card daily_avg">
                    <div className="card_icon">
                        <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="card_content">
                        <h3>Doanh thu TB/ngày</h3>
                        <p className="stats_value">
                            {statistics.doanh_thu_theo_ngay && statistics.doanh_thu_theo_ngay.length > 0
                                ? Number(statistics.tong_doanh_thu / statistics.doanh_thu_theo_ngay.length).toLocaleString("vi-VN")
                                : 0} đ
                        </p>
                    </div>
                </div>
            </div>
            <div className="statistics_panels">
                <div className="chart_panel">
                    <h3 className="panel_title">Doanh thu theo ngày</h3>
                    <div className="chart_container">
                        <Line
                            key={`${selectedMonth}-${selectedYear}`}
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                </div>
                <div className="bestsellers_panel">
                    <h3 className="panel_title">Sản phẩm bán chạy nhất</h3>
                    {(statistics?.san_pham_ban_chay || []).length > 0 ? (
                        <div className="bestsellers_list">
                            {statistics.san_pham_ban_chay.map((product, index) => (
                                <div key={index} className="bestseller_item">
                                    <div className="bestseller_rank">{index + 1}</div>
                                    <div className="bestseller_info">
                                        <div className="bestseller_name">{product.ten_san_pham}</div>
                                        <div className="bestseller_sales">
                                            <span className="sales_count">{product.tong_so_luong}</span>
                                            <span className="sales_label">sản phẩm</span>
                                        </div>
                                    </div>
                                    <div className="bestseller_bar_container">
                                        <div
                                            className="bestseller_bar"
                                            style={{
                                                width: `${(product.tong_so_luong / Math.max(...statistics.san_pham_ban_chay.map((p) => p.tong_so_luong))) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no_data">Không có dữ liệu sản phẩm bán chạy.</p>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div className="loading">
            <div className="loading_spinner"></div>
            <p>Đang tải dữ liệu thống kê...</p>
        </div>
    );
}

export default TotalPaymentStatistics;
