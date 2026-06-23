import React, { useEffect, useRef } from 'react';
import './CubeBackground.css';

function CubeBackground({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || window.innerWidth;
        canvas.height = parent.clientHeight || window.innerHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Kub koordinatalari
    let vertices = [
      {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1},
      {x: -1, y: -1, z: 1},  {x: 1, y: -1, z: 1},  {x: 1, y: 1, z: 1},  {x: -1, y: 1, z: 1}
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    let angleX = 0;
    let angleY = 0;

    const rotateX = (point, rad) => {
      let cos = Math.cos(rad);
      let sin = Math.sin(rad);
      return { ...point, y: point.y * cos - point.z * sin, z: point.y * sin + point.z * cos };
    };

    const rotateY = (point, rad) => {
      let cos = Math.cos(rad);
      let sin = Math.sin(rad);
      return { ...point, x: point.x * cos + point.z * sin, z: -point.x * sin + point.z * cos };
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Kub o'lchami
      const scale = Math.min(canvas.width, canvas.height) * 0.35;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Tezroq va jonliroq aylanish
      angleX += 0.012;
      angleY += 0.018;

      let projected = vertices.map(v => {
        let p = rotateX(v, angleX);
        p = rotateY(p, angleY);
        const distance = 2.3;
        const zMod = 1 / (distance - p.z);
        return { x: p.x * scale * zMod + cx, y: p.y * scale * zMod + cy };
      });

      edges.forEach(([start, end], index) => {
        ctx.beginPath();
        ctx.moveTo(projected[start].x, projected[start].y);
        ctx.lineTo(projected[end].x, projected[end].y);

        const gradient = ctx.createLinearGradient(
          projected[start].x, projected[start].y, 
          projected[end].x, projected[end].y
        );
        
       // To'q va dabdabali ranglar o'rniga, faqat professional och nurlar beramiz:
if (index % 3 === 0) {
  gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)'); // Nozik ko'k
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
} else if (index % 3 === 1) {
  gradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)'); // Nozik binafsha
  gradient.addColorStop(1, 'rgba(244, 63, 94, 0.1)');
} else {
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Yorqin oq nur
  gradient.addColorStop(1, 'rgba(14, 165, 233, 0.2)');
}

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 15; // Qalinlikni kamaytirdik, shunda chiziqlar aniq ajralib turadi
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="cube-bg-main-wrapper">
      <canvas ref={canvasRef} className="cube-canvas-screen" />
      <div className="cube-fluid-blur"></div>
      <div className="cube-inner-content">
        {children}
      </div>
    </div>
  );
}

export default CubeBackground;