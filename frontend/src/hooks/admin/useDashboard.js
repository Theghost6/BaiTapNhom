import { useEffect, useState, useMemo } from "react";
import axios from "axios";

/**
 * useDashboard - Custom hook cho dashboard admin
 *
 * @param {string} apiUrl - Đường dẫn API backend
 * @param {number} month - Tháng cần thống kê
 * @param {number} year - Năm cần thống kê
 * @param {Array} orders - Danh sách đơn hàng (nên truyền từ hook useOrders để tránh lặp request)
 * @param {Array} users - Danh sách người dùng (nên truyền từ hook useUsers để tránh lặp request)
 * @param {Array} reviews - Danh sách đánh giá (nên truyền từ hook useReviews để tránh lặp request)
 *
 * @returns {Object} Đầy đủ dữ liệu và logic dashboard: thống kê, phần trăm, dữ liệu chart, options chart...
 *
 * Lưu ý: Nên truyền orders, users, reviews từ ngoài vào để tránh fetch lại dữ liệu đã có.
 */

// Gợi ý icon cho từng chart (đặt ngoài hàm, đúng chuẩn export)
export const chartIcons = {
    revenue: "💰",
    orders: "🛒",
    users: "👤",
    reviews: "⭐",
};

export default function useDashboard(apiUrl, month, year, orders, users, reviews) {
    const [dashboardMetrics, setDashboardMetrics] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch dashboard metrics và statistics (dữ liệu tổng hợp, không lặp lại orders/users/reviews)
    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get(`${apiUrl}/api.php?action=get_dashboard_metrics`),
            axios.get(`${apiUrl}/api.php?action=get_statistics&month=${month}&year=${year}`),
        ])
            .then(([metricsRes, statsRes]) => {
                setDashboardMetrics(metricsRes.data);
                setStatistics(statsRes.data);
            })
            .catch((error) => {
                console.error('Dashboard API Error:', error);
                setDashboardMetrics(null);
                setStatistics(null);
            })
            .finally(() => setLoading(false));
    }, [apiUrl, month, year]);

    // Logic dashboard
    const targetRevenue = 100000000;
    const revenuePercentage = useMemo(() => {
        return statistics?.tong_doanh_thu
            ? (statistics.tong_doanh_thu / targetRevenue) * 100
            : 0;
    }, [statistics]);

    const completedOrders = useMemo(() => {
        return statistics?.tong_thanh_toan ||
            statistics?.completed_orders ||
            (orders ? orders.filter(o => o.trang_thai === 'completed' || o.status === 'completed' || o.trang_thai === 'Đã thanh toán').length : 0) ||
            0;
    }, [statistics, orders]);

    const orderCompletionPercentage = useMemo(() => {
        const totalOrders = statistics?.tong_don_hang || (orders ? orders.length : 0) || 0;
        return totalOrders ? (completedOrders / totalOrders) * 100 : 0;
    }, [statistics, completedOrders, orders]);

    const activeUsers = useMemo(() => {
        // Tính số người dùng hoạt động (tài khoản chưa bị khóa - is_active = 1)
        return statistics?.nguoi_dung_hoat_dong ||
            statistics?.active_users ||
            (users ? users.filter(u => u.is_active === 1 || u.is_active === '1' || u.is_active === true).length : 0) ||
            0;
    }, [statistics, users]);

    const userActivePercentage = useMemo(() => {
        const totalUsers = statistics?.tong_nguoi_dung || (users ? users.length : 0) || 0;
        return totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    }, [statistics, activeUsers, users]);

    const positiveReviews = useMemo(() => {
        // Thử nhiều cách để lấy số đánh giá tích cực
        return statistics?.danh_gia_tich_cuc ||
            statistics?.positive_reviews ||
            (reviews ? reviews.filter(r => (r.rating || r.danh_gia || r.diem) >= 3).length : 0) ||
            0;
    }, [statistics, reviews]);

    const positiveReviewPercentage = useMemo(() => {
        const totalReviews = statistics?.tong_danh_gia || (reviews ? reviews.length : 0) || 0;
        return totalReviews === 0 ? 0 : (positiveReviews / totalReviews) * 100;
    }, [statistics, positiveReviews, reviews]);

    // Chart data cho dashboard (4 chart)
    // Không cần export chartIcons ở đây nữa, chỉ dùng biến chartIcons nếu cần
    // Doanh thu: Line chart
    const chartDataRevenue = useMemo(() => {
        let days = statistics?.doanh_thu_theo_ngay?.map((d) => String(d.ngay)) || [];
        let values = statistics?.doanh_thu_theo_ngay?.map((d) => (typeof d.tong_doanh_thu === 'number' ? d.tong_doanh_thu : Number(d.tong_doanh_thu) || 0)) || [];
        if (!days.length) {
            days = [];
            values = [];
        }
        const data = {
            labels: days,
            datasets: [
                {
                    label: "Doanh thu (VNĐ)",
                    data: values,
                    borderColor: "#36a2eb",
                    backgroundColor: "rgba(54,162,235,0.3)",
                    fill: true,
                    tension: 0.4,
                },
            ],
            type: 'line',
        };
        return data;
    }, [statistics]);

    // Đơn hàng: Bar chart
    const chartDataOrders = useMemo(() => {
        let days = statistics?.don_hang_theo_ngay?.map((d) => String(d.ngay)) || [];
        let values = statistics?.don_hang_theo_ngay?.map((d) => (typeof d.tong_don_hang === 'number' ? d.tong_don_hang : Number(d.tong_don_hang) || 0)) || [];
        if (!days.length) {
            days = [];
            values = [];
        }
        const data = {
            labels: days,
            datasets: [
                {
                    label: "Đơn hàng",
                    data: values,
                    borderColor: "#00bcd4",
                    backgroundColor: "rgba(0,188,212,0.3)",
                    fill: true,
                },
            ],
            type: 'bar',
        };
        return data;
    }, [statistics]);

    // Người dùng: Radar chart
    const chartDataUsers = useMemo(() => {
        let days = statistics?.nguoi_dung_theo_ngay?.map((d) => String(d.ngay)) || [];
        let values = statistics?.nguoi_dung_theo_ngay?.map((d) => (typeof d.tong_nguoi_dung === 'number' ? d.tong_nguoi_dung : Number(d.tong_nguoi_dung) || 0)) || [];
        if (!days.length) {
            days = [];
            values = [];
        }
        const data = {
            labels: days,
            datasets: [
                {
                    label: "Người dùng hoạt động",
                    data: values,
                    borderColor: "#ffcd56",
                    backgroundColor: "rgba(255,205,86,0.3)",
                    pointBackgroundColor: "#ffcd56",
                    pointBorderColor: "#fff",
                },
            ],
            type: 'radar',
        };
        return data;
    }, [statistics]);

    // Đánh giá: Doughnut chart
    const chartDataReviews = useMemo(() => {
        let days = statistics?.danh_gia_theo_ngay?.map((d) => String(d.ngay)) || [];
        let values = statistics?.danh_gia_theo_ngay?.map((d) => (typeof d.tong_danh_gia === 'number' ? d.tong_danh_gia : Number(d.tong_danh_gia) || 0)) || [];
        if (!days.length) {
            days = [];
            values = [];
        }
        const data = {
            labels: days,
            datasets: [
                {
                    label: "Đánh giá",
                    data: values,
                    backgroundColor: [
                        "rgba(255,99,132,0.6)",
                        "rgba(255,205,86,0.6)",
                        "rgba(54,162,235,0.6)",
                        "rgba(75,192,192,0.6)",
                        "rgba(153,102,255,0.6)",
                        "rgba(255,159,64,0.6)"
                    ],
                    borderColor: "#fff",
                    borderWidth: 2,
                },
            ],
            type: 'doughnut',
        };
        return data;
    }, [statistics]);

    // Chart options factory (thêm icon vào title nếu có)
    const chartOptions = (title, icon) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: icon ? `${icon} ${title}` : title,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Giá trị",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Ngày",
                },
            },
        },
    });

    // For total_payment page
    const chartData = useMemo(() => {
        const days = statistics?.doanh_thu_theo_ngay?.map((d) => d.ngay) || [];
        const values = statistics?.doanh_thu_theo_ngay?.map((d) => d.tong_doanh_thu) || [];
        return {
            labels: days,
            datasets: [
                {
                    label: "Doanh thu (VNĐ)",
                    data: values,
                    borderColor: "#36a2eb",
                    backgroundColor: "rgba(54,162,235,0.2)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    }, [statistics]);

    return {
        dashboardMetrics,
        statistics,
        loading,
        revenuePercentage,
        orderCompletionPercentage,
        userActivePercentage,
        positiveReviewPercentage,
        chartDataRevenue,
        chartDataOrders,
        chartDataUsers,
        chartDataReviews,
        chartOptions, // giờ nhận thêm icon nếu muốn
        chartData,
        chartIcons, // export để dùng ngoài component
    };
}
