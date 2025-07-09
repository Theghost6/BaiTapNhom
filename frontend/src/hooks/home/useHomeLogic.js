import { useState, useEffect, useRef } from "react";

export function useHomeLogic(apiUrl) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [showUrl, setShowUrl] = useState(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 12,
        minutes: 45,
        seconds: 30,
    });
    const prevRef = useRef(null);
    const nextRef = useRef(null);

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
        timeLeft,
        prevRef,
        nextRef,
    };
}
