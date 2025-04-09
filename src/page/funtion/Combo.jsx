import React, { useState } from "react";
import "../../style/Combo.css"; // Tạo file CSS riêng

const Combo = () => {
  const [planeTicket, setPlaneTicket] = useState("");
  const [hotelService, setHotelService] = useState("");

  const handleBooking = () => {
    if (planeTicket && hotelService) {
      alert(
        `You have booked a plane ticket to ${planeTicket} and a hotel at ${hotelService}.`
      );
    } else {
      alert("Please select both a plane ticket and a hotel service.");
    }
  };

  return (
    <div>
      <h1>Combo Booking</h1>
      <div>
        <label>
          Plane Ticket:
          <select
            value={planeTicket}
            onChange={(e) => setPlaneTicket(e.target.value)}
          >
            <option value="">Select Destination</option>
            <option value="New York">New York</option>
            <option value="Paris">Paris</option>
            <option value="Tokyo">Tokyo</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Hotel Service:
          <select
            value={hotelService}
            onChange={(e) => setHotelService(e.target.value)}
          >
            <option value="">Select Hotel</option>
            <option value="Hotel A">Hotel A</option>
            <option value="Hotel B">Hotel B</option>
            <option value="Hotel C">Hotel C</option>
          </select>
        </label>
      </div>
      <button onClick={handleBooking}>Book Combo</button>
    </div>
  );
};

export default Combo;
