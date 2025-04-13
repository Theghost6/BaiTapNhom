import React, { useState, useEffect } from "react";
import "../../style/ImageSlider.css"; // Adjust the path as necessary

const ImageSlider = ({ images = [], address }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Chuyển ảnh tự động sau 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(
        currentIndex === 0 ? images.length - 1 : currentIndex - 1
      );
      setFade(true);
    }, 100);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
      setFade(true);
    }, 100);
  };

  return (
    <div className="custom-image-slider">
      <h3>🖼️ Hình ảnh nổi bật</h3>
      <div className="slider-frame">
        <img
          src={images[currentIndex]}
          alt={`Ảnh ${currentIndex + 1}`}
          className={`slider-img ${fade ? "fade-in" : "fade-out"}`}
        />
        <button className="slider-btn left" onClick={handlePrev}>
          &#10094;
        </button>
        <button className="slider-btn right" onClick={handleNext}>
          &#10095;
        </button>
      </div>
      <p className="slider-address">{address}</p>
    </div>
  );
};

export default ImageSlider;
