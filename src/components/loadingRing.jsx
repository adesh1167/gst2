// LoadingRing.jsx
import React from "react";

export default function LoadingRing({ size = 64, ariaLabel = "Loading" }) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="loading-ring"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{ariaLabel}</title>

      {/* Purple outer ring */}
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="#8b5cf6" /* purple */
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="90 130"
        className="ring ring--outer"
      />

      {/* Yellow middle ring */}
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="#facc15" /* yellow */
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="60 80"
        className="ring ring--mid"
      />

      {/* Blue inner ring */}
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="none"
        stroke="#0b07d0ff" /* teal/blue */
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="36 48"
        className="ring ring--inner"
      />

      <style>{`
        .loading-ring { display: inline-block; }
        .ring { transform-origin: 32px 32px; }

        /* Different rotation directions and speeds for subtle complexity */
        .ring--outer {
          animation: rot-outer 1.8s linear infinite;
          opacity: 0.95;
        }
        .ring--mid {
          animation: rot-mid 1.2s linear reverse infinite;
          opacity: 0.95;
        }
        .ring--inner {
          animation: rot-inner 0.9s linear infinite;
          opacity: 0.95;
        }

        @keyframes rot-outer {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rot-mid {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rot-inner {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        /* Optional: a gentle opacity pulse so it looks alive on dark backgrounds */
        .loading-ring:hover .ring { opacity: 1; }
      `}</style>
    </svg>
  );
}
