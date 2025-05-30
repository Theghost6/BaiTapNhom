import React, { useState } from "react";
import "../../style/developer.css";
import { FaUsers } from "react-icons/fa";

const developers = [
  {
    name: "Đỗ Hoàng Tùng",
    role: "Developer",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "/photos/tung.jpg",
    borderColor: "black"
  },
  {
    name: "Nguyễn Trường Sinh",
    role: "Project Manager",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/meme-meo-4.jpg",
    borderColor: "black"
  },
  {
    name: "Nguyễn Thị Ngát",
    role: "Data Analyst",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "photos/IMG_9373.JPG",
    borderColor: "black"
  },
  {
    name: "Lương Tuyết Nhi",
    role: "Designer",
    description: "There are many variations of passages but the majority have suffered alteration in some form by injected.",
    image: "photos/IMG_9374.JPG",
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
