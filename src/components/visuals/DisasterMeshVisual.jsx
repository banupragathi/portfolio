// src/components/visuals/DisasterMeshVisual.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function DisasterMeshVisual() {
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
      .dm-svg-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: transparent; }
      .dm-svg { width: 100%; height: 100%; overflow: visible; }
      
      /* Master Loop Fade */
      @keyframes dm-loop { 
        0%, 88% { opacity: 1; } 
        94%, 100% { opacity: 0; } 
      }
      .a-dm-loop { animation: dm-loop 14s infinite; }

      /* High-Contrast City Grid & Map Styling */
      .dm-road-base { 
        stroke: #252244; 
        stroke-width: 24; 
        stroke-linecap: round; 
        stroke-linejoin: round; 
        fill: none; 
      }
      .dm-road-edge { 
        stroke: #5d548f; 
        stroke-width: 1.5; 
        fill: none; 
      }
      .dm-road-center { 
        stroke: #9d93cc; 
        stroke-width: 1.2; 
        stroke-dasharray: 6 5; 
        fill: none; 
        opacity: 0.8;
      }
      .dm-building { 
        fill: #191632; 
        stroke: #4d447a; 
        stroke-width: 1.4; 
        rx: 4; 
      }
      .dm-building-accent { 
        fill: #221d42; 
        stroke: #6c5fa6; 
        stroke-width: 1.5; 
        rx: 4; 
      }

      /* Emergency Distress Pulse at Incident Site */
      @keyframes dm-distress-ping {
        0% { r: 8px; opacity: 0.95; stroke-width: 3px; }
        60% { r: 42px; opacity: 0; stroke-width: 0.8px; }
        100% { r: 42px; opacity: 0; }
      }
      .a-distress-ring1 { animation: dm-distress-ping 2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite; }
      .a-distress-ring2 { animation: dm-distress-ping 2s cubic-bezier(0.2, 0.8, 0.4, 1) 0.8s infinite; }

      /* Active Ambulance Dispatch Route Line Draw */
      @keyframes dm-route-draw {
        0%, 14% { stroke-dashoffset: 350; opacity: 0; }
        16% { opacity: 1; stroke-dashoffset: 350; }
        62%, 86% { stroke-dashoffset: 0; opacity: 1; }
        92%, 100% { stroke-dashoffset: 0; opacity: 0; }
      }
      .a-route-path {
        animation: dm-route-draw 14s ease-out infinite;
        stroke: #00f0ff;
        stroke-width: 3.5;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 350;
        fill: none;
        filter: drop-shadow(0 0 8px #00f0ff) drop-shadow(0 0 16px rgba(0, 240, 255, 0.8));
      }

      /* Ambulance Vehicle Driving Movement */
      @keyframes dm-ambulance-move {
        0%, 15% { transform: translate(75px, 130px) rotate(0deg); opacity: 1; }
        32% { transform: translate(190px, 130px) rotate(0deg); }
        36% { transform: translate(210px, 150px) rotate(90deg); }
        48% { transform: translate(210px, 220px) rotate(90deg); }
        52% { transform: translate(230px, 240px) rotate(0deg); }
        63%, 86% { transform: translate(305px, 240px) rotate(0deg); opacity: 1; }
        92%, 100% { transform: translate(305px, 240px) rotate(0deg); opacity: 0; }
      }
      .a-ambulance {
        animation: dm-ambulance-move 14s cubic-bezier(0.3, 0, 0.2, 1) infinite;
      }

      /* Flashing Emergency Lightbars */
      @keyframes dm-flash-red { 0%, 49% { fill: #ef4444; filter: drop-shadow(0 0 8px #ef4444); } 50%, 100% { fill: #450a0a; filter: none; } }
      @keyframes dm-flash-blue { 0%, 49% { fill: #0284c7; filter: none; } 50%, 100% { fill: #00f0ff; filter: drop-shadow(0 0 8px #00f0ff); } }
      .a-beacon-red { animation: dm-flash-red 0.4s infinite; }
      .a-beacon-blue { animation: dm-flash-blue 0.4s infinite; }

      /* Drone Aerial Reconnaissance Node */
      @keyframes dm-drone-hover {
        0%, 26% { transform: scale(0); opacity: 0; }
        32%, 86% { transform: scale(1); opacity: 1; }
        92%, 100% { transform: scale(0); opacity: 0; }
      }
      .a-drone-node { 
        animation: dm-drone-hover 14s ease-out infinite; 
        transform-origin: 0 0;
      }

      /* Secondary Mesh Network Lines */
      @keyframes dm-mesh-reveal {
        0%, 35% { opacity: 0; }
        42%, 86% { opacity: 1; }
        92%, 100% { opacity: 0; }
      }
      .a-mesh-links { animation: dm-mesh-reveal 14s ease-in-out infinite; }
      .dm-mesh-line { 
        stroke: rgba(56, 189, 248, 0.4); 
        stroke-width: 1.2; 
        stroke-dasharray: 4 3; 
        fill: none; 
      }

      /* Mesh Data Flow */
      @keyframes dm-packet-flow {
        0%, 38% { stroke-dashoffset: 80; opacity: 0; }
        40% { opacity: 1; stroke-dashoffset: 80; }
        86% { stroke-dashoffset: -120; opacity: 1; }
        90%, 100% { opacity: 0; }
      }
      .a-mesh-packets {
        animation: dm-packet-flow 14s linear infinite;
        stroke: #38bdf8;
        stroke-width: 2;
        stroke-dasharray: 4 30;
        fill: none;
        filter: drop-shadow(0 0 5px #38bdf8);
      }

      /* Rescue Responders Pop-in */
      @keyframes dm-responder-scale {
        0%, 42% { transform: scale(0); opacity: 0; }
        46%, 86% { transform: scale(1); opacity: 1; }
        92%, 100% { transform: scale(0); opacity: 0; }
      }
      .a-responder-node { 
        animation: dm-responder-scale 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; 
        transform-origin: 0 0; 
      }

      /* Triage Victim Assistance Status */
      @keyframes dm-triage-change {
        0%, 20% { opacity: 0; }
        24%, 60% { fill: #ef4444; stroke: #ffffff; opacity: 0.95; }
        64%, 86% { fill: #10b981; stroke: #ffffff; opacity: 1; }
        92%, 100% { opacity: 0; }
      }
      .a-triage-marker { animation: dm-triage-change 14s ease-out infinite; }

      /* Emergency Resolved Shield Glow */
      @keyframes dm-stabilized-glow {
        0%, 60% { opacity: 0; transform: scale(0.6); }
        65%, 86% { opacity: 1; transform: scale(1); }
        92%, 100% { opacity: 0; }
      }
      .a-stabilized-zone {
        animation: dm-stabilized-glow 14s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        transform-origin: 330px 240px;
      }

      /* Status Header Messaging */
      @keyframes dm-status-alert { 0%, 22% { opacity: 1; } 26%, 100% { opacity: 0; } }
      @keyframes dm-status-enroute { 0%, 25% { opacity: 0; } 30%, 59% { opacity: 1; } 63%, 100% { opacity: 0; } }
      @keyframes dm-status-stabilized { 0%, 62% { opacity: 0; } 66%, 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
      .a-status-1 { animation: dm-status-alert 14s ease-out infinite; }
      .a-status-2 { animation: dm-status-enroute 14s ease-out infinite; }
      .a-status-3 { animation: dm-status-stabilized 14s ease-out infinite; }

      .dm-header-text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
        font-size: 10px;
        letter-spacing: 1.5px;
        font-weight: 700;
      }
      .dm-label-text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
        font-size: 8.5px;
        font-weight: 700;
        letter-spacing: 0.8px;
      }
      .dm-label-pill {
        fill: rgba(18, 14, 38, 0.9);
        stroke: rgba(139, 92, 246, 0.5);
        stroke-width: 0.9;
        rx: 3.5;
      }
    </style>

    <div class="dm-svg-container">
      <svg class="dm-svg" viewBox="0 0 520 380" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        
        <g class="a-dm-loop">
          
          <!-- Tactical Status Header -->
          <g>
            <text x="260" y="28" text-anchor="middle" class="dm-header-text a-status-1" fill="#ff4d4d" style="filter: drop-shadow(0 0 6px rgba(255, 77, 77, 0.9));">
              ▲ SECTOR 04 INCIDENT DETECTED // SOS BROADCAST ACTIVE
            </text>
            <text x="260" y="28" text-anchor="middle" class="dm-header-text a-status-2" fill="#00f0ff" style="filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.9));">
              ➔ AMBULANCE UNIT-01 DISPATCHED // MESH ROUTE OPTIMIZED
            </text>
            <text x="260" y="28" text-anchor="middle" class="dm-header-text a-status-3" fill="#ffffff" style="filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));">
              ✓ RESCUE OPERATION COORDINATED // PATIENTS STABILIZED
            </text>
          </g>

          <!-- High-Contrast Urban Road Network -->
          <g>
            <!-- Road Asphalt Corridors (Wide lavender-gray road beds) -->
            <line x1="35" y1="130" x2="485" y2="130" class="dm-road-base" />
            <line x1="35" y1="240" x2="485" y2="240" class="dm-road-base" />
            
            <line x1="75" y1="45" x2="75" y2="345" class="dm-road-base" />
            <line x1="210" y1="45" x2="210" y2="345" class="dm-road-base" />
            <line x1="330" y1="45" x2="330" y2="345" class="dm-road-base" />
            <line x1="450" y1="45" x2="450" y2="345" class="dm-road-base" />

            <!-- Crisp Curbs / Road Edges -->
            <line x1="35" y1="118" x2="485" y2="118" class="dm-road-edge" />
            <line x1="35" y1="142" x2="485" y2="142" class="dm-road-edge" />
            <line x1="35" y1="228" x2="485" y2="228" class="dm-road-edge" />
            <line x1="35" y1="252" x2="485" y2="252" class="dm-road-edge" />

            <line x1="63" y1="45" x2="63" y2="345" class="dm-road-edge" />
            <line x1="87" y1="45" x2="87" y2="345" class="dm-road-edge" />
            <line x1="198" y1="45" x2="198" y2="345" class="dm-road-edge" />
            <line x1="222" y1="45" x2="222" y2="345" class="dm-road-edge" />
            <line x1="318" y1="45" x2="318" y2="345" class="dm-road-edge" />
            <line x1="342" y1="45" x2="342" y2="345" class="dm-road-edge" />
            <line x1="438" y1="45" x2="438" y2="345" class="dm-road-edge" />
            <line x1="462" y1="45" x2="462" y2="345" class="dm-road-edge" />

            <!-- Dashed Road Centerlines -->
            <line x1="35" y1="130" x2="485" y2="130" class="dm-road-center" />
            <line x1="35" y1="240" x2="485" y2="240" class="dm-road-center" />
            <line x1="75" y1="45" x2="75" y2="345" class="dm-road-center" />
            <line x1="210" y1="45" x2="210" y2="345" class="dm-road-center" />
            <line x1="330" y1="45" x2="330" y2="345" class="dm-road-center" />
            <line x1="450" y1="45" x2="450" y2="345" class="dm-road-center" />
          </g>

          <!-- Urban Building Footprints (High Contrast Architectural Blocks) -->
          <g>
            <!-- Row 1: Top City Blocks -->
            <rect x="98" y="55" width="42" height="52" class="dm-building" />
            <rect x="146" y="55" width="42" height="52" class="dm-building-accent" />
            <rect x="230" y="55" width="78" height="52" class="dm-building" />
            <rect x="350" y="55" width="78" height="52" class="dm-building-accent" />

            <!-- Row 2: Middle City Blocks -->
            <rect x="98" y="152" width="90" height="66" class="dm-building" />
            <rect x="230" y="152" width="78" height="66" class="dm-building-accent" />
            <!-- Incident Zone Impact Area -->
            <rect x="350" y="152" width="38" height="32" class="dm-building" />
            <rect x="394" y="152" width="34" height="66" class="dm-building" />

            <!-- Row 3: Bottom City Blocks -->
            <rect x="98" y="262" width="90" height="64" class="dm-building" />
            <rect x="230" y="262" width="78" height="64" class="dm-building" />
            <rect x="350" y="262" width="78" height="64" class="dm-building-accent" />
          </g>

          <!-- Dispatch Base / Emergency Medical Center at (75, 130) -->
          <g transform="translate(75, 130)">
            <circle cx="0" cy="0" r="16" fill="#15112e" stroke="#00f0ff" stroke-width="1.8" style="filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.8));" />
            <!-- Medical Cross Emblem -->
            <path d="M-6,0 L6,0 M0,-6 L0,6" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
            
            <!-- High-Contrast Label Pill -->
            <g transform="translate(0, 26)">
              <rect x="-30" y="-8" width="60" height="15" class="dm-label-pill" />
              <text x="0" y="3" text-anchor="middle" class="dm-label-text" fill="#00f0ff">DISPATCH</text>
            </g>
          </g>

          <!-- Emergency Incident Site at (330, 240) -->
          <g transform="translate(330, 240)">
            <!-- Pulsing Emergency Distress Radar Rings -->
            <circle cx="0" cy="0" r="16" fill="none" stroke="#ef4444" class="a-distress-ring1" />
            <circle cx="0" cy="0" r="16" fill="none" stroke="#ef4444" class="a-distress-ring2" />
            
            <!-- Stabilized Shield Aura (Reveals upon successful rescue) -->
            <circle cx="0" cy="0" r="30" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" stroke-width="2" stroke-dasharray="5 3" class="a-stabilized-zone" style="filter: drop-shadow(0 0 14px rgba(0, 240, 255, 0.8));" />

            <!-- Central Emergency Hazard Hexagon -->
            <polygon points="0,-12 11,-6 11,6 0,12 -11,6 -11,-6" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" style="filter: drop-shadow(0 0 10px rgba(220, 38, 38, 1));" />
            <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="900" fill="#ffffff">!</text>
            
            <!-- High-Contrast Incident Label Pill -->
            <g transform="translate(0, 26)">
              <rect x="-36" y="-8" width="72" height="15" class="dm-label-pill" stroke="#ef4444" />
              <text x="0" y="3" text-anchor="middle" class="dm-label-text" fill="#ff4d4d">ZONE 04 SOS</text>
            </g>
          </g>

          <!-- Aerial Reconnaissance Drone at (310, 105) -->
          <g transform="translate(310, 105)">
            <g class="a-drone-node">
              <!-- Scan Spotlight Cone toward Incident -->
              <polygon points="0,0 12,125 32,125" fill="rgba(0, 240, 255, 0.1)" />
              
              <!-- Drone Vehicle Body -->
              <circle cx="0" cy="0" r="7" fill="#15112e" stroke="#00f0ff" stroke-width="1.5" style="filter: drop-shadow(0 0 6px #00f0ff);" />
              <line x1="-9" y1="-9" x2="9" y2="9" stroke="#00f0ff" stroke-width="1.2" />
              <line x1="-9" y1="9" x2="9" y2="-9" stroke="#00f0ff" stroke-width="1.2" />
              <!-- 4 Rotors -->
              <circle cx="-9" cy="-9" r="3.2" fill="none" stroke="#e2d4ff" stroke-width="1" />
              <circle cx="9" cy="-9" r="3.2" fill="none" stroke="#e2d4ff" stroke-width="1" />
              <circle cx="-9" cy="9" r="3.2" fill="none" stroke="#e2d4ff" stroke-width="1" />
              <circle cx="9" cy="9" r="3.2" fill="none" stroke="#e2d4ff" stroke-width="1" />
              
              <!-- Drone Label Pill -->
              <g transform="translate(0, -18)">
                <rect x="-36" y="-8" width="72" height="15" class="dm-label-pill" />
                <text x="0" y="3" text-anchor="middle" class="dm-label-text" fill="#c4b5fd">DRONE RECON</text>
              </g>
            </g>
          </g>

          <!-- Decentralized Mesh Network Connections (Subdued Secondary Lines) -->
          <g class="a-mesh-links">
            <!-- Line: Dispatch to Drone -->
            <path d="M75,130 L310,105" class="dm-mesh-line" />
            <!-- Line: Drone to Incident -->
            <path d="M310,105 L330,240" class="dm-mesh-line" />
            <!-- Line: Incident to Team Alpha -->
            <path d="M330,240 L430,175" class="dm-mesh-line" />
            <!-- Line: Incident to Team Bravo -->
            <path d="M330,240 L410,300" class="dm-mesh-line" />

            <!-- Continuous Data Packets flowing over Mesh -->
            <path d="M75,130 L310,105 M310,105 L330,240 M330,240 L430,175 M330,240 L410,300" class="a-mesh-packets" />
          </g>

          <!-- Field Rescue Responders: Team Alpha & Team Bravo (Properly Contained Inside ViewBox) -->
          <!-- Team Alpha at (430, 175) -->
          <g transform="translate(430, 175)">
            <g class="a-responder-node">
              <circle cx="0" cy="0" r="11" fill="#15112e" stroke="#00f0ff" stroke-width="1.5" style="filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.7));" />
              <!-- Medic / Rescue Shield Icon -->
              <path d="M-4,-3 L4,-3 L4,2 L0,5 L-4,2 Z" fill="#00f0ff" />
              
              <!-- Label Pill -->
              <g transform="translate(0, 20)">
                <rect x="-34" y="-8" width="68" height="15" class="dm-label-pill" />
                <text x="0" y="3" text-anchor="middle" class="dm-label-text" fill="#e2d4ff">TEAM ALPHA</text>
              </g>
            </g>
          </g>

          <!-- Team Bravo at (410, 300) -->
          <g transform="translate(410, 300)">
            <g class="a-responder-node">
              <circle cx="0" cy="0" r="11" fill="#15112e" stroke="#00f0ff" stroke-width="1.5" style="filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.7));" />
              <!-- Medic / Rescue Shield Icon -->
              <path d="M-4,-3 L4,-3 L4,2 L0,5 L-4,2 Z" fill="#00f0ff" />
              
              <!-- Label Pill -->
              <g transform="translate(0, 20)">
                <rect x="-34" y="-8" width="68" height="15" class="dm-label-pill" />
                <text x="0" y="3" text-anchor="middle" class="dm-label-text" fill="#e2d4ff">TEAM BRAVO</text>
              </g>
            </g>
          </g>

          <!-- Assisted Victim / Triage Markers near Incident Site -->
          <g transform="translate(352, 222)">
            <circle cx="0" cy="0" r="4.5" class="a-triage-marker" stroke-width="1.5" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>
          <g transform="translate(315, 260)">
            <circle cx="0" cy="0" r="4.5" class="a-triage-marker" stroke-width="1.5" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          <!-- High-Visibility Active Ambulance Route Line -->
          <!-- Traces from (75,130) -> (190,130) -> (210,150) -> (210,220) -> (230,240) -> (310,240) -->
          <path d="M75,130 L190,130 Q210,130 210,150 L210,220 Q210,240 230,240 L310,240" class="a-route-path" />

          <!-- High-Contrast Miniature Ambulance Vehicle -->
          <g class="a-ambulance">
            <!-- Vehicle Chassis Shadow -->
            <rect x="-18" y="-10" width="36" height="20" rx="5" fill="rgba(0,0,0,0.8)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))" />
            <!-- Dark Wheels / Tires Silhouettes -->
            <rect x="-14" y="-12" width="7" height="3" rx="1.5" fill="#0a0817" />
            <rect x="7" y="-12" width="7" height="3" rx="1.5" fill="#0a0817" />
            <rect x="-14" y="9" width="7" height="3" rx="1.5" fill="#0a0817" />
            <rect x="7" y="9" width="7" height="3" rx="1.5" fill="#0a0817" />

            <!-- Solid Medical White Vehicle Body -->
            <rect x="-16" y="-9" width="32" height="18" rx="4.5" fill="#ffffff" stroke="#00f0ff" stroke-width="1" style="filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));" />
            
            <!-- Dark Front Windshield -->
            <path d="M8,-6.5 L12,-6.5 Q14,-6.5 14,-3 L14,3 Q14,6.5 12,6.5 L8,6.5 Z" fill="#0f172a" />
            
            <!-- Side Red Emergency Stripes -->
            <line x1="-15" y1="-8.5" x2="7" y2="-8.5" stroke="#ef4444" stroke-width="2.2" />
            <line x1="-15" y1="8.5" x2="7" y2="8.5" stroke="#ef4444" stroke-width="2.2" />
            
            <!-- Red Medical Cross on Roof -->
            <path d="M-4,-4 L2,-4 M-1,-7 L-1,-1" stroke="#ef4444" stroke-width="2.4" stroke-linecap="round" />
            
            <!-- Flashing Emergency Beacon Lightbars on Cab -->
            <circle cx="5" cy="-3" r="2" class="a-beacon-red" />
            <circle cx="5" cy="3" r="2" class="a-beacon-blue" />
          </g>

        </g>
      </svg>
    </div>
    <div class="visual-glow purple-glow" style="opacity: 0.05;"></div>
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
