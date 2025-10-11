import React from "react";
import { motion } from "framer-motion";

/**
 * NeuralBackground
 *
 * Props:
 * - animate: boolean (default false)  -> when true the animated layer plays
 * - className: string                 -> extra classes for wrapper
 * - style: object                     -> inline styles for wrapper
 * - size: "full" | "card"             -> quick presets (default "full")
 *
 * Usage:
 *  <NeuralBackground />                       // stationary
 *  <NeuralBackground animate />               // animated
 *  <NeuralBackground animate className="absolute inset-0" />
 */
const NeuralBackground2 = ({ animate = false, className = "", style = {}, size = "full" }) => {
  // animation variants for animated layer
  const ringVariants = {
    idle: { opacity: 0.0, scale: 1, rotate: 0 },
    play: (i) => ({
      opacity: [0.0, 0.45, 0.15],
      scale: [1, 1.12, 1],
      rotate: [0, 45, 0],
      transition: {
        duration: 6 + (i % 3), // give each ring a slightly different duration
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    })
  };

  const floatVariants = {
    idle: { y: 0, x: 0 },
    play: (i) => ({
      y: [0, -8 - (i % 5), 0],
      x: [0, 6 - (i % 4), 0],
      transition: {
        duration: 8 + (i % 4),
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    })
  };

  const wrapperBase =
    "relative overflow-hidden select-none pointer-events-none " +
    (size === "card" ? "rounded-2xl" : "min-h-screen");

  return (
    <div
      aria-hidden
      className={`${wrapperBase} ${className}`}
      style={{
        ...style
      }}
    >
      {/* --- STATIC LAYER (always rendered) --- */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(1200px 600px at 10% 20%, rgba(124,58,237,0.06), transparent 6%), radial-gradient(900px 400px at 90% 80%, rgba(79,70,229,0.04), transparent 6%), linear-gradient(180deg, rgba(10,10,12,0.6) 0%, rgba(6,6,8,0.6) 100%)",
          mixBlendMode: "overlay",
          backdropFilter: "blur(2px)"
        }}
      />

      {/* subtle noise / grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1, opacity: 0.06 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
          </pattern>
          <filter id="grain">
            <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend mode="overlay" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="transparent" filter="url(#grain)" />
      </svg>

      {/* --- STATIC NEURAL LINES (vector shapes) --- */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2, opacity: 0.12 }}
        preserveAspectRatio="none"
      >
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none">
          <path d="M0,70 C120,40 220,100 360,80 C520,60 760,130 1024,110" />
          <path d="M0,170 C120,140 220,200 360,180 C520,160 760,230 1024,210" />
          <path d="M0,270 C120,240 220,300 360,280 C520,260 760,330 1024,310" />
        </g>
      </svg>

      {/* --- ANIMATED LAYER (rendered but idle unless animate=true) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }}>
        {/* rings / glows */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            custom={i}
            initial="idle"
            animate={animate ? "play" : "idle"}
            variants={ringVariants}
            style={{
              position: "absolute",
              left: `${10 + i * 28}%`,
              top: `${8 + i * 22}%`,
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              borderRadius: "50%",
              boxShadow:
                "0 0 40px rgba(124,58,237,0.12), inset 0 0 20px rgba(124,58,237,0.02)",
              border: "1px solid rgba(124,58,237,0.08)",
              mixBlendMode: "screen"
            }}
          />
        ))}

        {/* floating nodes */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={`node-${i}`}
            custom={i}
            initial="idle"
            animate={animate ? "play" : "idle"}
            variants={floatVariants}
            style={{
              position: "absolute",
              left: `${8 + i * 22}%`,
              top: `${60 - i * 10}%`,
              width: `${8 + (i % 3) * 6}px`,
              height: `${8 + (i % 3) * 6}px`,
              borderRadius: "50%",
              background:
                i % 2 ? "radial-gradient(circle at 30% 30%, rgba(99,102,241,1), rgba(99,102,241,0.15))" : "radial-gradient(circle at 30% 30%, rgba(168,85,247,1), rgba(168,85,247,0.12))",
              boxShadow: "0 6px 24px rgba(99,102,241,0.08)",
              mixBlendMode: "screen"
            }}
          />
        ))}

        {/* slow sweeping gradient bar */}
        <motion.div
          initial={{ x: "-30%", opacity: 0.0 }}
          animate={animate ? { x: ["-30%", "110%"], opacity: [0, 0.55, 0] } : { x: "-30%", opacity: 0 }}
          transition={animate ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          style={{
            position: "absolute",
            left: "-30%",
            top: "30%",
            width: "40%",
            height: "18%",
            borderRadius: "24px",
            transform: "skewX(-8deg)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.00) 0%, rgba(124,58,237,0.06) 20%, rgba(79,70,229,0.07) 50%, rgba(124,58,237,0.04) 80%, rgba(255,255,255,0.00) 100%)",
            mixBlendMode: "screen",
            zIndex: 4,
            pointerEvents: "none"
          }}
        />
      </div>
    </div>
  );
};

export default NeuralBackground2;
