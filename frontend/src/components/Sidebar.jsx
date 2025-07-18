import React, { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../page/function/AuthContext';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaImage, FaNewspaper, FaHandshake } from 'react-icons/fa';
import '../style/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides a user object
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isPostsOpen, setIsPostsOpen] = useState(true);
  const [isPartnersOpen, setIsPartnersOpen] = useState(true);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <svg className="triangle-icon" viewBox="0 0 24 24">
          {isOpen ? (
            <polygon points="8,4 20,12 8,20" fill="#4dabf7" />
          ) : (
            <polygon points="16,4 4,12 16,20" fill="#4dabf7" />
          )}
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-wrapper"
            initial={{ x: "100%", opacity: 0.8, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: "100%", opacity: 0.8, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="sidebar-content">
              {!user && (
                <div className="sidebar-auth">
                  <Link to="/register" className="auth-button" onClick={toggleSidebar}>
                    Đăng nhập / Đăng ký
                  </Link>
                </div>
              )}
              <div className="sidebar-section">
                <div className="sections-header" onClick={() => setIsImagesOpen(!isImagesOpen)}>
                  <div className="sections-header-content">
                    <FaImage className="section-icon" />
                    <h2>Ảnh</h2>
                  </div>
                  {isImagesOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isImagesOpen && (
                  <motion.div
                    initial={{ x: "100%", opacity: 0.8, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: "100%", opacity: 0.8, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="section-content"
                  >
                    <div className="image-gallery">
                      <img src="./photos/a.jpg" alt="Ảnh 1" className="sidebar-image" />
                      <img src="./photos/b.jpg" alt="Ảnh 2" className="sidebar-image" />
                      <img src="./photos/c.jpg" alt="Ảnh 3" className="sidebar-image" />
                      <img src="./photos/d.jpg" alt="Ảnh 4" className="sidebar-image" />
                      <img src="./photos/e.jpg" alt="Ảnh 5" className="sidebar-image" />
                      <img src="./photos/f.jpg" alt="Ảnh 6" className="sidebar-image" />
                      <img src="./photos/giga.jpg" alt="Ảnh 7" className="sidebar-image" />
                      <img src="./photos/h.jpg" alt="Ảnh 8" className="sidebar-image" />
                      <img src="./photos/i.jpg" alt="Ảnh 9" className="sidebar-image" />
                      <img src="./photos/j.jpg" alt="Ảnh 10" className="sidebar-image" />
                      <img src="./photos/k.jpg" alt="Ảnh 11" className="sidebar-image" />
                      <img src="./photos/l.jpg" alt="Ảnh 12" className="sidebar-image" />
                      <img src="./photos/mini.jpg" alt="Ảnh 13" className="sidebar-image" />
                      <img src="./photos/n.jpg" alt="Ảnh 14" className="sidebar-image" />
                      <img src="./photos/o.jpg" alt="Ảnh 15" className="sidebar-image" />
                      <img src="./photos/sea.jpg" alt="Ảnh 16" className="sidebar-image" />
                      <img src="./photos/w.jpg" alt="Ảnh 17" className="sidebar-image" />
                      <img src="./photos/intel.jpg" alt="Ảnh 18" className="sidebar-image" />
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="sidebar-section">
                <div className="sections-header" onClick={() => setIsPostsOpen(!isPostsOpen)}>
                  <div className="sections-header-content">
                    <FaNewspaper className="section-icon" />
                    <h2>Bài viết nổi bật</h2>
                  </div>
                  {isPostsOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isPostsOpen && (
                  <motion.div
                    initial={{ x: "100%", opacity: 0.8, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: "100%", opacity: 0.8, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="section-content"
                  >
                    <ul className="featured-posts">
                      <li>
                        <a href="/blog" onClick={toggleSidebar}>DDR5 RAM: Bước tiến tốc độ trong build PC 2025</a>
                      </li>
                      <li>
                        <a href="/blog" onClick={toggleSidebar}>Top 5 phần mềm tối ưu hệ thống Windows không thể thiếu</a>
                      </li>
                      <li>
                        <a href="/blog" onClick={toggleSidebar}>Build PC chơi game 2K với RTX 4070 Super: Cân mọi tựa game 2025</a>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>
              <div className="sidebar-section">
                <div className="sections-header" onClick={() => setIsPartnersOpen(!isPartnersOpen)}>
                  <div className="sections-header-content">
                    <FaHandshake className="section-icon" />
                    <h2>Đối tác (Quảng cáo)</h2>
                  </div>
                  {isPartnersOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isPartnersOpen && (
                  <motion.div
                    initial={{ x: "100%", opacity: 0.8, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: "100%", opacity: 0.8, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="section-content"
                  >
                    <div className="partners">
                      <a href="https://www.intel.com" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/Intel-c.jpg" alt="Intel" className="partner-logo" />
                        <span className="partner-name">Intel</span>
                      </a>
                      <a href="https://www.nvidia.com" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/nvidia-c.jpg" alt="NVIDIA" className="partner-logo" />
                        <span className="partner-name">NVIDIA</span>
                      </a>
                      <a href="https://www.asus.com" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/asus-c.jpg" alt="ASUS" className="partner-logo" />
                        <span className="partner-name">ASUS</span>
                      </a>
                      <a href="https://www.corsair.com" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/corsair-c.jpg" alt="Corsair" className="partner-logo" />
                        <span className="partner-name">Corsair</span>
                      </a>
                      <a href="https://www.seagate.com" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/seagate-c.webp" alt="Seagate" className="partner-logo" />
                        <span className="partner-name">Seagate</span>
                      </a>
                      <a href="https://www.shopee.vn" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/shopee-c.webp" alt="Shopee" className="partner-logo" />
                        <span className="partner-name">Shopee</span>
                      </a>
                      <a href="https://cellphones.com.vn" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/CellphoneS-c.jpg" alt="CellphoneS" className="partner-logo" />
                        <span className="partner-name">CellphoneS</span>
                      </a>
                      <a href="https://www.thegioididong.com" target="_blank" rel="noopener noreferrer" className="partner-item">
                        <img src="./photos/thegioididong.jpg" alt="MobileWorld" className="partner-logo" />
                        <span className="partner-name">Thế giới di động</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
              <button className="close-button" onClick={toggleSidebar}>Đóng</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;