import React, { useState } from "react";
import "../../style/TabMenu.css";

const tabs = ["Overview", "Tour plan", "Location", "Reviews"];

const TabMenu = ({ onChange }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onChange(tab); // gửi dữ liệu lên parent nếu cần
  };

  return (
    <div className="tab-menu">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? "active" : ""}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
          {activeTab === tab && <span className="tab-arrow" />}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
