import React, { useState, useEffect, useRef } from 'react';
import { LuHeartHandshake } from "react-icons/lu";

const SimpleThankYou = () => {
  const canvasRef = useRef(null);
  const mouseHeartCanvasRef = useRef(null);
  const messageRef = useRef(null);
  const [showMessage, setShowMessage] = useState(true);
  const [showHearts, setShowHearts] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orderInfo] = useState({
    deliveryDate: (() => {
      const today = new Date();
      const startDate = new Date(today);
      const endDate = new Date(today);
      startDate.setDate(today.getDate() + 4);
      endDate.setDate(today.getDate() + 5);
      return `từ ngày ${startDate.getDate()}/${startDate.getMonth() + 1} đến ngày ${endDate.getDate() + 1}/${endDate.getMonth() + 1}`;
    })()
  });

  // Ẩn header/footer khi component mount
  useEffect(() => {
    // Ẩn body scroll
    document.body.style.overflow = 'hidden';

    // Thử ẩn các element thường dùng cho header/footer
    const elementsToHide = [
      'header',
      'nav',
      'footer',
      '.header',
      '.footer',
      '.navbar',
      '#header',
      '#footer',
      '#navbar'
    ];

    const hiddenElements = [];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.style.display !== 'none') {
          hiddenElements.push({
            element: el,
            originalDisplay: el.style.display
          });
          el.style.display = 'none';
        }
      });
    });

    // Cleanup function
    return () => {
      // Khôi phục body scroll
      document.body.style.overflow = 'auto';

      // Khôi phục các element đã ẩn
      hiddenElements.forEach(({ element, originalDisplay }) => {
        element.style.display = originalDisplay;
      });
    };
  }, []);

  // Vẽ trái tim với nhịp đập theo chuột
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Không cần trái tim lớn nữa
  }, [showHearts]);

  return (
    <>
      <style>{`
        .thank-you-container {
          animation: float 6s ease-in-out infinite, popIn 0.5s ease-out;
          box-shadow: 
            0 10px 30px rgba(255, 100, 150, 0.4),
            0 0 50px rgba(255, 100, 150, 0.3) inset;
        }
        
        @keyframes popIn {
          0% { transform: scale(0.1); opacity: 0; }
          70% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .pop-up-text {
          animation: popUp 1s forwards;
          opacity: 0;
          transform: scale(0.7);
          text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .pop-up-delay-2 {
          animation: popUp 1s 1s forwards;
          opacity: 0;
          transform: scale(0.7);
        }
        
        @keyframes popUp {
          0% { opacity: 0; transform: scale(0.7); }
          70% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .slide-in-text {
          animation: slideIn 1s ease-out forwards;
          transform: translateY(20px);
          opacity: 0;
        }
        
        @keyframes slideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .bounce-in-button {
          animation: bounceIn 1.5s 1.5s forwards;
          opacity: 0;
          transform: scale(0.5);
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.1); }
          80% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Layout fullscreen giữa trang */
        .fullscreen-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 50%, #fdf2f8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Trái tim theo chuột với nhịp đập */
        .mouse-heart {
          position: fixed;
          pointer-events: none;
          z-index: 10000;
          font-size: 35px;
          color: #e11d48;
          transform: translate(-50%, -50%);
          transition: left 0.1s ease-out, top 0.1s ease-out;
          animation: heartbeat 1.2s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(225, 29, 72, 0.8));
        }

        @keyframes heartbeat {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            filter: drop-shadow(0 0 10px rgba(225, 29, 72, 0.8));
          }
          14% { 
            transform: translate(-50%, -50%) scale(1.3) rotate(5deg);
            filter: drop-shadow(0 0 20px rgba(225, 29, 72, 1));
          }
          28% { 
            transform: translate(-50%, -50%) scale(1) rotate(-2deg);
            filter: drop-shadow(0 0 10px rgba(225, 29, 72, 0.8));
          }
          42% { 
            transform: translate(-50%, -50%) scale(1.3) rotate(-5deg);
            filter: drop-shadow(0 0 20px rgba(225, 29, 72, 1));
          }
          70% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            filter: drop-shadow(0 0 10px rgba(225, 29, 72, 0.8));
          }
        }

      `}</style>

      <div className="fullscreen-overlay">
        {/* Trái tim với nhịp đập theo chuột */}
        <div
          className="mouse-heart"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        >
          <LuHeartHandshake />
        </div>

        {/* Lời cảm ơn ở giữa trang */}
        <div className="thank-you-container bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md mx-4 text-center relative">
          <div className="text-5xl mb-6">💝</div>

          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-500 to-pink-500 mb-6 pop-up-text">
            Cảm ơn bạn đã đặt hàng!
          </h1>

          <div className="my-6 py-4 border-t border-b border-rose-200 slide-in-text">
            <p className="text-rose-500 text-lg pop-up-delay-2">
              <span className="font-semibold text-rose-600">Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất!</span>
            </p>
          </div>

          <div className="mt-6 bounce-in-button">
            <a
              href="/alllinhkien"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-300 transform hover:-translate-y-1 text-lg"
            >
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleThankYou;
