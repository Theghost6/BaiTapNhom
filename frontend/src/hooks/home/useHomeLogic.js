import { useState, useEffect, useRef } from "react";

export function useHomeLogic(apiUrl) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [showUrl, setShowUrl] = useState(null);
    const [marqueeText, setMarqueeText] = useState(0);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 12,
        minutes: 45,
        seconds: 30,
    });
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/tt_home.php?path=chu_chay`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch messages");
                }
                const data = await response.json();
                if (data.success) {
                    const activeMessages = data.data
                        .filter((msg) => msg.trang_thai === "1" || msg.trang_thai === 1)
                        .map((msg) => ({
                            ...msg,
                            toc_do: parseFloat(msg.toc_do) || 15,
                        }));
                    setMessages(activeMessages);
                } else {
                    throw new Error(data.error || "API error");
                }
            } catch (err) {
                setError(err.message);
                setMessages([
                    {
                        noi_dung:
                            "🔥 Flash Sale: Giảm đến 30% cho tất cả linh kiện PC! Nhanh tay đặt hàng ngay hôm nay! 🔥",
                        toc_do: 15,
                        trang_thai: 1,
                    },
                    {
                        noi_dung: "🎁 Mua combo linh kiện, nhận quà tặng đặc biệt!",
                        toc_do: 15,
                        trang_thai: 1,
                    },
                    {
                        noi_dung: "🚚 Miễn phí vận chuyển cho đơn hàng trên 5 triệu!",
                        toc_do: 15,
                        trang_thai: 1,
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [apiUrl]);

    useEffect(() => {
        if (messages.length === 0 || loading || error) return;
        const interval = setInterval(() => {
            setMarqueeText((prev) => (prev + 1) % messages.length);
        }, (messages[marqueeText]?.toc_do * 1000 || 15000) - 900);
        return () => clearInterval(interval);
    }, [messages, marqueeText, loading, error]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const { days, hours, minutes, seconds } = prev;
                if (seconds > 0) return { ...prev, seconds: seconds - 1 };
                if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
                if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
                if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1));
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return {
        activeSlide,
        setActiveSlide,
        showUrl,
        setShowUrl,
        marqueeText,
        setMarqueeText,
        messages,
        loading,
        error,
        timeLeft,
        prevRef,
        nextRef,
    };
}
