import { useState, useEffect, useRef } from 'react';

export default function EnhancedThankYou() {
  const canvasRef = useRef(null);
  const messageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    deliveryDate: (() => {
      const today = new Date();
      const startDate = new Date(today);
      const endDate = new Date(today);
      startDate.setDate(today.getDate() + 4);
      endDate.setDate(today.getDate() + 5);
      return `từ ngày ${startDate.getDate()}/${startDate.getMonth() + 1} đến ngày ${endDate.getDate()}/${endDate.getMonth() + 1}`;
    })()
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Check if device is mobile
    const isDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
    );
    
    const mobile = isDevice;
    const koef = mobile ? 0.5 : 1;
    
    // Set canvas size - reduce size for better performance
    const updateCanvasSize = () => {
      // Use smaller canvas size for better performance
      canvas.width = koef * Math.min(window.innerWidth, 1200); 
      canvas.height = koef * Math.min(window.innerHeight, 800);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      return { width: canvas.width, height: canvas.height };
    };
    
    let { width, height } = updateCanvasSize();
    
    // Gradient background for more luxurious feel
    const createBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 245, 248, 1)");
      gradient.addColorStop(1, "rgba(255, 230, 240, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
    
    createBackground();
    
    // Heart position function
    const heartPosition = (rad) => {
      return [
        Math.pow(Math.sin(rad), 3), 
        -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
      ];
    };
    
    // Scale and translate points
    const scaleAndTranslate = (pos, sx, sy, dx, dy) => {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
    };
    
    // Event listener for window resize
    const handleResize = () => {
      const dims = updateCanvasSize();
      width = dims.width;
      height = dims.height;
      createBackground();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Particle parameters - better distribution for a fuller heart
    const traceCount = mobile ? 12 : 25;
    const pointsOrigin = [];
    
    // Generate heart points with optimized step for better performance and shape
    const dr = mobile ? 0.3 : 0.1;
    
    // Multi-layer heart for richer effect
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 230, 15, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 180, 12, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 130, 8, 0, 0));
    
    const heartPointsCount = pointsOrigin.length;
    const targetPoints = [];
    
    // Pulse function - smoother animation with adjustable scaling
    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };
    
    // Enhanced particles with better color palette and glow effect
    const particles = [];
    const colorPalette = [
      'rgb(255, 80, 110)',   // Deeper red
      'rgb(255, 100, 130)',  // Rose
      'rgb(255, 120, 150)',  // Hot pink
      'rgb(255, 150, 170)',  // Soft pink
      'rgb(255, 180, 200)',  // Light pink
      'rgb(255, 210, 220)',  // Very light pink
      'rgb(255, 60, 100)',   // Bright red
      'rgb(255, 130, 160)'   // Medium pink
    ];
    
    // Optimize particle count for performance and visual effect
    const particleCount = Math.floor(heartPointsCount * 0.7);
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles[i] = {
        vx: 0,
        vy: 0,
        R: Math.random() * 2 + 1, // Variable size for dynamic look
        speed: Math.random() * 3 + 2,
        q: ~~(Math.random() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.3 * Math.random() + 0.5,
        f: colorPalette[i % colorPalette.length],
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
    
    // Enhanced animation loop with glow effects
    const loop = () => {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;
      
      // Smoother fade effect with subtle shimmer
      ctx.fillStyle = "rgba(255, 245, 248, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Add occasional sparkles for luxury
      if (Math.random() > 0.97) {
        const sparkleX = Math.random() * width;
        const sparkleY = Math.random() * height;
        const sparkleSize = Math.random() * 3 + 1;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "rgba(255, 230, 240, 0.6)";
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize + 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw heart particles with glow
      for (let i = particles.length; i--;) {
        const u = particles[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (10 > length) {
          if (0.95 < Math.random()) {
            u.q = ~~(Math.random() * heartPointsCount);
          } else {
            if (0.99 < Math.random()) {
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
        
        // Add subtle glow effect to particles
        ctx.shadowBlur = 5;
        ctx.shadowColor = u.f;
        ctx.fillStyle = u.f;
        
        for (let k = 0; k < Math.min(5, u.trace.length); k++) {
          const point = u.trace[k];
          ctx.beginPath();
          ctx.arc(point.x, point.y, u.R * (1 - k/10), 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.shadowBlur = 0;
      }
      
      if (!loaded && time > 0.1) {
        setLoaded(true);
      }
      
      animationFrameId = window.requestAnimationFrame(loop);
    };
    
    // Start the animation
    loop();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Words that will pop-up one by one with animation
  const [animatedWords, setAnimatedWords] = useState([
    { text: "Tuyệt vời!", visible: false },
    { text: "Cảm ơn!", visible: false },
    { text: "Tuyệt!", visible: false }
  ]);

  // Show words one by one with timeout
  useEffect(() => {
    const wordTimers = [];
    
    animatedWords.forEach((word, index) => {
      const timer = setTimeout(() => {
        setAnimatedWords(prev => {
          const newWords = [...prev];
          newWords[index].visible = true;
          return newWords;
        });
      }, 1000 + (index * 1500)); // Staggered timing
      
      wordTimers.push(timer);
    });
    
    // Cleanup
    return () => {
      wordTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Function to handle heart click and show message
  const handleHeartClick = () => {
    setShowMessage(true);
    // Scroll to message if needed
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-rose-50 to-pink-50 overflow-hidden">
      {/* Canvas for heart animation - Now clickable */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleHeartClick}>
        <canvas 
          ref={canvasRef} 
          className="absolute left-0 top-0 w-full h-full"
        />
        {/* Instruction to click on heart */}
        <div className="absolute bottom-10 left-0 right-0 text-center text-rose-600 font-medium animate-pulse z-10">
          Nhấn vào trái tim để xem lời cảm ơn
        </div>
      </div>
      
      {/* Animated floating words */}
      {animatedWords.map((word, index) => (
        word.visible && (
          <div 
            key={index}
            className={`animated-word absolute z-20 font-bold text-2xl md:text-4xl text-center
                        ${index % 3 === 0 ? 'text-rose-500' : index % 3 === 1 ? 'text-pink-400' : 'text-red-500'}`}
            style={{
              left: `${30 + (index * 20)}%`,
              top: `${30 + ((index * 15) % 45)}%`,
              animationDelay: `${index * 0.5}s`,
              textShadow: '0 2px 10px rgba(255,255,255,0.7), 0 -2px 10px rgba(255,100,150,0.5)'
            }}
          >
            {word.text}
          </div>
        )
      ))}
      
      {/* Content overlay - Now shown only when heart is clicked */}
      <div 
        ref={messageRef}
        className={`absolute inset-0 flex items-center justify-center z-30 transition-all duration-500
                   ${showMessage ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="thank-you-container bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-6 max-w-md text-center">
          <button 
            className="absolute top-2 right-2 text-rose-400 hover:text-rose-600 focus:outline-none"
            onClick={() => setShowMessage(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-500 to-pink-500 mb-3 pop-up-text">
            Cảm ơn bạn đã đặt hàng!
          </h1>
          
          <div className="my-4 py-2 border-t border-b border-rose-200 slide-in-text">
            <p className="text-rose-500 pop-up-delay-2">
              Dự kiến giao hàng: <span className="font-semibold text-rose-600">{orderInfo.deliveryDate}</span>
            </p>
          </div>
          
          <div className="mt-4 bounce-in-button">
            <a 
              href="/alllinhkien" 
              className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-300 transform hover:-translate-y-1"
            >
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        /* Container animation */
        .thank-you-container {
          animation: float 6s ease-in-out infinite, popIn 0.5s ease-out;
          box-shadow: 
            0 5px 20px rgba(255, 100, 150, 0.3),
            0 0 40px rgba(255, 100, 150, 0.2) inset;
          position: relative;
          z-index: 20;
          max-width: 90%;
        }
        
        @keyframes popIn {
          0% { transform: scale(0.1); opacity: 0; }
          70% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* 3D text effect */
        .pop-up-text {
          animation: popUp 1s forwards;
          opacity: 0;
          transform: scale(0.7);
          text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .pop-up-delay-1 {
          animation: popUp 1s 0.5s forwards;
          opacity: 0;
          transform: scale(0.7);
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
        
        /* Glowing text effect */
        .glow-text {
          animation: glow 2s infinite alternate;
        }
        
        @keyframes glow {
          from { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e60073, 0 0 20px #e60073; }
          to { text-shadow: 0 0 10px #fff, 0 0 20px #ff4da6, 0 0 30px #ff4da6, 0 0 40px #ff4da6; }
        }
        
        /* Slide in text animation */
        .slide-in-text {
          animation: slideIn 1s ease-out forwards;
          transform: translateY(20px);
          opacity: 0;
        }
        
        @keyframes slideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        /* Button bounce animation */
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
        
        /* Floating words animation */
        .animated-word {
          animation: floatWord 5s ease-in-out infinite, fadeInOut 10s infinite;
          transform-origin: center;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.7));
        }
        
        @keyframes floatWord {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(0) rotate(2deg); }
          75% { transform: translateY(-10px) rotate(-2deg); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
