import React, { useState, useEffect, useRef } from 'react';

const SimpleThankYou = () => {
  const canvasRef = useRef(null);
  const messageRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showHearts, setShowHearts] = useState(true);
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

  useEffect(() => {
    if (!showHearts) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const isDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase()
    );
    
    const mobile = isDevice;
    const koef = mobile ? 0.5 : 1;
    
    const updateCanvasSize = () => {
      canvas.width = koef * window.innerWidth;
      canvas.height = koef * window.innerHeight;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      return { width: canvas.width, height: canvas.height };
    };
    
    let { width, height } = updateCanvasSize();
    
    const createBackground = () => {
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fillRect(0, 0, width, height);
    };
    
    createBackground();
    
    const heartPosition = (rad) => {
      return [
        Math.pow(Math.sin(rad), 3),
        -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
      ];
    };
    
    const scaleAndTranslate = (pos, sx, sy, dx, dy) => {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
    };
    
    const handleResize = () => {
      const dims = updateCanvasSize();
      width = dims.width;
      height = dims.height;
      createBackground();
    };
    
    window.addEventListener('resize', handleResize);
    
    const traceCount = mobile ? 20 : 50;
    const pointsOrigin = [];
    const dr = mobile ? 0.3 : 0.1;
    
    const heartScale = 1.2;
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210 * heartScale, 13 * heartScale, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150 * heartScale, 9 * heartScale, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90 * heartScale, 5 * heartScale, 0, 0));
    
    const heartPointsCount = pointsOrigin.length;
    const targetPoints = [];
    
    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };
    
    const particles = [];
    const rand = Math.random;
    
    for (let i = 0; i < heartPointsCount; i++) {
      const x = rand() * width;
      const y = rand() * height;
      particles[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: rand() + 5,
        q: Math.floor(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f: `hsla(${Math.floor(360 * rand())},${Math.floor(40 * rand() + 60)}%,${Math.floor(60 * rand() + 20)}%,.6)`,
        trace: []
      };
      
      for (let k = 0; k < traceCount; k++) particles[i].trace[k] = { x, y };
    }
    
    const config = {
      traceK: 0.4,
      timeDelta: 0.01
    };
    
    let time = 0;
    let animationFrameId;
    
    const loop = () => {
      if (!showHearts) return;
      
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;
      
      ctx.fillStyle = "rgba(255,255,255,.1)";
      ctx.fillRect(0, 0, width, height);
      
      for (let i = particles.length; i--;) {
        const u = particles[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (10 > length) {
          if (0.95 < rand()) {
            u.q = Math.floor(rand() * heartPointsCount);
          } else {
            if (0.99 < rand()) {
              u.D *= -1;
            }
            u.q += u.D;
            u.q %= heartPointsCount;
            if (0 > u.q) {
              u.q += heartPointsCount;
            }
          }
        }
        
        u.vx += -dx / length * u.speed;
        u.vy += -dy / length * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        
        for (let k = 0; k < u.trace.length - 1;) {
          const T = u.trace[k];
          const N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        
        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      
      animationFrameId = window.requestAnimationFrame(loop);
    };
    
    loop();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showHearts]);

  const handleHeartClick = () => {
    setShowHearts(false);
    setShowMessage(true);
    
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
    setShowHearts(true);
  };

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

        /* Đảm bảo fullscreen */
        .fullscreen-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: white !important;
        }
      `}</style>
      
      <div className="fullscreen-overlay">
        {showHearts && (
          <div className="absolute inset-0 cursor-pointer" onClick={handleHeartClick}>
            <canvas 
              ref={canvasRef} 
              className="absolute left-0 top-0 w-full h-full"
              style={{ 
                backgroundColor: 'rgba(255,255,255,1)',
                zIndex: 1
              }}
            />
            
            {/* Hướng dẫn click */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-rose-400 text-lg font-medium animate-bounce">
              ❤️ Nhấn vào trái tim để xem thông báo
            </div>
          </div>
        )}
        
        <div 
          ref={messageRef}
          className={`absolute inset-0 transition-all duration-500
                     ${showMessage ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="thank-you-container bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md mx-4 text-center relative">
              <button 
                className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 focus:outline-none transition-colors z-10"
                onClick={handleCloseMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="text-5xl mb-6">💝</div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-500 to-pink-500 mb-6 pop-up-text">
                Cảm ơn bạn đã đặt hàng!
              </h1>
              
              <div className="my-6 py-4 border-t border-b border-rose-200 slide-in-text">
                <p className="text-rose-500 text-lg pop-up-delay-2">
                  Dự kiến giao hàng: <span className="font-semibold text-rose-600">{orderInfo.deliveryDate}</span>
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
        </div>
      </div>
    </>
  );
};

export default SimpleThankYou;
