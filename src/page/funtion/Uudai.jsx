import React from "react";
import data from "../funtion/Linh_kien.json"; // Verify path
import "../../style/uudai.css";

const UuDai = () => {
  // Flatten all category arrays into a single array of products
  const slides = Object.values(data).flat();

  // Debug data
  console.log("Slides:", slides);

  // Fallback for empty data
  if (!slides.length) {
    return <div>Không có dữ liệu để hiển thị</div>;
  }

  return (
    <div className="uudai-container">
      {slides.map((item, index) => (
        <div key={index} className="uudai-box">
          <h3>{item.ten || "Tên không có"}</h3>
          <p>{item.khuyen_mai || "Không có khuyến mãi"}</p>
        </div>
      ))}
    </div>
  );
};

export default UuDai;