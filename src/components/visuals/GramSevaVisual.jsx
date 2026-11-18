// src/components/visuals/GramSevaVisual.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function GramSevaVisual() {
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
      .gs-svg-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: transparent; }
      .gs-svg { width: 100%; height: 100%; overflow: visible; }
      
      /* Master Loop Fade */
      @keyframes gs-loop { 
        0%, 88% { opacity: 1; } 
        94%, 100% { opacity: 0; } 
      }
      .a-gs-loop { animation: gs-loop 14s infinite; }

      /* Source Record A: Revenue Cadastre (Skewed/Offset Lavender) */
      @keyframes gs-rev-align { 
        0%, 14% { transform: translate(-14px, -9px) rotate(-1.5deg); opacity: 0.85; } 
        34%, 55% { transform: translate(0, 0) rotate(0deg); opacity: 0.35; } 
        60%, 100% { opacity: 0; transform: translate(0, 0); } 
      }
      .a-rev-record { 
        animation: gs-rev-align 14s cubic-bezier(0.25, 1, 0.5, 1) infinite; 
        transform-origin: 250px 190px; 
        stroke: #e2d4ff; 
        stroke-width: 1.2; 
        stroke-dasharray: 6 3; 
        fill: rgba(226, 212, 255, 0.02); 
      }

      /* Source Record B: Municipal GIS Survey (Displaced Cyan) */
      @keyframes gs-mun-align { 
        0%, 14% { transform: translate(12px, 8px) rotate(1.8deg); opacity: 0.85; } 
        34%, 55% { transform: translate(0, 0) rotate(0deg); opacity: 0.35; } 
        60%, 100% { opacity: 0; transform: translate(0, 0); } 
      }
      .a-mun-record { 
        animation: gs-mun-align 14s cubic-bezier(0.25, 1, 0.5, 1) infinite; 
        transform-origin: 250px 190px; 
        stroke: #38bdf8; 
        stroke-width: 1.2; 
        stroke-dasharray: 4 4; 
        fill: rgba(56, 189, 248, 0.02); 
      }

      /* Unified Cadastral Map (Appears & Solidifies) */
      @keyframes gs-unified-fade { 
        0%, 20% { opacity: 0; } 
        32%, 88% { opacity: 1; } 
        94%, 100% { opacity: 0; } 
      }
      .a-unified-plat { animation: gs-unified-fade 14s ease-out infinite; }

      .gs-parcel-base { 
        stroke: #e2d4ff; 
        stroke-width: 1.5; 
        fill: rgba(226, 212, 255, 0.03); 
        stroke-linejoin: round; 
        stroke-linecap: round; 
        filter: drop-shadow(0 0 4px rgba(226, 212, 255, 0.35)); 
      }

      /* Road / Survey Baseline */
      .gs-road { 
        stroke: rgba(160, 146, 214, 0.3); 
        stroke-width: 1; 
        fill: none; 
        stroke-dasharray: 5 4; 
      }
      .gs-road-edge { 
        stroke: rgba(160, 146, 214, 0.5); 
        stroke-width: 1.2; 
        fill: none; 
      }

      /* Target Parcel 105: Verified Harmonization Highlight */
      @keyframes gs-target-focus { 
        0%, 36% { 
          fill: rgba(56, 189, 248, 0.03); 
          stroke: #e2d4ff; 
          stroke-width: 1.5; 
          filter: drop-shadow(0 0 4px rgba(226, 212, 255, 0.4)); 
        } 
        46%, 78% { 
          fill: rgba(56, 189, 248, 0.22); 
          stroke: #38bdf8; 
          stroke-width: 2.5; 
          filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 28px rgba(56, 189, 248, 0.4)); 
        } 
        84%, 88% { 
          fill: rgba(56, 189, 248, 0.03); 
          stroke: #e2d4ff; 
          stroke-width: 1.5; 
          filter: drop-shadow(0 0 4px rgba(226, 212, 255, 0.4)); 
        } 
        94%, 100% { opacity: 0; } 
      }
      .a-target-parcel { animation: gs-target-focus 14s ease-in-out infinite; }

      /* Verification Pulse Wave from Harmonized Parcel */
      @keyframes gs-verify-pulse { 
        0%, 46% { transform: scale(0.4); opacity: 0; stroke-width: 3px; } 
        48% { opacity: 0.9; transform: scale(0.5); stroke-width: 2px; } 
        58% { opacity: 0; transform: scale(2.2); stroke-width: 0.5px; } 
        59%, 100% { opacity: 0; transform: scale(0.4); } 
      }
      .a-verify-pulse { 
        animation: gs-verify-pulse 14s ease-out infinite; 
        transform-origin: 255px 195px; 
        stroke: #38bdf8; 
        fill: none; 
      }

      /* Verified Stamp Badge (Restrained Burgundy Accent) */
      @keyframes gs-verified-badge { 
        0%, 48% { transform: scale(0); opacity: 0; } 
        52%, 78% { transform: scale(1); opacity: 1; } 
        84%, 100% { transform: scale(0); opacity: 0; } 
      }
      .a-verified-badge { 
        animation: gs-verified-badge 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; 
        transform-origin: 255px 195px; 
      }

      /* Corner Survey Intersection Pins */
      @keyframes gs-pins-pop { 
        0%, 30% { transform: scale(0); opacity: 0; } 
        35%, 88% { transform: scale(1); opacity: 1; } 
        94%, 100% { transform: scale(0); opacity: 0; } 
      }
      .a-survey-pins { animation: gs-pins-pop 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
      
      .gs-pin-dot { 
        fill: #151129; 
        stroke: #38bdf8; 
        stroke-width: 1.5; 
        filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.7)); 
      }
      .gs-pin-center { fill: #ffffff; }

      /* Technical Status Header Text */
      @keyframes gs-status-conflict { 
        0%, 30% { opacity: 0.9; } 
        36%, 100% { opacity: 0; } 
      }
      @keyframes gs-status-harmonized { 
        0%, 36% { opacity: 0; } 
        42%, 82% { opacity: 1; } 
        88%, 100% { opacity: 0; } 
      }
      .a-status-conflict { animation: gs-status-conflict 14s ease-out infinite; }
      .a-status-harmonized { animation: gs-status-harmonized 14s ease-out infinite; }

      .gs-plat-label { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; 
        font-size: 8px; 
        letter-spacing: 1.5px; 
        font-weight: 600; 
        fill: #a092d6; 
      }
      .gs-lot-number { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; 
        font-size: 9px; 
        font-weight: 700; 
        fill: rgba(226, 212, 255, 0.55); 
        text-anchor: middle; 
      }
      .gs-dim-text { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; 
        font-size: 6.5px; 
        letter-spacing: 0.8px; 
        fill: rgba(56, 189, 248, 0.6); 
        text-anchor: middle; 
      }
    </style>

    <div class="gs-svg-container">
      <svg class="gs-svg" viewBox="0 0 500 380" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        
        <g class="a-gs-loop">
          
          <!-- Technical Status Banner at Top -->
          <g>
            <text x="250" y="32" text-anchor="middle" class="gs-plat-label a-status-conflict" fill="#e2d4ff">
              • MULTI-SOURCE CADASTRAL OVERLAY : DISCORDANT BOUNDARIES •
            </text>
            <text x="250" y="32" text-anchor="middle" class="gs-plat-label a-status-harmonized" fill="#38bdf8" style="filter: drop-shadow(0 0 6px rgba(56,189,248,0.8));">
              ✓ CADASTRAL HARMONIZATION COMPLETE : UNIFIED PLAT MAP
            </text>
          </g>

          <!-- North Survey Access Road / Baseline -->
          <g opacity="0.7">
            <path d="M85,55 C180,48 320,45 425,60" class="gs-road-edge" />
            <path d="M85,63 C180,56 320,53 425,68" class="gs-road" />
            <path d="M85,71 C180,64 320,61 425,76" class="gs-road-edge" />
            <text x="250" y="58" text-anchor="middle" font-size="6" fill="#a092d6" letter-spacing="3" opacity="0.6">NORTH ACCESS ROAD // SURVEY BASELINE</text>
          </g>

          <!-- Source Record A: Revenue Department Cadastre (Lavender Skewed Layer) -->
          <g class="a-rev-record">
            <!-- Interlocking Parcel Boundaries -->
            <polygon points="110,85 210,80 205,160 105,165" />
            <polygon points="210,80 310,75 305,155 205,160" />
            <polygon points="310,75 400,90 395,165 305,155" />
            <polygon points="105,165 205,160 200,235 115,240" />
            <polygon points="205,160 305,155 315,235 200,235" />
            <polygon points="305,155 395,165 385,245 315,235" />
            <polygon points="115,240 200,235 210,305 125,300" />
            <polygon points="200,235 315,235 310,310 210,305" />
            <polygon points="315,235 385,245 375,315 310,310" />
          </g>

          <!-- Source Record B: Municipal GIS Survey (Cyan Displaced Layer) -->
          <g class="a-mun-record">
            <!-- Interlocking Parcel Boundaries -->
            <polygon points="110,85 210,80 205,160 105,165" />
            <polygon points="210,80 310,75 305,155 205,160" />
            <polygon points="310,75 400,90 395,165 305,155" />
            <polygon points="105,165 205,160 200,235 115,240" />
            <polygon points="205,160 305,155 315,235 200,235" />
            <polygon points="305,155 395,165 385,245 315,235" />
            <polygon points="115,240 200,235 210,305 125,300" />
            <polygon points="200,235 315,235 310,310 210,305" />
            <polygon points="315,235 385,245 375,315 310,310" />
          </g>

          <!-- Unified Harmonized Land Map Plat -->
          <g class="a-unified-plat">
            
            <!-- Neighboring Property Parcels -->
            <!-- Plot 101 -->
            <polygon points="110,85 210,80 205,160 105,165" class="gs-parcel-base" />
            <text x="157" y="127" class="gs-lot-number">101</text>
            
            <!-- Plot 102 -->
            <polygon points="210,80 310,75 305,155 205,160" class="gs-parcel-base" />
            <text x="257" y="122" class="gs-lot-number">102</text>
            
            <!-- Plot 103 -->
            <polygon points="310,75 400,90 395,165 305,155" class="gs-parcel-base" />
            <text x="352" y="125" class="gs-lot-number">103</text>
            
            <!-- Plot 104 -->
            <polygon points="105,165 205,160 200,235 115,240" class="gs-parcel-base" />
            <text x="157" y="204" class="gs-lot-number">104</text>
            
            <!-- Plot 106 -->
            <polygon points="305,155 395,165 385,245 315,235" class="gs-parcel-base" />
            <text x="352" y="204" class="gs-lot-number">106</text>
            
            <!-- Plot 107 -->
            <polygon points="115,240 200,235 210,305 125,300" class="gs-parcel-base" />
            <text x="162" y="275" class="gs-lot-number">107</text>
            
            <!-- Plot 108 -->
            <polygon points="200,235 315,235 310,310 210,305" class="gs-parcel-base" />
            <text x="257" y="275" class="gs-lot-number">108</text>
            
            <!-- Plot 109 -->
            <polygon points="315,235 385,245 375,315 310,310" class="gs-parcel-base" />
            <text x="347" y="280" class="gs-lot-number">109</text>

            <!-- Verification Pulse Wave expanding from Harmonized Parcel 105 -->
            <circle cx="255" cy="195" r="45" class="a-verify-pulse" />

            <!-- Prime Target Parcel 105 (Central Harmonized Lot) -->
            <polygon points="205,160 305,155 315,235 200,235" class="a-target-parcel gs-parcel-base" />
            <text x="255" y="177" class="gs-lot-number" style="fill: #38bdf8;">105</text>
            <text x="255" y="222" class="gs-dim-text">0.42 Ha • CONFIDENCE 99.8%</text>

            <!-- Verified Stamp Badge (Restrained Burgundy Accent inside Parcel 105) -->
            <g class="a-verified-badge" transform="translate(255, 195)">
              <!-- Hexagonal Geodetic Stamp -->
              <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#be123c" stroke="#ffffff" stroke-width="1" filter="drop-shadow(0 0 6px rgba(190,18,60,0.8))" />
              <!-- Verification Checkmark Symbol -->
              <polyline points="-4,0 -1,3 4,-3" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </g>

            <!-- Corner Survey Boundary Intersections (Geodetic Markers) -->
            <g class="a-survey-pins">
              <!-- Node P1 -->
              <g transform="translate(205, 160)">
                <circle cx="0" cy="0" r="3.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1.2" class="gs-pin-center" />
              </g>
              <!-- Node P2 -->
              <g transform="translate(305, 155)">
                <circle cx="0" cy="0" r="3.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1.2" class="gs-pin-center" />
              </g>
              <!-- Node P3 -->
              <g transform="translate(200, 235)">
                <circle cx="0" cy="0" r="3.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1.2" class="gs-pin-center" />
              </g>
              <!-- Node P4 -->
              <g transform="translate(315, 235)">
                <circle cx="0" cy="0" r="3.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1.2" class="gs-pin-center" />
              </g>
              <!-- Peripheral Pins -->
              <g transform="translate(105, 165)">
                <circle cx="0" cy="0" r="2.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1" class="gs-pin-center" />
              </g>
              <g transform="translate(395, 165)">
                <circle cx="0" cy="0" r="2.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1" class="gs-pin-center" />
              </g>
              <g transform="translate(115, 240)">
                <circle cx="0" cy="0" r="2.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1" class="gs-pin-center" />
              </g>
              <g transform="translate(385, 245)">
                <circle cx="0" cy="0" r="2.5" class="gs-pin-dot" />
                <circle cx="0" cy="0" r="1" class="gs-pin-center" />
              </g>
            </g>

          </g>

        </g>
      </svg>
    </div>
    <div class="visual-glow purple-glow" style="opacity: 0.15;"></div>
  `;

  return (
    <div 
      ref={containerRef}
      className={isActive ? '' : 'visual-paused'}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ width: '100%', height: '100%' }} 
    />
  );
}
