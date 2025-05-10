import React, { useState } from "react";
import "../../style/flysearch.css"; // Tạo file CSS riêng

const FlySearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    alert(
      `Tìm vé máy bay từ ${departure} đến ${destination} vào ngày ${date} cho ${passengers} hành khách.`
    );
  };

  return (
    <div className="flight-booking">
      <div className="form-group">
        <label>Điểm đi:</label>
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="VD: Hà Nội"
        />
      </div>

      <div className="form-group">
        <label>Điểm đến:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="VD: TP. HCM"
        />
      </div>

      <div className="form-group">
        <label>Ngày khởi hành:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Số hành khách:</label>
        <input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          min="1"
        />
      </div>

      <button onClick={handleSearch} className="search-button">
        Tìm chuyến bay
      </button>
    </div>
  );
};

export default FlySearch;
