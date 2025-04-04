import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import Dia_Diem from "./Dia_Diem";
import "../../style/all_dia_diem.css"; // Import CSS cho trang này

const AllDiaDiem = () => {
  const navigate = useNavigate();

  return (
    <div className="all-dia-diem-container">
      <h1 className="page-title">Tất cả điểm đến</h1>
      <p className="page-subtitle">Khám phá những điểm đến hấp dẫn nhất</p>

      <div className="destinations-grid">
        {Dia_Diem.map((dest, idx) => (
          <div key={idx} className="destination-card">
            <div className="destination-image-container">
              <img
                src={dest.image}
                alt={dest.name}
                className="destination-image"
              />
              <div className="destination-rating">
                <Star className="star-icon" />
                <span className="rating-value">{dest.rating}</span>
              </div>
            </div>
            <div className="destination-details">
              <div className="destination-header">
                <MapPin className="location-icon" />
                <h3 className="destination-name">{dest.name}</h3>
              </div>
              <p className="destination-description">{dest.description}</p>
              <div className="destination-footer">
                <span className="destination-price">Từ {dest.price}</span>
                <button
                  className="details-button"
                  onClick={() => navigate(`/dia-diem/${idx}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDiaDiem;

