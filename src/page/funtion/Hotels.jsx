// src/pages/Hotels.jsx
import React from "react";
import { hotelsList } from "./khach_San"; // hoặc nơi bạn lưu
// import { DiaDiem } from "./Dia_Diem"; // hoặc nơi bạn lưu
import { useNavigate } from "react-router-dom";

const Hotels = () => {
  const navigate = useNavigate();

  const handleClick = (hotel) => {
    navigate(`/dia-diem/${hotel.id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách khách sạn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotelsList.map((hotel) => (
          <div
            key={hotel.id}
            className="border rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => handleClick(hotel)}
          >
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p className="text-sm text-gray-600">{hotel.description}</p>
              <p className="mt-1 text-yellow-500">⭐ {hotel.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;

