import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Zoom } from 'react-awesome-reveal';

const HeroSlider = memo(({
    slides,
    activeSlide,
    setActiveSlide,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    navigate
}) => {
    if (!slides || slides.length === 0) {
        return <div className="hero-slider loading">Loading slides...</div>;
    }

    // Function để chuyển slide tiếp theo khi click vào ảnh
    const handleSlideClick = () => {
        const nextSlide = activeSlide === slides.length - 1 ? 0 : activeSlide + 1;
        setActiveSlide(nextSlide);
    };

    return (
        <Zoom triggerOnce duration={900}>
            <div
                className="hero-slider"
                id="hero-slider"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-label="Hero image slider"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={slides[activeSlide]?.id || activeSlide}
                        className="slide-container"
                        initial={{ opacity: 0, scale: 1.01 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1.0]
                        }}
                    >
                        <div
                            className="slide-background"
                            onClick={handleSlideClick}
                            style={{
                                backgroundImage: `url('${slides[activeSlide]?.image}')`,
                                cursor: 'pointer'
                            }}
                        >
                            <div className="slide-overlay"></div>
                            <motion.div
                                className="slide-content"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                            >
                                <div className="slide-text">
                                    <motion.h1
                                        className="slide-title"
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                    >
                                        {slides[activeSlide]?.title}
                                    </motion.h1>
                                    <motion.p
                                        className="slide-description"
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                    >
                                        {slides[activeSlide]?.description}
                                    </motion.p>
                                    <motion.div
                                        className="slide-buttons"
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                        onClick={(e) => e.stopPropagation()} // Ngăn event bubbling
                                    >
                                        <button
                                            className="primary-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/linh-kien/${slides[activeSlide]?.id}`);
                                            }}
                                        >
                                            Đặt hàng ngay <ArrowRight className="button-icon" />
                                        </button>
                                        <button
                                            className="secondary-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/linh-kien/${slides[activeSlide]?.id}`);
                                            }}
                                        >
                                            Tìm hiểu thêm
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Zoom>
    );
});

HeroSlider.displayName = 'HeroSlider';

export default HeroSlider;
