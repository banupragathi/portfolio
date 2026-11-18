// src/components/visuals/NinaivuVisual.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function NinaivuVisual() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => setIsActive(e.isIntersecting)); },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={isActive ? '' : 'nin-paused'}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'transparent'
      }}
    >
      <style>{`
        .nin-paused * { animation-play-state: paused !important; }

        /* ── Master Pipeline Animation (7.5s Loop) ── */
        @keyframes nin-brain-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(192,132,252,0.6)); transform: scale(1); }
          15% { filter: drop-shadow(0 0 18px rgba(226,212,255,1)) drop-shadow(0 0 32px rgba(168,85,247,0.7)); transform: scale(1.03); }
          30% { filter: drop-shadow(0 0 8px rgba(192,132,252,0.6)); transform: scale(1); }
        }
        .a-brain-glow {
          animation: nin-brain-pulse 7.5s ease-in-out infinite;
          transform-origin: 0px 0px;
        }

        /* Sulci shimmer */
        @keyframes nin-sulci-wave {
          0%, 100% { stroke: #c084fc; }
          15% { stroke: #ffffff; }
          30% { stroke: #c084fc; }
        }
        .a-sulcus { animation: nin-sulci-wave 7.5s ease-in-out infinite; }

        /* Signal flows */
        @keyframes nin-flow-1 {
          0%, 10% { offset-distance: 0%; opacity: 0; }
          14% { opacity: 1; }
          28% { offset-distance: 100%; opacity: 0.9; }
          34%, 100% { opacity: 0; }
        }
        @keyframes nin-flow-2 {
          0%, 28% { offset-distance: 0%; opacity: 0; }
          34% { opacity: 1; }
          52% { offset-distance: 100%; opacity: 0.9; }
          58%, 100% { opacity: 0; }
        }
        @keyframes nin-flow-3 {
          0%, 54% { offset-distance: 0%; opacity: 0; }
          60% { opacity: 1; }
          78% { offset-distance: 100%; opacity: 0.9; }
          84%, 100% { opacity: 0; }
        }

        /* Survey card highlight */
        @keyframes nin-survey-active {
          0%, 20% { stroke: rgba(192,132,252,0.4); }
          28%, 46% { stroke: #00f0ff; filter: drop-shadow(0 0 10px rgba(0,240,255,0.4)); }
          54%, 100% { stroke: rgba(192,132,252,0.4); }
        }
        .a-survey-box { animation: nin-survey-active 7.5s ease-in-out infinite; }

        @keyframes nin-ans-highlight {
          0%, 22% { fill: rgba(30,27,75,0.7); stroke: rgba(192,132,252,0.4); }
          30%, 48% { fill: rgba(0,240,255,0.25); stroke: #00f0ff; }
          56%, 100% { fill: rgba(30,27,75,0.7); stroke: rgba(192,132,252,0.4); }
        }
        .a-ans-btn { animation: nin-ans-highlight 7.5s ease-in-out infinite; }

        /* Game tiles highlight */
        @keyframes nin-tile-1 {
          0%, 46% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
          52%, 66% { stroke: #00f0ff; fill: rgba(0,240,255,0.18); filter: drop-shadow(0 0 8px rgba(0,240,255,0.6)); }
          72%, 100% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
        }
        @keyframes nin-tile-2 {
          0%, 50% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
          56%, 68% { stroke: #e2d4ff; fill: rgba(226,212,255,0.18); filter: drop-shadow(0 0 8px rgba(226,212,255,0.6)); }
          74%, 100% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
        }
        @keyframes nin-tile-3 {
          0%, 54% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
          60%, 70% { stroke: #00f0ff; fill: rgba(0,240,255,0.18); filter: drop-shadow(0 0 8px rgba(0,240,255,0.6)); }
          76%, 100% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
        }
        @keyframes nin-tile-4 {
          0%, 58% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
          64%, 72% { stroke: #c084fc; fill: rgba(192,132,252,0.22); filter: drop-shadow(0 0 8px rgba(192,132,252,0.6)); }
          78%, 100% { stroke: rgba(192,132,252,0.4); fill: rgba(22,18,52,0.85); }
        }
        .a-tile-1 { animation: nin-tile-1 7.5s ease-in-out infinite; }
        .a-tile-2 { animation: nin-tile-2 7.5s ease-in-out infinite; }
        .a-tile-3 { animation: nin-tile-3 7.5s ease-in-out infinite; }
        .a-tile-4 { animation: nin-tile-4 7.5s ease-in-out infinite; }

        /* Score Gauge */
        @keyframes nin-score-glow {
          0%, 68% { filter: drop-shadow(0 0 4px rgba(0,240,255,0.4)); }
          76%, 94% { filter: drop-shadow(0 0 16px rgba(0,240,255,0.95)) drop-shadow(0 0 26px rgba(0,240,255,0.5)); }
          100% { filter: drop-shadow(0 0 4px rgba(0,240,255,0.4)); }
        }
        .a-score-group { animation: nin-score-glow 7.5s ease-in-out infinite; }

        @keyframes nin-score-dial {
          0%, 68% { stroke-dashoffset: 176; }
          80%, 96% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 176; }
        }
        .a-gauge-fill {
          stroke-dasharray: 176;
          animation: nin-score-dial 7.5s ease-out infinite;
        }

        /* Flow path dashing */
        @keyframes nin-dash-flow {
          to { stroke-dashoffset: -20; }
        }
        .a-flow-path {
          stroke-dasharray: 4 3;
          animation: nin-dash-flow 1.5s linear infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 580 325"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="n-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a0612" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="n-score-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="n-panel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(28,22,64,0.92)" />
            <stop offset="100%" stopColor="rgba(14,10,32,0.96)" />
          </linearGradient>
          <filter id="n-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── TOP PIPELINE HEADER ── */}
        <g transform="translate(0, 22)">
          <rect x="45" y="-14" width="490" height="24" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(192,132,252,0.25)" strokeWidth="1" />
          <text x="290" y="2" textAnchor="middle" fontFamily="'Inter', -apple-system, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2.2" fill="#e2d4ff">
            BRAIN <tspan fill="#00f0ff"> → </tspan> SURVEY <tspan fill="#00f0ff"> → </tspan> GAMES <tspan fill="#00f0ff"> → </tspan> RISK SCORE
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════
             STAGE 1: BRAIN ICON (EXACT REFERENCE DESIGN)
             Position: Center (105, 160)
             Iconic top-down view with rounded scallops & internal sulci loops
             ══════════════════════════════════════════════════════════ */}
        <circle cx="105" cy="160" r="66" fill="url(#n-halo)" />

        {/* Outer group provides the translation so CSS transform does NOT clobber coordinates */}
        <g transform="translate(105, 160)">
          <g className="a-brain-glow" filter="url(#n-glow)">
            {/* ── RIGHT HEMISPHERE OUTLINE ──
                 5 outer rounded lobe scallops: Top, Upper-Lat, Mid-Lat, Lower-Lat, Bottom */}
            <path
              d="
                M 0 -62
                C 14 -64, 28 -56, 32 -42
                C 44 -42, 54 -28, 50 -12
                C 58 -4, 58 14, 48 24
                C 54 36, 44 50, 32 54
                C 24 62, 10 64, 0 64
              "
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* ── LEFT HEMISPHERE OUTLINE (Symmetrical Mirror) ── */}
            <path
              d="
                M 0 -62
                C -14 -64, -28 -56, -32 -42
                C -44 -42, -54 -28, -50 -12
                C -58 -4, -58 14, -48 24
                C -54 36, -44 50, -32 54
                C -24 62, -10 64, 0 64
              "
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* ── Center Dividing Cleft ── */}
            <line
              x1="0"
              y1="-60"
              x2="0"
              y2="62"
              stroke="#e2d4ff"
              strokeWidth="3.4"
              strokeLinecap="round"
            />

            {/* ── RIGHT HEMISPHERE INTERNAL SULCI (Exact Reference Shapes) ── */}
            {/* Top Sulcus Hook */}
            <path
              className="a-sulcus"
              d="M 6 -38 C 18 -42, 28 -32, 24 -18 C 22 -10, 14 -8, 8 -12"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Mid horizontal branch from cleft */}
            <path
              className="a-sulcus"
              d="M 5 -4 C 16 -4, 28 -8, 32 -18"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Middle outer C-loop hooking inward */}
            <path
              className="a-sulcus"
              d="M 44 8 C 32 10, 20 6, 16 18 C 12 28, 22 36, 32 36"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Lower bottom hook */}
            <path
              className="a-sulcus"
              d="M 5 26 C 14 26, 22 32, 20 46 C 18 54, 8 56, 4 54"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />

            {/* ── LEFT HEMISPHERE INTERNAL SULCI (Mirror) ── */}
            {/* Top Sulcus Hook */}
            <path
              className="a-sulcus"
              d="M -6 -38 C -18 -42, -28 -32, -24 -18 C -22 -10, -14 -8, -8 -12"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Mid horizontal branch from cleft */}
            <path
              className="a-sulcus"
              d="M -5 -4 C -16 -4, -28 -8, -32 -18"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Middle outer C-loop hooking inward */}
            <path
              className="a-sulcus"
              d="M -44 8 C -32 10, -20 6, -16 18 C -12 28, -22 36, -32 36"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Lower bottom hook */}
            <path
              className="a-sulcus"
              d="M -5 26 C -14 26, -22 32, -20 46 C -18 54, -8 56, -4 54"
              fill="none"
              stroke="#c084fc"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Stage 1 Title Tag */}
        <g transform="translate(105, 256)">
          <rect x="-42" y="-14" width="84" height="24" rx="6" fill="rgba(30,24,68,0.85)" stroke="#c084fc" strokeWidth="1.2" />
          <text x="0" y="2" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="11" fontWeight="800" fill="#ffffff" letterSpacing="1">
            BRAIN
          </text>
          <text x="0" y="20" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="600" fill="#a78bfa" letterSpacing="0.6">
            NEURAL SCAN
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════
             CONNECTOR 1: Brain → Survey
             ══════════════════════════════════════════════════════════ */}
        <path
          className="a-flow-path"
          d="M 160 160 C 172 160, 178 156, 186 156"
          fill="none"
          stroke="#c084fc"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle r="4.5" fill="#00f0ff" style={{ offsetPath: "path('M 160 160 C 172 160, 178 156, 186 156')", animation: 'nin-flow-1 7.5s linear infinite', filter: 'drop-shadow(0 0 6px #00f0ff)' }} />

        {/* ══════════════════════════════════════════════════════════
             STAGE 2: COGNITIVE SURVEY CARD (HIGH CONTRAST & CLEAR)
             Position: x=186, y=82, width=132, height=148
             ══════════════════════════════════════════════════════════ */}
        <g transform="translate(186, 82)">
          <rect
            className="a-survey-box"
            x="0"
            y="0"
            width="132"
            height="148"
            rx="10"
            fill="url(#n-panel-bg)"
            stroke="#a78bfa"
            strokeWidth="1.6"
          />

          {/* Header strip */}
          <rect x="0" y="0" width="132" height="28" rx="10" fill="rgba(167,139,250,0.12)" />
          <path d="M 0 18 L 0 28 L 132 28 L 132 18 Z" fill="rgba(167,139,250,0.12)" />
          <circle cx="14" cy="14" r="4" fill="#00f0ff" />
          <text x="24" y="18" fontFamily="'Inter', sans-serif" fontSize="10.5" fontWeight="800" fill="#ffffff" letterSpacing="0.8">
            COGNITIVE Q&A
          </text>

          {/* Question 1 */}
          <text x="10" y="44" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="700" fill="#e2d4ff">
            Recall 3 words?
          </text>
          <g transform="translate(10, 52)">
            <rect className="a-ans-btn" x="0" y="0" width="34" height="20" rx="4" fill="rgba(30,27,75,0.7)" stroke="#a78bfa" strokeWidth="1.2" />
            <text x="17" y="14" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill="#ffffff">
              YES
            </text>

            <rect x="39" y="0" width="34" height="20" rx="4" fill="rgba(20,16,42,0.6)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
            <text x="56" y="14" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="600" fill="#94a3b8">
              NO
            </text>

            <rect x="78" y="0" width="34" height="20" rx="4" fill="rgba(20,16,42,0.6)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
            <text x="95" y="14" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="600" fill="#94a3b8">
              PART
            </text>
          </g>

          {/* Question 2 */}
          <text x="10" y="90" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="700" fill="#e2d4ff">
            Clock Drawing:
          </text>
          <g transform="translate(10, 98)">
            <rect x="0" y="0" width="112" height="22" rx="5" fill="rgba(0,240,255,0.12)" stroke="#00f0ff" strokeWidth="1.2" />
            <circle cx="14" cy="11" r="6" fill="none" stroke="#00f0ff" strokeWidth="1.4" />
            <path d="M 14 7 L 14 11 L 17 11" fill="none" stroke="#00f0ff" strokeWidth="1.2" strokeLinecap="round" />
            <text x="26" y="15" fontFamily="'Inter', monospace" fontSize="9.5" fontWeight="800" fill="#00f0ff" letterSpacing="0.5">
              PASSED  ✓
            </text>
          </g>

          {/* Progress Indicator */}
          <rect x="10" y="132" width="112" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
          <rect x="10" y="132" width="88" height="5" rx="2.5" fill="#00f0ff" />
        </g>

        {/* Stage 2 Title Tag */}
        <g transform="translate(252, 256)">
          <rect x="-44" y="-14" width="88" height="24" rx="6" fill="rgba(30,24,68,0.85)" stroke="#c084fc" strokeWidth="1.2" />
          <text x="0" y="2" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="11" fontWeight="800" fill="#ffffff" letterSpacing="1">
            SURVEY
          </text>
          <text x="0" y="20" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="600" fill="#a78bfa" letterSpacing="0.6">
            CLINICAL TESTS
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════
             CONNECTOR 2: Survey → Games
             ══════════════════════════════════════════════════════════ */}
        <path
          className="a-flow-path"
          d="M 318 156 C 328 156, 334 150, 342 150"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle r="4.5" fill="#e2d4ff" style={{ offsetPath: "path('M 318 156 C 328 156, 334 150, 342 150')", animation: 'nin-flow-2 7.5s linear infinite', filter: 'drop-shadow(0 0 6px #e2d4ff)' }} />

        {/* ══════════════════════════════════════════════════════════
             STAGE 3: BRAIN TRAINING GAMES (2×2 CRISP TILES)
             Position: x=342, y=82, width=96, height=148
             ══════════════════════════════════════════════════════════ */}
        <g transform="translate(342, 82)">
          {/* Tile 1: MATCH */}
          <g transform="translate(0, 0)">
            <rect className="a-tile-1" x="0" y="0" width="45" height="58" rx="7" stroke="#a78bfa" strokeWidth="1.4" />
            <rect x="7" y="8" width="13" height="18" rx="2" fill="none" stroke="#00f0ff" strokeWidth="1.3" />
            <rect x="25" y="8" width="13" height="18" rx="2" fill="none" stroke="#00f0ff" strokeWidth="1.3" />
            <circle cx="13.5" cy="17" r="2.5" fill="#00f0ff" />
            <circle cx="31.5" cy="17" r="2.5" fill="#00f0ff" />
            <text x="22.5" y="38" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fontWeight="800" fill="#ffffff">
              MATCH
            </text>
            <text x="22.5" y="49" textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="600" fill="#a78bfa">
              MEMORY
            </text>
          </g>

          {/* Tile 2: SEQUENCE */}
          <g transform="translate(51, 0)">
            <rect className="a-tile-2" x="0" y="0" width="45" height="58" rx="7" stroke="#a78bfa" strokeWidth="1.4" />
            <circle cx="11" cy="17" r="6" fill="rgba(226,212,255,0.2)" stroke="#e2d4ff" strokeWidth="1" />
            <text x="11" y="20.5" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill="#ffffff">1</text>
            <circle cx="23" cy="17" r="6" fill="rgba(226,212,255,0.2)" stroke="#e2d4ff" strokeWidth="1" />
            <text x="23" y="20.5" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill="#ffffff">2</text>
            <circle cx="35" cy="17" r="6" fill="rgba(226,212,255,0.2)" stroke="#e2d4ff" strokeWidth="1" />
            <text x="35" y="20.5" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill="#ffffff">3</text>
            <text x="22.5" y="38" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fontWeight="800" fill="#ffffff">
              SEQ
            </text>
            <text x="22.5" y="49" textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="600" fill="#a78bfa">
              SPEED
            </text>
          </g>

          {/* Tile 3: RECALL */}
          <g transform="translate(0, 64)">
            <rect className="a-tile-3" x="0" y="0" width="45" height="58" rx="7" stroke="#a78bfa" strokeWidth="1.4" />
            <rect x="7" y="10" width="9" height="12" rx="1.5" fill="none" stroke="#00f0ff" strokeWidth="1" />
            <text x="11.5" y="19" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="800" fill="#00f0ff">A</text>
            <rect x="18" y="10" width="9" height="12" rx="1.5" fill="none" stroke="#00f0ff" strokeWidth="1" />
            <text x="22.5" y="19" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="800" fill="#00f0ff">B</text>
            <rect x="29" y="10" width="9" height="12" rx="1.5" fill="none" stroke="#00f0ff" strokeWidth="1" />
            <text x="33.5" y="19" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="800" fill="#00f0ff">C</text>
            <text x="22.5" y="38" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fontWeight="800" fill="#ffffff">
              RECALL
            </text>
            <text x="22.5" y="49" textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="600" fill="#a78bfa">
              WORDS
            </text>
          </g>

          {/* Tile 4: PATTERN */}
          <g transform="translate(51, 64)">
            <rect className="a-tile-4" x="0" y="0" width="45" height="58" rx="7" stroke="#a78bfa" strokeWidth="1.4" />
            {[0, 1].map(r => [0, 1, 2].map(c => (
              <circle
                key={`dp-${r}-${c}`}
                cx={13 + c * 10}
                cy={13 + r * 9}
                r="2.5"
                fill={(r + c) % 2 === 0 ? '#c084fc' : 'rgba(192,132,252,0.3)'}
              />
            )))}
            <text x="22.5" y="38" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fontWeight="800" fill="#ffffff">
              PATTERN
            </text>
            <text x="22.5" y="49" textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="600" fill="#a78bfa">
              FOCUS
            </text>
          </g>
        </g>

        {/* Stage 3 Title Tag */}
        <g transform="translate(390, 256)">
          <rect x="-42" y="-14" width="84" height="24" rx="6" fill="rgba(30,24,68,0.85)" stroke="#c084fc" strokeWidth="1.2" />
          <text x="0" y="2" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="11" fontWeight="800" fill="#ffffff" letterSpacing="1">
            GAMES
          </text>
          <text x="0" y="20" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="600" fill="#a78bfa" letterSpacing="0.6">
            BRAIN TASKS
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════
             CONNECTOR 3: Games → Risk Score
             ══════════════════════════════════════════════════════════ */}
        <path
          className="a-flow-path"
          d="M 438 156 C 448 156, 454 156, 464 156"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle r="4.5" fill="#00f0ff" style={{ offsetPath: "path('M 438 156 C 448 156, 454 156, 464 156')", animation: 'nin-flow-3 7.5s linear infinite', filter: 'drop-shadow(0 0 6px #00f0ff)' }} />

        {/* ══════════════════════════════════════════════════════════
             STAGE 4: RISK SCORE GAUGE (WELL WITHIN CANVAS BOUNDS)
             Position: Center (510, 154)
             ══════════════════════════════════════════════════════════ */}
        <g className="a-score-group" transform="translate(510, 154)">
          <circle cx="0" cy="0" r="38" fill="url(#n-score-halo)" />

          {/* Background track */}
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(192,132,252,0.25)" strokeWidth="5.5" />

          {/* Progress Arc */}
          <circle
            className="a-gauge-fill"
            cx="0"
            cy="0"
            r="28"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="6"
            strokeLinecap="round"
            transform="rotate(-90)"
          />

          {/* Center Dial Face */}
          <circle cx="0" cy="0" r="21" fill="rgba(16,12,38,0.95)" stroke="rgba(0,240,255,0.4)" strokeWidth="1" />

          {/* Score Number */}
          <text x="0" y="-1" textAnchor="middle" fontFamily="'Inter', monospace" fontSize="17" fontWeight="900" fill="#00f0ff" style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }}>
            78
          </text>
          <text x="0" y="10" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="700" fill="rgba(226,212,255,0.85)">
            /100
          </text>

          {/* Risk Level Pill */}
          <rect x="-24" y="34" width="48" height="18" rx="5" fill="rgba(0,240,255,0.22)" stroke="#00f0ff" strokeWidth="1.2" />
          <text x="0" y="46.5" textAnchor="middle" fontFamily="'Inter', monospace" fontSize="8.5" fontWeight="800" fill="#00f0ff" letterSpacing="0.4">
            LOW RISK
          </text>
        </g>

        {/* Stage 4 Title Tag */}
        <g transform="translate(510, 256)">
          <rect x="-42" y="-14" width="84" height="24" rx="6" fill="rgba(30,24,68,0.85)" stroke="#00f0ff" strokeWidth="1.2" />
          <text x="0" y="2" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="11" fontWeight="800" fill="#ffffff" letterSpacing="0.8">
            RISK SCORE
          </text>
          <text x="0" y="20" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="600" fill="#00f0ff" letterSpacing="0.6">
            DIAGNOSTIC
          </text>
        </g>

      </svg>

      <div className="visual-glow purple-glow" style={{ opacity: 0.12, pointerEvents: 'none' }} />
    </div>
  );
}
