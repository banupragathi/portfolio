// src/components/Hero.jsx
import React from 'react';

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-content">
        <div className="hero-hello">HELLO</div>
        <div className="hero-name">I'm Banu Pragathi</div>
        <p className="hero-tagline">Building impactful digital experiences through creativity, AI, and innovation.</p>
        <div className="hero-scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  );
}
