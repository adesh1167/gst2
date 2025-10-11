import React, { useEffect, useRef } from "react";

/**
 * Single-canvas neural background.
 * Props:
 *  - animate: boolean (start/stop motion)
 *  - opacity: number 0..1
 *  - densityFactor: multiplier for number of points (default 1)
 */
export default function NeuralBackground({
  animate = false,
  opacity = 1,
  densityFactor = 1,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointsRef = useRef([]);
  const ctxRef = useRef(null);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const prevWidthRef = useRef(0);
  const roRef = useRef(null);             // ResizeObserver instance
  const resizeRafRef = useRef(null);

  // Utility: set canvas size and devicePixelRatio transform, return logical width/height
  const setCanvasSize = (canvas) => {
    const parent = canvas.parentNode || document.documentElement;
    const cssWidth = Math.max(1, parent.clientWidth || window.innerWidth);
    const cssHeight = Math.max(1, parent.clientHeight || window.innerHeight);
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // store logical (CSS) dimensions for drawing code
    widthRef.current = cssWidth;
    heightRef.current = cssHeight;
    ctxRef.current = ctx;

    return { width: cssWidth, height: cssHeight, ctx };
  };

  // Create points for given width/height
  const createPoints = (count, width, height) =>
    Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

  // Single draw frame function (reads latest width/height/ctx/points from refs)
  const drawOnce = () => {
    const ctx = ctxRef.current;
    const width = widthRef.current;
    const height = heightRef.current;
    if (!ctx || !width || !height) return;

    ctx.clearRect(0, 0, width, height);

    const points = pointsRef.current;

    // Draw points
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connect nearby points
    const maxDist = 150;
    const minDist = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist && dist > minDist) {
          const alpha = Math.max(0, 0.9 - ((dist - minDist) / (maxDist - minDist)) * 0.9);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Animation loop (reads and mutates pointsRef.current)
  const startLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const loop = () => {
      const ctx = ctxRef.current;
      const width = widthRef.current;
      const height = heightRef.current;

      if (!ctx || !width || !height) return;

      ctx.clearRect(0, 0, width, height);

      const points = pointsRef.current;

      // Draw moving points
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect nearby points
      const maxDist = 150;
      const minDist = 0;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist && dist > minDist) {
            const alpha = Math.max(0, 0.9 - ((dist - minDist) / (maxDist - minDist)) * 0.9);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Update positions
      for (const p of points) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) {
          if (p.x > width + 1) {
            p.x = width;
          }
          if (p.x < -1) {
            p.x = 0;
          }
          p.dx *= -1
        }

        if (p.y < 0 || p.y > height) {
          if (p.y > height + 1) {
            p.y = height;
          }
          if (p.y < -1) {
            p.y = 0;
          }
          p.dy *= -1
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Initialize & handle resizing; runs when component mounts and when densityFactor changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // initial resize & points creation
    const { width, height } = setCanvasSize(canvas);
    prevWidthRef.current = window.innerWidth;

    if (!pointsRef.current || pointsRef.current.length === 0) {
      const pointCount = Math.max(8, Math.floor((width * height) / (6000 / Math.max(0.25, densityFactor))));
      pointsRef.current = createPoints(pointCount, width, height);
    }

    // draw initial frame / start loop depending on animate prop
    if (animate) {
      startLoop();
    } else {
      drawOnce();
    }

    // resize handler (debounced-ish by using last width guard)
    const handleResize = (_, partial = false) => {
      let skip = partial;
      const parent = canvas.parentNode || document.documentElement;
      const cssW = parent.clientWidth || window.innerWidth;
      const cssH = parent.clientHeight || window.innerHeight;

      // avoid excessive recalculations for tiny changes (mobile address bar, etc.)
      // console.log(prevWidthRef.current - window.innerWidth);
      if (!partial) {
        if ((Math.abs(prevWidthRef.current - window.innerWidth) < 10)) {
          skip = true;
        } else {
          prevWidthRef.current = window.innerWidth;
        }
      }

      // console.log("resize", cssW, cssH);

      // prevWidthRef.current = window.innerWidth;

      // reconfigure canvas & context
      setCanvasSize(canvas);

      if (!skip) {
        // recreate points with new density
        const newCount = Math.max(8, Math.floor((widthRef.current * heightRef.current) / (6000 / Math.max(0.25, densityFactor))));
        pointsRef.current = createPoints(newCount, widthRef.current, heightRef.current);
      }


      // redraw static frame or restart loop
      // stopLoop();
      if (animate) {
        // startLoop();
      } else {
        drawOnce();
      }
    };

    const observedElement = canvas.parentElement ?? document.documentElement;

    roRef.current = new ResizeObserver((entries) => {
      // We don't need to read entries' sizes here because our setCanvasSize will query parent.clientWidth
      // but in advanced usage you can read entries[0].contentRect to get exact sizes.
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        handleResize(undefined, true);
        resizeRafRef.current = null;
      });
    });

    roRef.current.observe(observedElement, { box: "content-box" });

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (roRef.current) {
        try { roRef.current.disconnect(); } catch (e) { }
        roRef.current = null;
      }
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
      stopLoop();
    };
    // densityFactor intentionally included; animate not included so toggling animation retriggers in next effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [densityFactor, animate]);

  // Effect that starts/stops animation when `animate` prop changes
  useEffect(() => {
    // ensure canvas & ctx exist and points initialized
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ensure canvas size & ctx are set
    setCanvasSize(canvas);

    // ensure we have points (create if missing)
    if (!pointsRef.current || pointsRef.current.length === 0) {
      const pointCount = Math.max(8, Math.floor((widthRef.current * heightRef.current) / (6000 / Math.max(0.25, densityFactor))));
      pointsRef.current = createPoints(pointCount, widthRef.current, heightRef.current);
    }

    // start or stop loop
    if (animate) {
      startLoop();
    } else {
      // stop animation but keep last frame visible
      stopLoop();
      drawOnce();
    }

    return () => {
      // on cleanup ensure we stop RAF to avoid orphaned loop
      stopLoop();
    };
    // include animate so toggling it restarts/stops loop
  }, [animate, densityFactor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ opacity, pointerEvents: "none" }}
    />
  );
}
