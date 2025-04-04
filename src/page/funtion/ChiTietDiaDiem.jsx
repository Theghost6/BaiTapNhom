import React from "react";
import { useParams } from "react-router-dom";
import Dia_Diem from "./Dia_Diem"; // Import danh sách địa điểm

const DiaDiemDetail = () => {
  // Lấy id từ URL
  const { id } = useParams();

  // Tìm địa điểm tương ứng với id trong mảng Dia_Diem
  const destination = Dia_Diem.find((dest) => dest.id === parseInt(id));

  // Nếu không tìm thấy địa điểm, hiển thị thông báo lỗi
  if (!destination) {
    return <div>Không tìm thấy địa điểm này.</div>;
  }

  return (
    <div className="destination-detail-container">
      <h1>{destination.name}</h1>
      <img src={destination.image} alt={destination.name} />
      <p>{destination.description}</p>
      <span>{destination.price}</span>
      <div>
        <span>Rating: {destination.rating}</span>
      </div>
    </div>
  );
};

export default DiaDiemDetail;

