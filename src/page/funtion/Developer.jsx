import React, { useState } from "react";
import "../../style/developer.css";
import { FaUsers } from "react-icons/fa";

const developers = [
  {
    name: "Đỗ Hoàng Tùng",
    role: "Developer",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "https://i.pinimg.com/736x/9c/75/7d/9c757ddd8aaa525c6e8f6eb1ec30157b.jpg",
    borderColor: "black"
  },
  {
    name: "Nguyễn Trường Sinh",
    role: "Project Manager",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "https://i.pinimg.com/736x/aa/0b/29/aa0b29596cdf5f154d416156a615036a.jpg",
    borderColor: "black"
  },
  {
    name: "Nguyễn Thị Ngát",
    role: "Data Analyst",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "https://i.pinimg.com/736x/49/79/42/49794284a4d5095fc99d5543753b5de7.jpg",
    borderColor: "black"
  },
  {
    name: "Lương Tuyết Nhi",
    role: "Designer",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "https://i.pinimg.com/736x/d7/b5/ce/d7b5cef4d6dc42fcf36fb1d31188a05a.jpg",
    borderColor: "black"
  }
];

const Developer = () => {
  return (
    <div className="developer-page">
      <h2 className="developer-title">Thành viên nhóm 12</h2>
      <p className="developer-subtitle">
        <FaUsers className="subtitle-icon" />
        Our Great Team</p>
      <div className="developer-list">
        {developers.map((dev, index) => (
          <div className="developer-card" key={index} style={{ borderColor: dev.borderColor }}>
            <img src={dev.image} alt={dev.name} className="developer-img" />
            <h3 className="developer-name">{dev.name}</h3>
            <p className="developer-role">{dev.role}</p>
            <p className="developer-description">{dev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Developer;
