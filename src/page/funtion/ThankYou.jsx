import { useEffect, useRef } from 'react';

export default function HeartAnimation() {
  const canvasRef = useRef(null);

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
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = koef * window.innerWidth;
      canvas.height = koef * window.innerHeight;
      return { width: canvas.width, height: canvas.height };
    };
    
    let { width, height } = updateCanvasSize();
    
    // Fill with white background instead of black
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, 0, width, height);
    
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
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fillRect(0, 0, width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set trace count based on device
    const traceCount = mobile ? 20 : 50;
    const pointsOrigin = [];
    
    // Generate heart points
    const dr = mobile ? 0.3 : 0.1;
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    
    const heartPointsCount = pointsOrigin.length;
    const targetPoints = [];
    
    // Pulse function
    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };
    
    // Create particles with more vibrant colors for white background
    const particles = [];
    for (let i = 0; i < heartPointsCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: Math.random() + 5,
        q: ~~(Math.random() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * Math.random() + 0.7,
        // Use red/pink hues for heart particles
        f: `hsla(${~~(20 * Math.random() + 340)},${~~(40 * Math.random() + 60)}%,${~~(50 * Math.random() + 30)}%,.6)`,
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
    
    // Animation loop
    const loop = () => {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;
      
      // Semi-transparent white for fade effect
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(0, 0, width, height);
      
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
        
        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
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

  return (
    <div className="heart-animation-container relative w-full h-full bg-white">
      <div className="absolute w-full text-center z-10 top-8">
        <h1 className="text-3xl md:text-5xl font-bold text-rose-600 drop-shadow-md mb-2">
          Cảm ơn bạn đã đặt hàng!
        </h1>
        <p className="text-lg md:text-xl text-rose-500">
          Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </p>
      </div>
      <canvas 
        ref={canvasRef} 
        className="absolute left-0 top-0 w-full h-full bg-white"
      />
    </div>
  );
}
