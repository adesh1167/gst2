import { useEffect, useRef } from "react";

export default function NeuralBackground({ opacity = 1 }) {
  const canvasRef = useRef(null);
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Scale point count based on screen area
    let pointCount = Math.floor((width * height) / 10000); // ~1 point per 25k px²
    let points = createPoints(pointCount);

    function createPoints(count) {
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw points
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect lines between nearby points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 150})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Move points
      points.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      });

      requestAnimationFrame(draw);
    }

    draw();

    // Handle resize

    const handleResize = () => {
      if (prevWidth.current !== window.innerWidth) {
        prevWidth.current = window.innerWidth;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        pointCount = Math.floor((width * height) / 10000);
        points = createPoints(pointCount);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{
        opacity: opacity
      }}
    />
  );
}
