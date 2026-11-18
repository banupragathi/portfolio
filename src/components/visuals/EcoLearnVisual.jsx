import React, { useEffect, useRef, useState } from 'react';

export default function EcoLearnVisual() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsActive(entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const svgContent = `
    <style>
      .visual-paused * { animation-play-state: paused !important; }
      .eco-svg-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
      .eco-svg { width: 100%; height: 100%; overflow: visible; }
      
      .eco-book-fill { fill: #2dd4bf; }
      .eco-spine { stroke: #bd93f9; stroke-width: 3; fill: none; filter: drop-shadow(0 0 8px rgba(189, 147, 249, 0.6)); stroke-dasharray: 300; stroke-linecap: round; }
      .eco-branch { stroke: #bd93f9; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 6px rgba(189, 147, 249, 0.4)); stroke-dasharray: 200; }
      
      .eco-data-line { stroke: #2dd4bf; stroke-width: 2.5; fill: none; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(45, 212, 191, 0.8)); stroke-dasharray: 4 60; }
      .eco-data-line.orange { stroke: #ffb86c; filter: drop-shadow(0 0 6px rgba(255, 184, 108, 0.8)); }
      
      .eco-node-bg { fill: #191a23; stroke: #bd93f9; stroke-width: 2; }
      .eco-icon { fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
      .c-cyan { stroke: #2dd4bf; color: #2dd4bf; }
      .c-orange { stroke: #ffb86c; color: #ffb86c; }

      @keyframes e-spine { 0%, 10% { stroke-dashoffset: 300; opacity: 0; } 12% { opacity: 1; } 25%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }
      
      @keyframes e-b1 { 0%, 20% { stroke-dashoffset: 200; opacity: 0; } 21% { opacity: 1; stroke-dashoffset: 200; } 30%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }
      @keyframes e-b2 { 0%, 22% { stroke-dashoffset: 200; opacity: 0; } 23% { opacity: 1; stroke-dashoffset: 200; } 32%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }
      @keyframes e-b3 { 0%, 26% { stroke-dashoffset: 200; opacity: 0; } 27% { opacity: 1; stroke-dashoffset: 200; } 36%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }
      @keyframes e-b4 { 0%, 28% { stroke-dashoffset: 200; opacity: 0; } 29% { opacity: 1; stroke-dashoffset: 200; } 38%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }
      @keyframes e-b5 { 0%, 32% { stroke-dashoffset: 200; opacity: 0; } 33% { opacity: 1; stroke-dashoffset: 200; } 42%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }
      @keyframes e-b6 { 0%, 34% { stroke-dashoffset: 200; opacity: 0; } 35% { opacity: 1; stroke-dashoffset: 200; } 44%, 85% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: 0; opacity: 0; } }

      @keyframes e-n1 { 0%, 28% { transform: scale(0); opacity: 0; } 32%, 85% { transform: scale(1); opacity: 1; } 95%, 100% { transform: scale(0); opacity: 0; } }
      @keyframes e-n2 { 0%, 30% { transform: scale(0); opacity: 0; } 34%, 85% { transform: scale(1); opacity: 1; } 95%, 100% { transform: scale(0); opacity: 0; } }
      @keyframes e-n3 { 0%, 34% { transform: scale(0); opacity: 0; } 38%, 85% { transform: scale(1); opacity: 1; } 95%, 100% { transform: scale(0); opacity: 0; } }
      @keyframes e-n4 { 0%, 36% { transform: scale(0); opacity: 0; } 40%, 85% { transform: scale(1); opacity: 1; } 95%, 100% { transform: scale(0); opacity: 0; } }
      @keyframes e-n5 { 0%, 40% { transform: scale(0); opacity: 0; } 44%, 85% { transform: scale(1); opacity: 1; } 95%, 100% { transform: scale(0); opacity: 0; } }
      @keyframes e-n6 { 0%, 42% { transform: scale(0); opacity: 0; } 46%, 85% { transform: scale(1); opacity: 1; } 95%, 100% { transform: scale(0); opacity: 0; } }

      @keyframes e-book { 0%, 5% { transform: scaleX(0.1); opacity: 0; } 10% { transform: scaleX(0.1); opacity: 1; } 20%, 85% { transform: scaleX(1); opacity: 1; } 95%, 100% { transform: scaleX(0.1); opacity: 0; } }
      @keyframes e-data-fade { 0%, 40% { opacity: 0; } 45%, 85% { opacity: 1; } 90%, 100% { opacity: 0; } }
      @keyframes e-data-flow { from { stroke-dashoffset: 128; } to { stroke-dashoffset: 0; } }

      .a-esp { animation: e-spine 10s ease-out infinite; }
      .a-eb1 { animation: e-b1 10s ease-out infinite; }
      .a-eb2 { animation: e-b2 10s ease-out infinite; }
      .a-eb3 { animation: e-b3 10s ease-out infinite; }
      .a-eb4 { animation: e-b4 10s ease-out infinite; }
      .a-eb5 { animation: e-b5 10s ease-out infinite; }
      .a-eb6 { animation: e-b6 10s ease-out infinite; }

      .a-en1 { animation: e-n1 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: 130px 260px; }
      .a-en2 { animation: e-n2 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: 370px 260px; }
      .a-en3 { animation: e-n3 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: 100px 160px; }
      .a-en4 { animation: e-n4 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: 400px 160px; }
      .a-en5 { animation: e-n5 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: 140px 60px; }
      .a-en6 { animation: e-n6 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: 360px 60px; }

      .a-ebk { animation: e-book 10s ease-in-out infinite; transform-origin: 250px 330px; }
      .a-ed-fade { animation: e-data-fade 10s ease-in-out infinite; }
      .a-ed-flow { animation: e-data-flow 2s linear infinite; }

      .eco-pulse-node { animation: e-pulse 3s ease-in-out infinite alternate; }
      @keyframes e-pulse { 0% { filter: drop-shadow(0 0 2px rgba(189,147,249,0.3)); } 100% { filter: drop-shadow(0 0 12px rgba(189,147,249,0.9)); } }
    </style>

    <div class="eco-svg-container">
      <svg class="eco-svg" viewBox="0 0 500 380" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        
        <!-- Structural Constellation Lines -->
        <path class="eco-spine a-esp" d="M250,330 L250,60" />
        <path class="eco-branch a-eb1" d="M250,300 L210,260 L130,260" />
        <path class="eco-branch a-eb2" d="M250,300 L290,260 L370,260" />
        <path class="eco-branch a-eb3" d="M250,200 L210,160 L100,160" />
        <path class="eco-branch a-eb4" d="M250,200 L290,160 L400,160" />
        <path class="eco-branch a-eb5" d="M250,100 L210,60 L140,60" />
        <path class="eco-branch a-eb6" d="M250,100 L290,60 L360,60" />

        <!-- Energy Data Particles -->
        <g class="a-ed-fade">
          <path class="eco-data-line a-ed-flow c-cyan" d="M250,330 L250,60" />
          <path class="eco-data-line a-ed-flow c-cyan" d="M250,300 L210,260 L130,260" />
          <path class="eco-data-line a-ed-flow orange" d="M250,300 L290,260 L370,260" />
          <path class="eco-data-line a-ed-flow c-cyan" d="M250,200 L210,160 L100,160" />
          <path class="eco-data-line a-ed-flow orange" d="M250,200 L290,160 L400,160" />
          <path class="eco-data-line a-ed-flow c-cyan" d="M250,100 L210,60 L140,60" />
          <path class="eco-data-line a-ed-flow orange" d="M250,100 L290,60 L360,60" />
          
          <!-- Glowing Junctions -->
          <circle cx="250" cy="300" r="3" fill="#2dd4bf" filter="drop-shadow(0 0 6px #2dd4bf)" />
          <circle cx="250" cy="200" r="3" fill="#2dd4bf" filter="drop-shadow(0 0 6px #2dd4bf)" />
          <circle cx="250" cy="100" r="3" fill="#2dd4bf" filter="drop-shadow(0 0 6px #2dd4bf)" />
        </g>

        <!-- Knowledge Nodes -->
        <!-- 1. Learning -->
        <g class="a-en1">
          <g class="eco-pulse-node">
            <circle class="eco-node-bg" cx="130" cy="260" r="16" />
            <svg x="120" y="250" width="20" height="20" viewBox="0 0 24 24" class="eco-icon c-cyan">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </g>
        </g>
        
        <!-- 2. Quiz -->
        <g class="a-en2">
          <g class="eco-pulse-node" style="animation-delay: -0.5s;">
            <circle class="eco-node-bg" cx="370" cy="260" r="16" />
            <svg x="360" y="250" width="20" height="20" viewBox="0 0 24 24" class="eco-icon c-orange">
              <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
            </svg>
          </g>
        </g>

        <!-- 3. Knowledge -->
        <g class="a-en3">
          <g class="eco-pulse-node" style="animation-delay: -1s;">
            <circle class="eco-node-bg" cx="100" cy="160" r="16" />
            <svg x="90" y="150" width="20" height="20" viewBox="0 0 24 24" class="eco-icon c-cyan">
              <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </g>
        </g>

        <!-- 4. Innovation -->
        <g class="a-en4">
          <g class="eco-pulse-node" style="animation-delay: -1.5s;">
            <circle class="eco-node-bg" cx="400" cy="160" r="16" />
            <svg x="390" y="150" width="20" height="20" viewBox="0 0 24 24" class="eco-icon c-orange">
              <path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5z"></path>
            </svg>
          </g>
        </g>

        <!-- 5. Sustainability -->
        <g class="a-en5">
          <g class="eco-pulse-node" style="animation-delay: -2s;">
            <circle class="eco-node-bg" cx="140" cy="60" r="16" />
            <svg x="130" y="50" width="20" height="20" viewBox="0 0 24 24" class="eco-icon c-cyan">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </g>
        </g>

        <!-- 6. Global Impact -->
        <g class="a-en6">
          <g class="eco-pulse-node" style="animation-delay: -2.5s;">
            <circle class="eco-node-bg" cx="360" cy="60" r="16" />
            <svg x="350" y="50" width="20" height="20" viewBox="0 0 24 24" class="eco-icon c-orange">
              <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </g>
        </g>

        <!-- The Realistic High-Tech Book -->
        <defs>
          <linearGradient id="page-grad-left" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#e2d4ff" />
          </linearGradient>
          <linearGradient id="page-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#e2d4ff" />
          </linearGradient>
        </defs>

        <g class="a-ebk">
          <!-- Base Aura -->
          <ellipse cx="250" cy="340" rx="140" ry="25" fill="rgba(45, 212, 191, 0.1)" filter="drop-shadow(0 0 20px #2dd4bf)" />
          
          <!-- Cover -->
          <path d="M250,365 Q180,390 115,340 L115,265 Q180,315 250,285 Q320,315 385,265 L385,340 Q320,390 250,365 Z" fill="#151129" stroke="#bd93f9" stroke-width="2" />
          
          <!-- Page Thickness -->
          <path d="M250,350 Q190,375 125,328 L125,272 Q190,320 250,295 Z" fill="#a092d6" />
          <path d="M250,350 Q310,375 375,328 L375,272 Q310,320 250,295 Z" fill="#a092d6" />
          
          <!-- Page Lines on Thickness -->
          <path d="M250,344 Q190,369 125,322 M250,347 Q190,372 125,325" fill="none" stroke="#e2d4ff" stroke-width="1" />
          <path d="M250,344 Q310,369 375,322 M250,347 Q310,372 375,325" fill="none" stroke="#e2d4ff" stroke-width="1" />

          <!-- Top Pages Surface -->
          <path d="M250,340 Q190,365 125,320 L125,270 Q190,315 250,290 Z" fill="url(#page-grad-left)" />
          <path d="M250,340 Q310,365 375,320 L375,270 Q310,315 250,290 Z" fill="url(#page-grad-right)" />
          
          <!-- Abstract Text Lines -->
          <g stroke="#bd93f9" stroke-width="2.5" stroke-linecap="round" opacity="0.4">
            <path d="M230,295 Q180,315 145,280" />
            <path d="M230,305 Q180,325 145,290" />
            <path d="M230,315 Q180,335 145,300" stroke-dasharray="20 10 10 5" />
            <path d="M230,325 Q180,345 145,310" />
            
            <path d="M270,295 Q320,315 355,280" />
            <path d="M270,305 Q320,325 355,290" />
            <path d="M270,315 Q320,335 355,300" stroke-dasharray="15 5 15 10" />
            <path d="M270,325 Q320,345 355,310" />
          </g>

          <!-- Center Spine & Highlights -->
          <path d="M250,290 L250,340" stroke="#a092d6" stroke-width="1.5" />
          <path d="M250,340 L250,365" stroke="#bd93f9" stroke-width="2" />
          
          <!-- Eco Energy Glow from Center Crease -->
          <ellipse cx="250" cy="300" rx="30" ry="10" fill="#2dd4bf" filter="drop-shadow(0 0 15px #2dd4bf)" opacity="0.8" />
          <path d="M250,290 L250,320" stroke="#2dd4bf" stroke-width="4" filter="drop-shadow(0 0 10px #2dd4bf)" />
        </g>
      </svg>
    </div>
    <div class="visual-glow purple-glow" style="opacity: 0.15;"></div>
  `;

  return (
    <div 
      ref={containerRef}
      className=""
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ width: '100%', height: '100%' }} 
    />
  );
}
