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
            .catch(() => {
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

    const completedOrders = useMemo(() => orders.filter((order) => order.trang_thai === "Đã thanh toán").length, [orders]);
    const orderCompletionPercentage = useMemo(() => {
        return orders.length ? (completedOrders / orders.length) * 100 : 0;
    }, [orders, completedOrders]);

    const activeUsers = useMemo(() => users.filter((user) => user.is_active === 1).length, [users]);
    const userActivePercentage = useMemo(() => {
        return users.length > 0 ? (activeUsers / users.length) * 100 : 0;
    }, [users, activeUsers]);

    const positiveReviews = useMemo(() => reviews.filter((review) => review.so_sao >= 3).length, [reviews]);
    const positiveReviewPercentage = useMemo(() => {
        return reviews.length === 0 ? 0 : (positiveReviews / reviews.length) * 100;
    }, [reviews, positiveReviews]);

    // Chart data cho dashboard (4 chart)
    const chartDataRevenue = useMemo(() => {
        let days = statistics?.doanh_thu_theo_ngay?.map((d) => String(d.ngay)) || [];
        let values = statistics?.doanh_thu_theo_ngay?.map((d) => (typeof d.tong_doanh_thu === 'number' ? d.tong_doanh_thu : Number(d.tong_doanh_thu) || 0)) || [];
        // Chỉ set rỗng nếu thực sự không có dữ liệu
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
                    backgroundColor: "rgba(54,162,235,0.2)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
        console.log("[Dashboard] statistics:", statistics);
        console.log("[Dashboard] chartDataRevenue:", data);
        return data;
    }, [statistics]);

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
                    borderColor: "#4bc0c0",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
        console.log("[Dashboard] chartDataOrders:", data);
        return data;
    }, [statistics]);

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
                    backgroundColor: "rgba(255,205,86,0.2)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
        console.log("[Dashboard] chartDataUsers:", data);
        return data;
    }, [statistics]);

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
                    borderColor: "#ff6384",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
        console.log("[Dashboard] chartDataReviews:", data);
        return data;
    }, [statistics]);

    // Chart options factory
    const chartOptions = (title) => ({
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
                text: title,
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
        chartOptions,
        chartData,
    };
}
