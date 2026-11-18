import React, { useEffect, useRef, useState } from 'react';

export default function RootlyticVisual() {
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
      .rt-svg-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
      .rt-svg { width: 100%; height: 100%; overflow: visible; }
      
      /* Global and Core */
      @keyframes rt-global { 0%, 95% { opacity: 1; } 98%, 100% { opacity: 0; } }
      .a-rtglob { animation: rt-global 15s infinite; }
      
      @keyframes rt-bg-glow { 0%, 8% { opacity: 0; } 12%, 85% { opacity: 0.15; } 90%, 95% { opacity: 0.25; filter: blur(30px); } 100% { opacity: 0; } }
      .rt-core-glow-bg { animation: rt-bg-glow 15s infinite; filter: blur(20px); }
      
      @keyframes rt-core-glow { 0%, 8% { filter: drop-shadow(0 0 0px #bd93f9); } 12%, 85% { filter: drop-shadow(0 0 20px #bd93f9); } 90%, 95% { filter: drop-shadow(0 0 40px #bd93f9); } 100% { filter: drop-shadow(0 0 0px #bd93f9); } }
      @keyframes rt-hex-trace { 0%, 5% { stroke-dashoffset: 700; opacity: 0; } 6% { opacity: 1; stroke-dashoffset: 700; } 15%, 100% { stroke-dashoffset: 0; opacity: 1; } }
      .rt-hex-main { stroke: #bd93f9; stroke-width: 2.5; fill: rgba(15,12,31,0.9); stroke-dasharray: 700; animation: rt-hex-trace 15s ease-out infinite, rt-core-glow 15s infinite; }
      
      @keyframes rt-text-fade { 0%, 10% { opacity: 0; filter: blur(4px); } 15%, 95% { opacity: 1; filter: blur(0px); } 100% { opacity: 0; } }
      .rt-core-text { animation: rt-text-fade 15s infinite; }
      
      /* Circuit Waking Lines */
      .rt-base-line { stroke: #4a3e7a; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .rt-active-line { stroke: #bd93f9; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 6px #bd93f9); }
      
      @keyframes rt-path1 { 0%, 10% { stroke-dashoffset: 150; } 15%, 100% { stroke-dashoffset: 0; } }
      @keyframes rt-path2 { 0%, 12% { stroke-dashoffset: 150; } 17%, 100% { stroke-dashoffset: 0; } }
      @keyframes rt-path3 { 0%, 14% { stroke-dashoffset: 150; } 19%, 100% { stroke-dashoffset: 0; } }
      @keyframes rt-path4 { 0%, 16% { stroke-dashoffset: 150; } 21%, 100% { stroke-dashoffset: 0; } }
      @keyframes rt-path5 { 0%, 18% { stroke-dashoffset: 150; } 23%, 100% { stroke-dashoffset: 0; } }
      
      .al-top { stroke-dasharray: 150; animation: rt-path5 15s ease-out infinite; }
      .al-left { stroke-dasharray: 150; animation: rt-path1 15s ease-out infinite; }
      .al-bleft { stroke-dasharray: 150; animation: rt-path2 15s ease-out infinite; }
      .al-right { stroke-dasharray: 150; animation: rt-path3 15s ease-out infinite; }
      .al-bright { stroke-dasharray: 150; animation: rt-path4 15s ease-out infinite; }

      /* Module Waking & Breathing */
      .rt-mod-bg { fill: rgba(15,12,31,0.85); stroke: #4a3e7a; stroke-width: 1.5; }
      @keyframes rt-mod-breathe { 0%, 25% { filter: drop-shadow(0 0 0px #bd93f9); stroke: #4a3e7a; } 30%, 80% { filter: drop-shadow(0 0 8px rgba(189,147,249,0.3)); stroke: #bd93f9; } 85%, 95% { filter: drop-shadow(0 0 15px rgba(189,147,249,0.8)); stroke: #fff; } 100% { filter: drop-shadow(0 0 0px #bd93f9); stroke: #4a3e7a; } }
      
      @keyframes rt-mod-left { 0%, 15% { opacity: 0; filter: blur(4px); transform: scale(0.95); } 18%, 100% { opacity: 1; filter: blur(0px); transform: scale(1); } }
      @keyframes rt-mod-bleft { 0%, 17% { opacity: 0; filter: blur(4px); transform: scale(0.95); } 20%, 100% { opacity: 1; filter: blur(0px); transform: scale(1); } }
      @keyframes rt-mod-right { 0%, 19% { opacity: 0; filter: blur(4px); transform: scale(0.95); } 22%, 100% { opacity: 1; filter: blur(0px); transform: scale(1); } }
      @keyframes rt-mod-bright { 0%, 21% { opacity: 0; filter: blur(4px); transform: scale(0.95); } 24%, 100% { opacity: 1; filter: blur(0px); transform: scale(1); } }
      @keyframes rt-mod-top { 0%, 23% { opacity: 0; filter: blur(4px); transform: scale(0.95); } 26%, 100% { opacity: 1; filter: blur(0px); transform: scale(1); } }

      .rt-m-left { animation: rt-mod-left 15s infinite, rt-mod-breathe 15s infinite; transform-origin: 150px 180px; }
      .rt-m-bleft { animation: rt-mod-bleft 15s infinite, rt-mod-breathe 15s infinite; transform-origin: 150px 320px; }
      .rt-m-right { animation: rt-mod-right 15s infinite, rt-mod-breathe 15s infinite; transform-origin: 650px 180px; }
      .rt-m-bright { animation: rt-mod-bright 15s infinite, rt-mod-breathe 15s infinite; transform-origin: 650px 320px; }
      .rt-m-top { animation: rt-mod-top 15s infinite, rt-mod-breathe 15s infinite; transform-origin: 400px 65px; }

      /* Particles */
      @keyframes rt-particles-fade { 0%, 25% { opacity: 0; } 30%, 95% { opacity: 1; } 100% { opacity: 0; } }
      .rt-particles-layer { animation: rt-particles-fade 15s infinite; }
      
      @keyframes rt-flow-dash { from { stroke-dashoffset: 34; } to { stroke-dashoffset: 0; } }
      @keyframes rt-flow-dash-rev { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 44; } }
      @keyframes rt-flow-dash-orange { from { stroke-dashoffset: 54; } to { stroke-dashoffset: 0; } }

      .rt-particle-blue { stroke: #3399ff; stroke-width: 2.5; fill: none; stroke-dasharray: 4 30; animation: rt-flow-dash 1s linear infinite; filter: drop-shadow(0 0 6px #3399ff); }
      .rt-particle-purple { stroke: #bd93f9; stroke-width: 2.5; fill: none; stroke-dasharray: 4 40; animation: rt-flow-dash-rev 1.5s linear infinite; filter: drop-shadow(0 0 6px #bd93f9); }
      .rt-particle-orange { stroke: #ff7e33; stroke-width: 2.5; fill: none; stroke-dasharray: 4 50; animation: rt-flow-dash-orange 2s linear infinite; filter: drop-shadow(0 0 6px #ff7e33); }

      /* Traversal Sequence */
      @keyframes rt-traversal { 0%, 65% { stroke-dashoffset: 600; opacity: 0; } 66% { opacity: 1; stroke-dashoffset: 600; } 75% { opacity: 1; stroke-dashoffset: -100; filter: drop-shadow(0 0 15px #ff7e33); } 76%, 100% { stroke-dashoffset: -100; opacity: 0; } }
      .rt-trav-line { stroke: #ff7e33; stroke-width: 5; fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100 600; animation: rt-traversal 15s linear infinite; filter: drop-shadow(0 0 8px #ff7e33); }

      /* Architecture Scan */
      @keyframes rt-scan { 0%, 80% { transform: translateX(0); opacity: 0; } 81% { opacity: 0.5; transform: translateX(0px); } 88% { opacity: 0.5; transform: translateX(800px); } 89%, 100% { opacity: 0; transform: translateX(850px); } }
      .a-scan { animation: rt-scan 15s linear infinite; }
    </style>

    <div class="rt-svg-container">
      <svg class="rt-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3399ff" stop-opacity="0" />
            <stop offset="90%" stop-color="#3399ff" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#3399ff" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        <g class="a-rtglob">
          <!-- Decorative Background Lines -->
          <g stroke="#4a3e7a" stroke-width="1.5" fill="none" opacity="0.25">
            <path d="M100,100 L150,100 L180,130" /><circle cx="100" cy="100" r="2" fill="#4a3e7a" />
            <path d="M120,80 L200,80 L220,100 L220,130" /><circle cx="120" cy="80" r="2" fill="#4a3e7a" />
            <path d="M700,100 L650,100 L620,130" /><circle cx="700" cy="100" r="2" fill="#4a3e7a" />
            <path d="M680,80 L600,80 L580,100 L580,130" />
            <path d="M100,400 L150,400 L180,370" /><circle cx="100" cy="400" r="2" fill="#4a3e7a" />
            <path d="M120,420 L200,420 L220,400 L220,370" />
            <path d="M700,400 L650,400 L620,370" /><circle cx="700" cy="400" r="2" fill="#4a3e7a" />
            <path d="M680,420 L600,420 L580,400 L580,370" />
            <path d="M650,215 L650,285" stroke-dasharray="4 4" />
          </g>

          <!-- Base Circuits -->
          <path d="M400,155 L400,100" class="rt-base-line" />
          <path d="M317.5,202.5 L290,180 L220,180" class="rt-base-line" />
          <path d="M317.5,297.5 L290,320 L220,320" class="rt-base-line" />
          <path d="M482.5,202.5 L510,180 L580,180" class="rt-base-line" />
          <path d="M482.5,297.5 L510,320 L580,320" class="rt-base-line" />

          <!-- Activated Circuits -->
          <path d="M400,155 L400,100" class="rt-active-line al-top" />
          <path d="M317.5,202.5 L290,180 L220,180" class="rt-active-line al-left" />
          <path d="M317.5,297.5 L290,320 L220,320" class="rt-active-line al-bleft" />
          <path d="M482.5,202.5 L510,180 L580,180" class="rt-active-line al-right" />
          <path d="M482.5,297.5 L510,320 L580,320" class="rt-active-line al-bright" />

          <!-- Particle Flows -->
          <g class="rt-particles-layer">
            <path d="M400,155 L400,100" class="rt-particle-blue" />
            <path d="M317.5,202.5 L290,180 L220,180" class="rt-particle-purple" />
            <path d="M317.5,297.5 L290,320 L220,320" class="rt-particle-orange" />
            <path d="M482.5,202.5 L510,180 L580,180" class="rt-particle-blue" />
            <path d="M482.5,297.5 L510,320 L580,320" class="rt-particle-purple" />
          </g>

          <!-- Traversal Pulse -->
          <path d="M400,100 L400,250 L482.5,202.5 L510,180 L650,180 L650,285" class="rt-trav-line" />

          <!-- Center Hexagon Engine -->
          <circle cx="400" cy="250" r="100" fill="#3399ff" class="rt-core-glow-bg" />
          <polygon points="290,250 345,155 455,155 510,250 455,345 345,345" class="rt-hex-main" />
          <polygon points="315,250 357.5,176.4 442.5,176.4 485,250 442.5,323.6 357.5,323.6" fill="none" stroke="#3399ff" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.6" />
          <g class="rt-core-text">
            <text x="400" y="245" font-size="22" fill="#fff" text-anchor="middle" font-weight="700" letter-spacing="4" font-family="monospace">ROOTLYTIC</text>
            <text x="400" y="265" font-size="10" fill="#3399ff" text-anchor="middle" font-weight="600" letter-spacing="4" font-family="monospace">ARCHITECTURE ENGINE</text>
          </g>

          <!-- Left Module: Graph Processor -->
          <g class="rt-m-left">
            <rect x="80" y="145" width="140" height="70" rx="8" class="rt-mod-bg" />
            <text x="150" y="200" font-size="9" fill="#a092d6" text-anchor="middle" font-weight="600" letter-spacing="1" font-family="monospace">GRAPH PROCESSOR</text>
            <g stroke="#3399ff" stroke-width="1.5" fill="none">
              <path d="M135,165 L165,165 L150,150 Z" />
              <path d="M135,165 L150,180 L165,165" />
              <circle cx="135" cy="165" r="3" fill="#151129" />
              <circle cx="165" cy="165" r="3" fill="#151129" />
              <circle cx="150" cy="150" r="3" fill="#151129" />
              <circle cx="150" cy="180" r="3" fill="#151129" />
            </g>
            <!-- Small Pill -->
            <rect x="235" y="185" width="50" height="16" rx="4" fill="#0b0914" stroke="#4a3e7a" stroke-width="1" />
            <text x="260" y="195" font-size="7" fill="#ff7e33" text-anchor="middle" font-weight="bold" letter-spacing="1" font-family="monospace">ANALYZE</text>
          </g>

          <!-- Bottom-Left Module: Cycle Detector -->
          <g class="rt-m-bleft">
            <rect x="80" y="285" width="140" height="70" rx="8" class="rt-mod-bg" />
            <text x="150" y="340" font-size="9" fill="#a092d6" text-anchor="middle" font-weight="600" letter-spacing="1" font-family="monospace">CYCLE DETECTOR</text>
            <g stroke="#ff7e33" stroke-width="2" fill="none">
              <path d="M150,295 A12,12 0 1,1 138,307" />
              <polygon points="150,295 145,290 155,290" fill="#ff7e33" stroke="none" />
            </g>
            <rect x="235" y="325" width="50" height="16" rx="4" fill="#0b0914" stroke="#4a3e7a" stroke-width="1" />
            <text x="260" y="335" font-size="7" fill="#3399ff" text-anchor="middle" font-weight="bold" letter-spacing="1" font-family="monospace">RESOLVE</text>
          </g>

          <!-- Right Module: Hierarchy Builder -->
          <g class="rt-m-right">
            <rect x="580" y="145" width="140" height="70" rx="8" class="rt-mod-bg" />
            <text x="650" y="200" font-size="9" fill="#a092d6" text-anchor="middle" font-weight="600" letter-spacing="1" font-family="monospace">HIERARCHY BUILDER</text>
            <g stroke="#bd93f9" stroke-width="1.5" fill="none">
              <path d="M650,155 L635,175 M650,155 L665,175 M650,155 L650,175" />
              <circle cx="650" cy="155" r="3" fill="#151129" />
              <circle cx="635" cy="175" r="3" fill="#151129" />
              <circle cx="665" cy="175" r="3" fill="#151129" />
              <circle cx="650" cy="175" r="3" fill="#151129" />
            </g>
            <rect x="510" y="185" width="60" height="16" rx="4" fill="#0b0914" stroke="#4a3e7a" stroke-width="1" />
            <text x="540" y="195" font-size="7" fill="#bd93f9" text-anchor="middle" font-weight="bold" letter-spacing="1" font-family="monospace">STRUCTURE</text>
          </g>

          <!-- Bottom-Right Module: Visualization Engine -->
          <g class="rt-m-bright">
            <rect x="580" y="285" width="140" height="70" rx="8" class="rt-mod-bg" />
            <text x="650" y="340" font-size="9" fill="#a092d6" text-anchor="middle" font-weight="600" letter-spacing="1" font-family="monospace">VISUALIZATION ENGINE</text>
            <g fill="#bd93f9">
              <rect x="635" y="315" width="4" height="10" rx="1" />
              <rect x="645" y="305" width="4" height="20" rx="1" />
              <rect x="655" y="295" width="4" height="30" rx="1" />
            </g>
            <rect x="515" y="325" width="50" height="16" rx="4" fill="#0b0914" stroke="#4a3e7a" stroke-width="1" />
            <text x="540" y="335" font-size="7" fill="#3399ff" text-anchor="middle" font-weight="bold" letter-spacing="1" font-family="monospace">RENDER</text>
          </g>

          <!-- Top Module: Root Layer -->
          <g class="rt-m-top">
            <rect x="330" y="30" width="140" height="70" rx="8" class="rt-mod-bg" />
            <text x="400" y="85" font-size="9" fill="#a092d6" text-anchor="middle" font-weight="600" letter-spacing="1" font-family="monospace">ROOT LAYER</text>
            <g stroke="#3399ff" stroke-width="1.5" fill="none">
              <path d="M400,42 l10,5 l0,10 l-10,5 l-10,-5 l0,-10 z" />
              <path d="M400,42 l0,10 M390,47 l10,5 M410,47 l-10,5" />
            </g>
            <rect x="445" y="115" width="45" height="16" rx="4" fill="#0b0914" stroke="#4a3e7a" stroke-width="1" />
            <text x="467.5" y="125" font-size="7" fill="#bd93f9" text-anchor="middle" font-weight="bold" letter-spacing="1" font-family="monospace">LEVEL 0</text>
          </g>

          <!-- Architecture Scan -->
          <g class="a-scan" pointer-events="none">
            <rect x="-100" y="0" width="100" height="500" fill="url(#scan-grad)" />
            <line x1="0" y1="0" x2="0" y2="500" stroke="#3399ff" stroke-width="2" filter="drop-shadow(0 0 5px #3399ff)" />
          </g>
        </g>
      </svg>
    </div>
    <div class="visual-glow blue-glow" style="opacity: 0.1;"></div>
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
