import { useState, useEffect, useCallback, useRef } from 'react';

const useOptimizedSlider = (slides, autoPlayInterval = 4000) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);
    const lastInteractionRef = useRef(Date.now());

    // Debounced slide change để tránh spam
    const changeSlide = useCallback((newIndex) => {
        if (!slides || slides.length === 0) return;

        const now = Date.now();
        if (now - lastInteractionRef.current < 100) return; // Throttle 100ms

        lastInteractionRef.current = now;
        setActiveSlide(newIndex);
        setIsPaused(true);

        // Resume auto-play sau 3 giây
        setTimeout(() => setIsPaused(false), 3000);
    }, [slides]);

    // Next slide function
    const nextSlide = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides]);

    // Previous slide function
    const prevSlide = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides]);

    // Auto-play effect
    useEffect(() => {
        if (!isAutoPlay || isPaused || !slides || slides.length <= 1) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAutoPlay, isPaused, slides, autoPlayInterval, nextSlide]);

    // Pause on hover
    const handleMouseEnter = useCallback(() => {
        setIsPaused(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsPaused(false);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback((event) => {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextSlide();
                break;
            case ' ':
                event.preventDefault();
                setIsAutoPlay(prev => !prev);
                break;
            default:
                break;
        }
    }, [nextSlide, prevSlide]);

    // Touch/swipe handling
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleTouchStart = useCallback((event) => {
        setTouchStart(event.targetTouches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((event) => {
        setTouchEnd(event.targetTouches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setTouchStart(null);
        setTouchEnd(null);
    }, [touchStart, touchEnd, nextSlide, prevSlide]);

    return {
        activeSlide,
        setActiveSlide: changeSlide,
        nextSlide,
        prevSlide,
        isAutoPlay,
        setIsAutoPlay,
        isPaused,
        handleMouseEnter,
        handleMouseLeave,
        handleKeyDown,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
};

export default useOptimizedSlider;
