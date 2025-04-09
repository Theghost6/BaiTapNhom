import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import Dia_Diem from "./Dia_Diem";
import "../../style/all_dia_diem.css";

const AllDiaDiem = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 6; // Số điểm đến trên mỗi trang

  // Tính toán chỉ số bắt đầu và kết thúc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Dia_Diem.slice(indexOfFirstItem, indexOfLastItem);

  // Tính tổng số trang
  const totalPages = Math.ceil(Dia_Diem.length / itemsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="all-dia-diem-container">
      <h1 className="page-title">Tất cả điểm đến</h1>
      <p className="page-subtitle">Khám phá những điểm đến hấp dẫn nhất</p>

      <div className="destinations-grid">
        {currentItems.map((dest) => (
          <div key={dest.id} className="destination-card">
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
                  onClick={() => navigate(`/Dia-Diem/${dest.id}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default AllDiaDiem;
