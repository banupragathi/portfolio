import React, { useEffect, useRef, useState } from 'react';

export default function NetraVisual() {
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
      .nt-svg-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
      .nt-svg { width: 100%; height: 100%; overflow: visible; }
      
      /* Global Core Glow */
      @keyframes nt-core-glow { 0%, 15% { filter: drop-shadow(0 0 10px #bd93f9); fill: #151129; } 25%, 30% { filter: drop-shadow(0 0 40px #ff7e33); fill: rgba(255,126,51,0.2); } 40%, 85% { filter: drop-shadow(0 0 35px #3399ff); fill: rgba(51,153,255,0.15); } 95%, 100% { filter: drop-shadow(0 0 10px #bd93f9); fill: #151129; } }
      .nt-core-base { animation: nt-core-glow 16s infinite; }
      
      /* Incoming Pulse Sequence */
      @keyframes nt-pulse-in { 0%, 10% { stroke-dashoffset: 400; opacity: 0; } 11% { opacity: 1; stroke-dashoffset: 400; } 17% { opacity: 1; stroke-dashoffset: -60; } 18%, 100% { opacity: 0; stroke-dashoffset: -100; } }
      .nt-pulse-in { animation: nt-pulse-in 16s ease-out infinite; }
      
      @keyframes nt-pulse-to-core { 0%, 17% { stroke-dashoffset: 400; opacity: 0; } 18% { opacity: 1; stroke-dashoffset: 400; } 24% { opacity: 1; stroke-dashoffset: -60; } 25%, 100% { opacity: 0; stroke-dashoffset: -100; } }
      .nt-pulse-to-core { animation: nt-pulse-to-core 16s ease-in infinite; }

      /* Scanning Waves */
      @keyframes nt-scan-wave { 0%, 25% { transform: scale(1); opacity: 0; stroke-width: 4px; } 26% { opacity: 0.6; transform: scale(1); stroke-width: 4px; } 35% { opacity: 0; transform: scale(4); stroke-width: 1px; } 36%, 100% { opacity: 0; transform: scale(1); } }
      .nt-scan-wave { animation: nt-scan-wave 16s ease-out infinite; transform-origin: 400px 250px; }
      .nt-scan-wave2 { animation: nt-scan-wave 16s ease-out infinite; transform-origin: 400px 250px; animation-delay: 0.5s; }
      
      /* Pathway Draw */
      @keyframes nt-path-activate { 0%, 32% { stroke-dashoffset: 200; opacity: 0; } 33% { opacity: 1; stroke-dashoffset: 200; } 40%, 90% { stroke-dashoffset: 0; opacity: 1; } 95%, 100% { stroke-dashoffset: -200; opacity: 0; } }
      .nt-path-draw use { stroke-dasharray: 200; animation: nt-path-activate 16s ease-in-out infinite; }

      /* Node Borders */
      @keyframes nt-node-glow { 0%, 38% { stroke: #4a3e7a; filter: drop-shadow(0 0 0px #bd93f9); } 45%, 85% { stroke: #3399ff; filter: drop-shadow(0 0 15px rgba(51,153,255,0.6)); } 95%, 100% { stroke: #4a3e7a; filter: drop-shadow(0 0 0px #bd93f9); } }
      @keyframes nt-node-glow-emerg { 0%, 20% { stroke: #4a3e7a; filter: drop-shadow(0 0 0px #ff7e33); } 25%, 85% { stroke: #ff7e33; filter: drop-shadow(0 0 20px rgba(255,126,51,0.8)); } 95%, 100% { stroke: #4a3e7a; filter: drop-shadow(0 0 0px #ff7e33); } }
      
      .nt-node-bg { fill: rgba(15,12,31,0.85); stroke: #4a3e7a; stroke-width: 1.5; animation: nt-node-glow 16s infinite; }
      .bg-emerg { animation: nt-node-glow-emerg 16s infinite; }

      /* Particles Continuous Flow */
      @keyframes nt-flow-dash { to { stroke-dashoffset: -40; } }
      @keyframes nt-particle-fade { 0%, 45% { opacity: 0; } 50%, 85% { opacity: 1; } 90%, 100% { opacity: 0; } }
      .nt-particle-flow { animation: nt-particle-fade 16s infinite; }
      .nt-particle-flow use { stroke-dasharray: 4 36; animation: nt-flow-dash 1.5s linear infinite; filter: drop-shadow(0 0 6px #ffffff); }

      /* Spinning Rings */
      @keyframes nt-spin-cw { 100% { transform: rotate(360deg); } }
      @keyframes nt-spin-ccw { 100% { transform: rotate(-360deg); } }
      .a-spin-cw { animation: nt-spin-cw 20s linear infinite; transform-origin: 400px 250px; }
      .a-spin-ccw { animation: nt-spin-ccw 25s linear infinite; transform-origin: 400px 250px; }
      .a-spin-cw-slow { animation: nt-spin-cw 40s linear infinite; transform-origin: 400px 250px; }

      /* Synchronization Heartbeat */
      @keyframes nt-heartbeat { 0%, 80% { transform: scale(1); } 82% { transform: scale(1.05); filter: drop-shadow(0 0 30px #3399ff); } 85% { transform: scale(1); } 88% { transform: scale(1.03); filter: drop-shadow(0 0 20px #3399ff); } 91%, 100% { transform: scale(1); } }
      .a-heartbeat { animation: nt-heartbeat 16s infinite; transform-origin: 400px 250px; }
    </style>

    <div class="nt-svg-container">
      <svg class="nt-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <polygon id="nt-node-poly" points="15,0 115,0 130,15 130,65 115,80 15,80 0,65 0,15" />
          
          <g id="nt-base-paths" fill="none" stroke="#4a3e7a" stroke-width="2" stroke-linecap="round">
            <path id="nt-p-top" d="M400,210 L400,120" />
            <path id="nt-p-left" d="M360,250 C320,250 280,190 245,190" />
            <path id="nt-p-bleft" d="M370,280 C340,340 295,340 250,340" />
            <path id="nt-p-right" d="M440,250 C480,250 520,190 555,190" />
            <path id="nt-p-bright" d="M430,280 C460,340 505,340 550,340" />
          </g>
        </defs>

        <!-- Abstract Decorative Dashboards -->
        <g opacity="0.3" stroke="#3399ff" stroke-width="1.5" fill="none">
          <rect x="20" y="80" width="80" height="30" rx="4" />
          <line x1="30" y1="90" x2="60" y2="90" />
          <line x1="30" y1="100" x2="80" y2="100" />
          
          <rect x="20" y="380" width="100" height="50" rx="4" />
          <circle cx="40" cy="405" r="10" />
          <line x1="60" y1="395" x2="100" y2="395" />
          <line x1="60" y1="405" x2="90" y2="405" />
          <line x1="60" y1="415" x2="110" y2="415" />
          
          <rect x="690" y="100" width="90" height="40" rx="4" />
          <line x1="700" y1="110" x2="740" y2="110" />
          <line x1="700" y1="125" x2="770" y2="125" />
          
          <rect x="710" y="320" width="70" height="90" rx="4" />
          <line x1="720" y1="335" x2="760" y2="335" />
          <line x1="720" y1="355" x2="750" y2="355" />
          <line x1="720" y1="375" x2="770" y2="375" />
          <line x1="720" y1="395" x2="740" y2="395" />
        </g>

        <!-- Base Pathways -->
        <use href="#nt-base-paths" opacity="0.5" />

        <!-- External Pulse (Incoming Patient) -->
        <path d="M-20,190 L115,190" fill="none" stroke="#ff7e33" stroke-width="3" stroke-dasharray="60 400" class="nt-pulse-in" stroke-linecap="round" filter="drop-shadow(0 0 10px #ff7e33)" />
        <!-- Internal Pulse to Core -->
        <path d="M245,190 C280,190 320,250 360,250" fill="none" stroke="#ff7e33" stroke-width="3" stroke-dasharray="60 400" class="nt-pulse-to-core" stroke-linecap="round" filter="drop-shadow(0 0 10px #ff7e33)" />

        <!-- Activated Pathways -->
        <g fill="none" stroke="#3399ff" stroke-width="3" stroke-linecap="round" filter="drop-shadow(0 0 8px #3399ff)" class="nt-path-draw">
          <use href="#nt-p-top" />
          <use href="#nt-p-left" />
          <use href="#nt-p-bleft" />
          <use href="#nt-p-right" />
          <use href="#nt-p-bright" />
        </g>

        <!-- Data Particles Flow -->
        <g class="nt-particle-flow" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round">
          <use href="#nt-p-top" />
          <use href="#nt-p-left" />
          <use href="#nt-p-bleft" />
          <use href="#nt-p-right" />
          <use href="#nt-p-bright" />
        </g>

        <!-- Center Core Rings -->
        <g class="nt-core-rings">
          <circle cx="400" cy="250" r="55" fill="none" stroke="#bd93f9" stroke-width="2" stroke-dasharray="8 4" class="a-spin-cw" />
          <circle cx="400" cy="250" r="70" fill="none" stroke="#3399ff" stroke-width="1.5" stroke-dasharray="12 6 4 6" class="a-spin-ccw" />
          <circle cx="400" cy="250" r="90" fill="none" stroke="#4a3e7a" stroke-width="1.5" stroke-dasharray="2 12" class="a-spin-cw-slow" />
          
          <!-- Scanning Waves -->
          <circle cx="400" cy="250" r="45" fill="none" stroke="#bd93f9" class="nt-scan-wave" />
          <circle cx="400" cy="250" r="45" fill="none" stroke="#3399ff" class="nt-scan-wave2" />
        </g>

        <!-- Core Heartbeat Group -->
        <g class="nt-core a-heartbeat">
          <circle cx="400" cy="250" r="45" fill="#151129" stroke="#bd93f9" stroke-width="2" class="nt-core-base" />
          <g stroke="#e2d4ff" stroke-width="1.5" fill="none" transform="translate(388, 220)">
            <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" opacity="0.1"/>
            <path d="M12 4v16 M8 8h8 M8 12h8 M8 16h8 M4 12h16" opacity="0.3" />
            <path d="M9 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0z" />
          </g>
          <text x="400" y="255" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="2">NETRA</text>
          <text x="400" y="270" font-size="7" fill="#3399ff" text-anchor="middle" letter-spacing="1">AI CORE</text>
        </g>

        <!-- Nodes -->
        <!-- Top (Patient Flow) -->
        <g transform="translate(335, 40)" class="nt-node-group">
          <use href="#nt-node-poly" class="nt-node-bg" />
          <g class="nt-node-icon" stroke="#e2d4ff" stroke-width="1.5" fill="none" transform="translate(53, 13)">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </g>
          <text x="65" y="55" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="1">PATIENT FLOW</text>
          <text x="65" y="68" font-size="7" fill="#a092d6" text-anchor="middle">Intelligent Routing</text>
        </g>

        <!-- Left (Emergency Services) -->
        <g transform="translate(115, 150)" class="nt-node-group">
          <use href="#nt-node-poly" class="nt-node-bg bg-emerg" />
          <g class="nt-node-icon" stroke="#e2d4ff" stroke-width="1.5" fill="none" transform="translate(53, 13)">
            <path d="M1 10V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v6l4 2v5h-3" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
            <path d="M11 6v6 M8 9h6" />
          </g>
          <text x="65" y="55" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="1">EMERGENCY SVCS</text>
          <text x="65" y="68" font-size="7" fill="#a092d6" text-anchor="middle">Rapid Response</text>
        </g>

        <!-- Bottom Left (Medical Staff) -->
        <g transform="translate(185, 340)" class="nt-node-group">
          <use href="#nt-node-poly" class="nt-node-bg" />
          <g class="nt-node-icon" stroke="#e2d4ff" stroke-width="1.5" fill="none" transform="translate(53, 13)">
            <path d="M16 21v-2a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M8 12v4 M6 14h4" stroke="#3399ff" />
          </g>
          <text x="65" y="55" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="1">MEDICAL STAFF</text>
          <text x="65" y="68" font-size="7" fill="#a092d6" text-anchor="middle">Optimal Coordination</text>
        </g>

        <!-- Right (Bed Allocation) -->
        <g transform="translate(555, 150)" class="nt-node-group">
          <use href="#nt-node-poly" class="nt-node-bg" />
          <g class="nt-node-icon" stroke="#e2d4ff" stroke-width="1.5" fill="none" transform="translate(53, 13)">
            <path d="M2 4v16 M22 12v8 M2 12h20 M6 8h4v4H6z M14 12v-2a2 2 0 0 1 2-2h6" />
          </g>
          <text x="65" y="55" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="1">BED ALLOCATION</text>
          <text x="65" y="68" font-size="7" fill="#a092d6" text-anchor="middle">Smart Assignment</text>
        </g>

        <!-- Bottom Right (Hospital Depts) -->
        <g transform="translate(485, 340)" class="nt-node-group">
          <use href="#nt-node-poly" class="nt-node-bg" />
          <g class="nt-node-icon" stroke="#e2d4ff" stroke-width="1.5" fill="none" transform="translate(53, 13)">
            <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16 M9 21v-6h6v6" />
            <path d="M9 7h6 M12 4v6" stroke="#3399ff" />
          </g>
          <text x="65" y="55" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="1">DEPARTMENTS</text>
          <text x="65" y="68" font-size="7" fill="#a092d6" text-anchor="middle">Connected Ecosystem</text>
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
