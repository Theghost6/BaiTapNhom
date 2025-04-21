import React, { useEffect, useState } from "react";
import { hotelsList, getHotelsByDestinationId } from "./khach_San";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../../style/hotels.css"; // Import CSS
import DiaDiem from "./Dia_Diem";

const Hotels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotelsToDisplay, setHotelsToDisplay] = useState([]);
  const { id } = useParams();
  const destination = DiaDiem.find((dest) => dest.id === parseInt(id));


  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  useEffect(() => {
    // Kiểm tra xem có dữ liệu destination được truyền qua không
    if (location.state && location.state.destination) {
      const destinationId = location.state.destination.id;
      // Lấy danh sách khách sạn theo ID địa điểm
      const filteredHotels = getHotelsByDestinationId(destinationId);
      setHotelsToDisplay(filteredHotels);
    } else {
      // Nếu không có, hiển thị tất cả khách sạn
      setHotelsToDisplay(hotelsList);
    }
  }, [location.state]);
  const handleClick = () => {
     let processedPrice = destination.price;
    if (typeof processedPrice === "string") {
      processedPrice = parseFloat(processedPrice.replace(/[^\d]/g, ""));
    }
    // Tìm khách sạn tương ứng với địa điểm
    const matchedHotel = hotelsList.find((h) => h.id === destination.id);

    if (matchedHotel) {
      // Chuyển sang trang chi tiết khách sạn và truyền đầy đủ dữ liệu
      navigate(`/hotel/${matchedHotel.id}`, {
        state: {
          hotel: matchedHotel,
          fromDestination: true,
          destinationInfo: {
            id: destination.id,
            name: destination.name,
            description: destination.description,
            price: destination.price,
            image: destination.image,
            location: destination.location,
            tag: destination.tag,
            duration: destination.duration,
          },
          checkInDate,
          checkOutDate,
          guests,
        },
      });
    } else {
      // Nếu không có khách sạn khớp, chuyển thẳng sang checkout
      navigate("/checkout", {
        state: {
          destination: {
            id: destination.id,
            name: destination.name,
            description: destination.description,
            price: destination.price,
            image: destination.image,
            location: destination.location,
          },
          checkInDate,
          checkOutDate,
          guests,
        },
      });
    }

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
        <p className="text-center text-gray-600 mt-6">Không có khách sạn nào phù hợp với địa điểm này.</p>
      )}
    </div>
  );
};

export default Hotels;

