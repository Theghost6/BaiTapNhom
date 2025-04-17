import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import Dia_Diem from "./Dia_Diem";
import "../../style/all_dia_diem.css";
const AllDiaDiem = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Bộ lọc
  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const [selectedTransport, setSelectedTransport] = useState("Tất cả");
  const [selectedDeparture, setSelectedDeparture] = useState("Tất cả");
  const [selectedDestination, setSelectedDestination] = useState("Tất cả");
  const [selectedRating, setSelectedRating] = useState("Tất cả");
  const [selectedBudget, setSelectedBudget] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const tags = ["Tất cả", ...new Set(Dia_Diem.flatMap((dest) => dest.tag))];
  const transports = ["Tất cả", ...new Set(Dia_Diem.map((d) => d.transport))];
  const departures = ["Tất cả", ...new Set(Dia_Diem.map((d) => d.departure))];
  const destinations = [
    "Tất cả",
    ...new Set(Dia_Diem.map((d) => d.destination)),
  ];
  const ratings = ["Tất cả", 5, 4, 3, 2, 1];
  const budgets = ["Tất cả", "Dưới 2 triệu", "2-5 triệu", "Trên 5 triệu"];

  const filteredItems = Dia_Diem.filter((dest) => {
    const priceNumber = parseInt(dest.price.replace(/,/g, ""), 10); // "2,000,000" => 2000000

    const matchesSearchTerm =
      !searchTerm || dest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      selectedTag === "Tất cả" || dest.tag.includes(selectedTag);

    const matchesTransport =
      selectedTransport === "Tất cả" || dest.transport === selectedTransport;

    const matchesDeparture =
      selectedDeparture === "Tất cả" || dest.departure === selectedDeparture;

    const matchesDestination =
      selectedDestination === "Tất cả" ||
      dest.destination === selectedDestination;

    const matchesRating =
      selectedRating === "Tất cả" ||
      (dest.rating >= parseInt(selectedRating) &&
        dest.rating < parseInt(selectedRating) + 1);

    const matchesBudget =
      selectedBudget === "Tất cả" ||
      (selectedBudget === "Dưới 2 triệu" && priceNumber < 2000000) ||
      (selectedBudget === "2-5 triệu" &&
        priceNumber >= 2000000 &&
        priceNumber <= 5000000) ||
      (selectedBudget === "Trên 5 triệu" && priceNumber > 5000000);

    return (
      matchesSearchTerm &&
      matchesTag &&
      matchesTransport &&
      matchesDeparture &&
      matchesDestination &&
      matchesRating &&
      matchesBudget
    );
  });

  // Phân trang sau khi lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="all-dia-diem-container">
      <div className="hero-banner">
        <img
          src="https://transviet.com.vn/Media/Uploads/avatar/Cover/vietnam.webp"
          alt="Background"
          className="hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">Tất cả điểm đến</h1>
          <p className="hero-subtitle">Khám phá những điểm đến hấp dẫn nhất</p>
        </div>
      </div>
      {/* Thanh tìm kiếm*/}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-bar">
        <select
          value={selectedTag}
          onChange={(e) => {
            setSelectedTag(e.target.value);
            setCurrentPage(1);
          }}
          className="tag-select"
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          value={selectedTransport}
          onChange={(e) => {
            setSelectedTransport(e.target.value);
            setCurrentPage(1);
          }}
          className="tag-select"
        >
          {transports.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={selectedDeparture}
          onChange={(e) => {
            setSelectedDeparture(e.target.value);
            setCurrentPage(1);
          }}
          className="tag-select"
        >
          {departures.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={selectedDestination}
          onChange={(e) => {
            setSelectedDestination(e.target.value);
            setCurrentPage(1);
          }}
          className="tag-select"
        >
          {destinations.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={selectedRating}
          onChange={(e) => {
            setSelectedRating(e.target.value);
            setCurrentPage(1);
          }}
          className="tag-select"
        >
          {ratings.map((r) => (
            <option key={r} value={r}>
              {r === "Tất cả" ? r : `${r} sao`}
            </option>
          ))}
        </select>

        <select
          value={selectedBudget}
          onChange={(e) => {
            setSelectedBudget(e.target.value);
            setCurrentPage(1);
          }}
          className="tag-select"
        >
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

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
                <span className="destination-price">
                  Từ {dest.price.toLocaleString()}/<small>khách</small>
                </span>
                <p className="destination-duration">{dest.duration}</p>

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
