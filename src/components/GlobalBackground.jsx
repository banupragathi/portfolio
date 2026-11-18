// src/components/GlobalBackground.jsx
import { useRef } from 'react';
import { useStars } from '../hooks/useStars';

export default function GlobalBackground() {
  const starsCanvasRef = useRef(null);
  useStars(starsCanvasRef, 250, { maxR: 1.5, enableShootingStars: true });

  return (
    <>
      {/* Global background color div */}
      <div id="global-bg" />

      {/* Liquid Mesh Gradient Background */}
      <div className="mesh-container">
        <div className="mesh-blob blob-purple" />
        <div className="mesh-blob blob-blue" />
        <div className="mesh-blob blob-pink" />
        <div className="mesh-blob blob-orange" />
      </div>

      {/* Scroll Progress Bar */}
      <div id="progress-bar" />

      {/* Cursor Glow */}
      <div id="cursor-glow" />

      {/* Stars Canvas */}
      <canvas id="stars-canvas" ref={starsCanvasRef} />

      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="text-warp-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" id="text-displacement" />
          </filter>
          <filter id="liquid-warp-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.008" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" id="liquid-displacement" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
