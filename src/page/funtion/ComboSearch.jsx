import React, { useState } from "react";
import "../../style/combosearch.css";

const ComboSearch = () => {
  const [selectedComboType, setSelectedComboType] = useState("giatot");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [rooms, setRooms] = useState(1);

  return (
    <div className="combo-search-container">
      {/* Combo Type Selection */}
      <div className="combo-types">
        <button 
          className={`combo-type-btn ${selectedComboType === "giatot" ? "active" : ""}`}
          onClick={() => setSelectedComboType("giatot")}
        >
          <div className="combo-type-icon">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
            </svg>
            <span>+</span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M19,7h-8C9.9,7,9,7.9,9,9v10h12V9C21,7.9,20.1,7,19,7z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M17,15h-2v-2h2V15z M17,11h-2V9h2V11z" />
            </svg>
          </div>
          <span>Combo giá tốt</span>
        </button>
        
        <button 
          className={`combo-type-btn ${selectedComboType === "tuchon" ? "active" : ""}`}
          onClick={() => setSelectedComboType("tuchon")}
        >
          <div className="combo-type-icon">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
            </svg>
            <span>+</span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M19,7h-8C9.9,7,9,7.9,9,9v10h12V9C21,7.9,20.1,7,19,7z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M17,15h-2v-2h2V15z M17,11h-2V9h2V11z" />
            </svg>
          </div>
          <span>Combo tự chọn</span>
        </button>
        
        <button 
          className={`combo-type-btn ${selectedComboType === "xekhachsan" ? "active" : ""}`}
          onClick={() => setSelectedComboType("xekhachsan")}
        >
          <div className="combo-type-icon">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M18.92,6.01C18.72,5.42,18.16,5,17.5,5h-11C5.84,5,5.29,5.42,5.08,6.01L3,12v8c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1 h12v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-8L18.92,6.01z M6.85,7h10.29l1.04,3H5.81L6.85,7z M19,17H5v-5h14V17z" />
            </svg>
            <span>+</span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M19,7h-8C9.9,7,9,7.9,9,9v10h12V9C21,7.9,20.1,7,19,7z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M17,15h-2v-2h2V15z M17,11h-2V9h2V11z" />
            </svg>
          </div>
          <span>Combo Xe - Khách sạn</span>
        </button>
      </div>

      {/* Search Form */}
      {selectedComboType === "tuchon" ? (
        <div className="custom-combo-container">
          {/* Flight Section */}
          <div className="section-container flight-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
                </svg>
              </div>
              <h3 className="section-title">Vé máy bay</h3>
            </div>

            <div className="flight-form-grid">
              {/* From */}
              <div className="search-form-group">
                <label className="search-label">
                  Từ<span className="required">*</span>
                </label>
                <div className="search-input-container">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Thành phố, sân bay" 
                    className="search-input"
                  />
                </div>
              </div>

              {/* To */}
              <div className="search-form-group">
                <label className="search-label">
                  Đến<span className="required">*</span>
                </label>
                <div className="search-input-container">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Thành phố, sân bay" 
                    className="search-input"
                  />
                </div>
              </div>

              {/* Departure - Return Date */}
              <div className="search-form-group">
                <label className="search-label">Ngày đi - Ngày về</label>
                <div className="search-input-container date-range">
                  <input 
                    type="date" 
                    value={departureDate || "T5, 10 tháng 4, 2025"} 
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="search-input date-input"
                  />
                  <span className="date-separator">-</span>
                  <input 
                    type="date" 
                    value={returnDate || "T6, 11 tháng 4, 2025"} 
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="search-input date-input"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="search-form-group">
                <label className="search-label">Số khách</label>
                <div className="search-input-container">
                  <input 
                    type="number" 
                    value={`${passengers} người lớn`}
                    className="search-input"
                    onClick={() => {/* Open passenger selector */}}
                  />
                  <span className="input-dropdown-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Section */}
          <div className="section-container hotel-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M19,7h-8C9.9,7,9,7.9,9,9v10h12V9C21,7.9,20.1,7,19,7z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M17,15h-2v-2h2V15z M17,11h-2V9h2V11z" />
                </svg>
              </div>
              <h3 className="section-title">Khách sạn</h3>
            </div>

            <div className="hotel-form-grid">
              {/* Location */}
              <div className="search-form-group">
                <label className="search-label">
                  Địa điểm<span className="required">*</span>
                </label>
                <div className="search-input-container">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Khách sạn, điểm đến, thành phố..." 
                    className="search-input"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div className="search-form-group">
                <label className="search-label">Nhận phòng</label>
                <div className="search-input-container">
                  <input 
                    type="date" 
                    // value={hotelCheckIn || "T5, 10 tháng 4, 2025"}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    className="search-input"
                  />
                  <span className="input-icon calendar-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M19,4h-1V2h-2v2H8V2H6v2H5C3.89,4,3.01,4.9,3.01,6L3,20c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,20 H5V10h14V20z M19,8H5V6h14V8z M9,14H7v-2h2V14z M13,14h-2v-2h2V14z M17,14h-2v-2h2V14z M9,18H7v-2h2V18z M13,18h-2v-2h2V18z M17,18 h-2v-2h2V18z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Check-out */}
              <div className="search-form-group">
                <label className="search-label">Trả phòng</label>
                <div className="search-input-container">
                  <input 
                    type="date" 
                    // value="T6, 11 tháng 4, 2025"
                    className="search-input"
                  />
                  <span className="input-icon calendar-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M19,4h-1V2h-2v2H8V2H6v2H5C3.89,4,3.01,4.9,3.01,6L3,20c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,20 H5V10h14V20z M19,8H5V6h14V8z M9,14H7v-2h2V14z M13,14h-2v-2h2V14z M17,14h-2v-2h2V14z M9,18H7v-2h2V18z M13,18h-2v-2h2V18z M17,18 h-2v-2h2V18z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Rooms */}
              <div className="search-form-group">
                <label className="search-label">Phòng</label>
                <div className="search-input-container">
                  <input 
                    type="number" 
                    value={`${rooms} phòng`}
                    className="search-input"
                    onClick={() => {/* Open room selector */}}
                  />
                  <span className="input-dropdown-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search button */}
          <button className="combo-search-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M15.5,14h-0.79l-0.28-0.27C15.41,12.59,16,11.11,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5S5.91,16,9.5,16 c1.61,0,3.09-0.59,4.23-1.57L14,14.71v0.79l5,4.99L20.49,19L15.5,14z M9.5,14C7.01,14,5,11.99,5,9.5S7.01,5,9.5,5S14,7.01,14,9.5 S11.99,14,9.5,14z" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="combo-search-form">
          <div className="search-form-grid">
            {/* From */}
            <div className="search-form-group">
              <label className="search-label">
                Từ<span className="required">*</span>
              </label>
              <div className="search-input-container">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Thành phố, sân bay" 
                  className="search-input"
                />
              </div>
            </div>

            {/* To */}
            <div className="search-form-group">
              <label className="search-label">Đến</label>
              <div className="search-input-container">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Thành phố, sân bay" 
                  className="search-input"
                />
              </div>
            </div>

            {/* Date */}
            <div className="search-form-group">
              <label className="search-label">Ngày đi</label>
              <div className="search-input-container">
                <input 
                  type="date" 
                  className="search-input"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="search-form-group">
              <label className="search-label">Số khách</label>
              <div className="search-input-container">
                <input 
                  type="number" 
                  defaultValue={1}
                  className="search-input"
                />
                <span className="input-dropdown-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Search button */}
          <button className="combo-search-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M15.5,14h-0.79l-0.28-0.27C15.41,12.59,16,11.11,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5S5.91,16,9.5,16 c1.61,0,3.09-0.59,4.23-1.57L14,14.71v0.79l5,4.99L20.49,19L15.5,14z M9.5,14C7.01,14,5,11.99,5,9.5S7.01,5,9.5,5S14,7.01,14,9.5 S11.99,14,9.5,14z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ComboSearch;
