import React, { useState } from "react";
import "../../style/ImageSlider.css"; // Adjust the path as necessary

const ImageSlider = ({ images = [], address }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="custom-image-slider">
      <h3>🖼️ Hình ảnh nổi bật</h3>
      <div className="slider-frame">
        <img
          src={images[currentIndex]}
          alt={`Ảnh ${currentIndex + 1}`}
          className="slider-img"
        />
        <button className="slider-btn left" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="slider-btn right" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
      <p className="slider-address">{address}</p>
    </div>
  );
};

export default ImageSlider;
