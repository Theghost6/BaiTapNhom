import React, { useEffect, useState } from "react";
import { hotelsList, getHotelsByDestinationId } from "./khach_San";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/hotels.css"; // Import CSS

const Hotels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotelsToDisplay, setHotelsToDisplay] = useState([]);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  useEffect(() => {
    if (location.state && location.state.destination) {
      const destinationId = location.state.destination.id;
      const filteredHotels = getHotelsByDestinationId(destinationId);
      setHotelsToDisplay(filteredHotels);
    } else {
      setHotelsToDisplay(hotelsList);
    }

    if (location.state?.checkInDate) setCheckInDate(location.state.checkInDate);
    if (location.state?.checkOutDate)
      setCheckOutDate(location.state.checkOutDate);
    if (location.state?.guests) setGuests(location.state.guests);
  }, [location.state]);

  const handleClick = (hotel) => {
    navigate(`/hotel/${hotel.id}`, {
      state: {
        hotel,
        fromDestination: true,
        destinationInfo: location.state?.destination,
        checkInDate,
        checkOutDate,
        guests,
      },
    });
  };

  return (
    <div className="hotels-container">
      <h1 className="hotels-title">Danh sách khách sạn</h1>
      {location.state?.destination && (
        <p className="hotels-subtitle">
          Khách sạn tại: <strong>{location.state.destination.name}</strong>
        </p>
      )}

      {hotelsToDisplay.length > 0 ? (
        <div className="hotel-grid">
          {hotelsToDisplay.map((hotel, index) => (
            <div
              key={`${hotel.id}-${index}`}
              className="hotel-card"
              onClick={() => handleClick(hotel)}
            >
              <img
                src={hotel.images[0] || "/default-hotel.jpg"}
                alt={hotel.name}
                className="hotel-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-hotel.jpg";
                }}
              />
              <div className="hotel-info">
                <h2 className="hotel-name">{hotel.name}</h2>
                <p className="hotel-description">{hotel.description}</p>
                <p className="hotel-rating">⭐ {hotel.rating}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">
          Không có khách sạn nào phù hợp với địa điểm này.
        </p>
      )}
    </div>
  );
};

export default Hotels;
