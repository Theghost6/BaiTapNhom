import React from "react";

const HotelSearch = () => {
  return (
    <div className="search-panel">
      <div className="search-row">
        {/* Location */}
        <div className="search-field location-field">
          <label>
            Địa điểm<span className="required">*</span>
          </label>
          <input type="text" placeholder="Khách sạn, điểm đến, thành phố" />
        </div>

        {/* Check-in date - changed to input field */}
        <div className="search-field date-field">
          <label>Nhận phòng</label>
          <div className="date-picker">
            <input type="date" placeholder="Chọn ngày nhận phòng" />
          </div>
        </div>

        {/* Check-out date - changed to input field */}
        <div className="search-field date-field">
          <label>Trả phòng</label>
          <div className="date-picker">
            <input type="date" placeholder="Chọn ngày trả phòng" />
          </div>
        </div>

        {/* Guest info - changed to input field */}
        <div className="search-field guest-field">
          <label>Số khách</label>
          <div className="guest-picker">
            <input type="number" placeholder="Số phòng, số khách" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
