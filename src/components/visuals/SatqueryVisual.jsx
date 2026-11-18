// src/components/visuals/SatqueryVisual.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function SatqueryVisual() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [satData, setSatData] = useState({
    x: 250,
    y: 190,
    z: 1,
    angle: 0,
    isScanning: false,
    targetX: 235,
    targetY: 180,
    scanProgress: 0,
    phaseText: 'ORBITAL TELEMETRY // 705 KM SSO'
  });

  // IntersectionObserver to pause animation when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // WebGL 3D Earth Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) return;

    // Vertex Shader: full quad
    const vsSource = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_pos + 1.0) * 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Photorealistic 3D Earth with NASA textures, clouds, day-night terminator, and atmosphere
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_earth;
      uniform sampler2D u_clouds;
      uniform float u_scan_intensity;

      void main() {
        // Normalize aspect ratio centered at (0, 0)
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / (u_resolution.y * 0.5);
        
        // Earth radius in shader space (corresponds to ~84px radius)
        float R = 0.44;
        float d2 = dot(p, p);

        // Directional Sunlight vector (from top-left slightly forward)
        vec3 lightDir = normalize(vec3(-0.65, 0.45, 0.62));

        // Atmospheric Edge Glow outside the sphere
        if (d2 > R * R) {
          float dist = sqrt(d2) - R;
          if (dist > 0.09) {
            discard;
          }
          // Subtle atmospheric haze gradient
          float haze = exp(-dist * 35.0) * 0.5;
          // Sun scattering angle
          float sunDot = max(dot(vec3(p / sqrt(d2), 0.0), lightDir), 0.0);
          haze *= (sunDot * 0.6 + 0.4);
          vec3 atmoCol = vec3(0.22, 0.65, 1.0) * haze;
          gl_FragColor = vec4(atmoCol, haze);
          return;
        }

        // True 3D Sphere Surface Coordinates
        float z = sqrt(R * R - d2);
        vec3 N = normalize(vec3(p, z));

        // 23.5-degree axial tilt
        float tilt = -0.41;
        mat3 rotTilt = mat3(
          1.0, 0.0, 0.0,
          0.0, cos(tilt), -sin(tilt),
          0.0, sin(tilt), cos(tilt)
        );
        vec3 Nt = rotTilt * N;

        // Longitude & Latitude mapping
        float lat = asin(clamp(Nt.y, -1.0, 1.0));
        float lon = atan(Nt.x, Nt.z) + u_time * 0.06; // Slow axial rotation

        vec2 earthUV = vec2(fract(lon / (2.0 * 3.14159265) + 0.5), lat / 3.14159265 + 0.5);

        // Cloud layer with slight parallax and independent motion
        float cloudLon = atan(Nt.x, Nt.z) + u_time * 0.078;
        vec2 cloudUV = vec2(fract(cloudLon / (2.0 * 3.14159265) + 0.5), earthUV.y);

        // Texture samples
        vec3 earthCol = texture2D(u_earth, earthUV).rgb;
        vec4 cloudCol = texture2D(u_clouds, cloudUV);

        // Directional sunlight diffuse calculation
        float NdotL = dot(N, lightDir);
        // Smooth day-night terminator boundary
        float terminator = smoothstep(-0.1, 0.22, NdotL);

        // Deep navy night-side shading
        vec3 nightCol = earthCol * 0.06 + vec3(0.01, 0.015, 0.035);

        // Surface with cloud cast shadows
        vec3 daySurface = earthCol * (1.0 - cloudCol.r * 0.35);
        // Blend white clouds on top of day surface
        daySurface = mix(daySurface, vec3(0.95, 0.98, 1.0), cloudCol.r * 0.72);

        // Combine lit day hemisphere and shadowed night hemisphere
        vec3 finalColor = mix(nightCol, daySurface * (max(NdotL, 0.0) * 0.85 + 0.15), terminator);

        // Atmospheric rim scattering (Fresnel effect along edges)
        float rim = pow(1.0 - N.z, 2.2);
        vec3 rimColor = vec3(0.2, 0.65, 1.0) * rim * (terminator * 0.75 + 0.25) * 0.85;
        finalColor += rimColor;

        // Target region analysis pulse
        if (u_scan_intensity > 0.01) {
          vec2 targetPos = vec2(0.52, 0.58);
          float tDist = length(earthUV - targetPos);
          if (tDist < 0.05) {
            float grid = sin(tDist * 320.0) * 0.5 + 0.5;
            finalColor += vec3(0.0, 0.95, 1.0) * u_scan_intensity * (0.6 + 0.4 * grid);
          }
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Quad geometry
    const quad = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uScanIntensity = gl.getUniformLocation(program, 'u_scan_intensity');
    const uEarth = gl.getUniformLocation(program, 'u_earth');
    const uClouds = gl.getUniformLocation(program, 'u_clouds');

    // Create textures
    const earthTex = gl.createTexture();
    const cloudsTex = gl.createTexture();

    function setPlaceholderTexture(tex, r, g, b) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([r, g, b, 255])
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    setPlaceholderTexture(earthTex, 14, 30, 60);
    setPlaceholderTexture(cloudsTex, 255, 255, 255);

    // Load actual textures
    const earthImg = new Image();
    earthImg.crossOrigin = 'anonymous';
    earthImg.src = `${import.meta.env.BASE_URL}earth_day.jpg`;
    earthImg.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, earthTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, earthImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    const cloudsImg = new Image();
    cloudsImg.crossOrigin = 'anonymous';
    cloudsImg.src = `${import.meta.env.BASE_URL}earth_clouds.png`;
    cloudsImg.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, cloudsTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cloudsImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // Animation Loop
    let animId;
    let startTime = performance.now();

    const render = (time) => {
      if (!isActive) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (time - startTime) * 0.001;
      
      // Calculate 3D Satellite Orbit Parametrics
      // Orbital period: 14s loop
      const orbitSpeed = 0.449; // 2 * PI / 14s
      const theta = elapsed * orbitSpeed;

      // Inclined 3D Orbit parameters
      const a = 155; // Semi-major axis
      const b = 135; // Semi-minor axis
      const tiltX = 0.42;  // ~24 deg tilt toward viewer
      const tiltZ = -0.28; // ~-16 deg inclination

      const x0 = a * Math.cos(theta);
      const z0 = b * Math.sin(theta);

      const curX = x0 * Math.cos(tiltZ);
      const curY1 = x0 * Math.sin(tiltZ);
      const curY = curY1 * Math.cos(tiltX) - z0 * Math.sin(tiltX);
      const curZ = curY1 * Math.sin(tiltX) + z0 * Math.cos(tiltX);

      const sX = 250 + curX;
      const sY = 190 + curY;

      // Satellite orientation: naturally track vector to Earth center (250, 190)
      const toEarthX = 250 - sX;
      const toEarthY = 190 - sY;
      const faceAngle = Math.atan2(toEarthY, toEarthX) * (180 / Math.PI);

      // Scanning sequence (activates when satellite passes across front hemisphere)
      const normTheta = (theta % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const isFront = curZ > 0;
      const isScanWindow = normTheta > 0.6 && normTheta < 2.5;
      const scanIntensity = isScanWindow ? Math.sin((normTheta - 0.6) / 1.9 * Math.PI) : 0;

      // Update React state for SVG overlay
      setSatData({
        x: sX,
        y: sY,
        z: curZ,
        angle: faceAngle,
        isScanning: isScanWindow,
        targetX: 232,
        targetY: 178,
        scanProgress: scanIntensity,
        phaseText: isScanWindow
          ? 'AI ANALYSIS: MULTISPECTRAL TILE ACQUIRED [BAND 4-3-2]'
          : 'ORBITAL TELEMETRY // 705 KM SSO • SENSOR READY'
      });

      // Render WebGL Earth
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uScanIntensity, scanIntensity);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, earthTex);
      gl.uniform1i(uEarth, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, cloudsTex);
      gl.uniform1i(uClouds, 1);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteTexture(earthTex);
      gl.deleteTexture(cloudsTex);
      gl.deleteBuffer(buffer);
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* 3D Photorealistic Earth Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={380}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* Vector Orbit, Satellite & Tactical Telemetry Overlay */}
      <svg
        viewBox="0 0 500 380"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Linear gradient for satellite scanning beam */}
          <linearGradient id="sq-scan-beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#00f0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
          </linearGradient>

          {/* Radial pulse for target acquisition */}
          <radialGradient id="sq-target-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Top Telemetry Status Header */}
        <g transform="translate(250, 30)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace'
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="1.5"
            fill={satData.isScanning ? '#00f0ff' : '#e2d4ff'}
            style={{
              filter: satData.isScanning
                ? 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.9))'
                : 'drop-shadow(0 0 5px rgba(226, 212, 255, 0.6))',
              transition: 'all 0.3s ease'
            }}
          >
            {satData.phaseText}
          </text>
        </g>

        {/* 3D Elliptical Orbit Track */}
        {/* Background Orbit Line (passing behind the Earth) */}
        <path
          d="M 102 227 C 70 190, 150 145, 250 133 C 330 123, 400 135, 398 153"
          fill="none"
          stroke="rgba(160, 146, 214, 0.25)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        {/* Foreground Orbit Line (passing in front of Earth) */}
        <path
          d="M 398 153 C 395 175, 340 220, 250 247 C 170 270, 115 255, 102 227"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="1.4"
          strokeDasharray="5 3"
          style={{ filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.6))' }}
        />

        {/* Tactical Earth Scanning Target Box & Coordinates */}
        {satData.isScanning && (
          <g transform={`translate(${satData.targetX}, ${satData.targetY})`}>
            {/* Target highlight circle and grid box */}
            <circle cx="0" cy="0" r="16" fill="url(#sq-target-pulse)" />
            <rect
              x="-11"
              y="-11"
              width="22"
              height="22"
              fill="rgba(0, 240, 255, 0.12)"
              stroke="#00f0ff"
              strokeWidth="1.2"
              strokeDasharray="3 2"
              style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }}
            />
            {/* Crosshairs */}
            <line x1="-15" y1="0" x2="-11" y2="0" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="11" y1="0" x2="15" y2="0" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="0" y1="-15" x2="0" y2="-11" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="0" y1="11" x2="0" y2="15" stroke="#00f0ff" strokeWidth="1.5" />
            
            {/* Target Tag */}
            <rect x="-35" y="16" width="70" height="13" rx="3" fill="rgba(14, 11, 30, 0.85)" stroke="#00f0ff" strokeWidth="0.8" />
            <text x="0" y="25" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill="#00f0ff">
              ROI: LAT 18.5°N
            </text>
          </g>
        )}

        {/* Scanning Cone / Frustum from Satellite to Earth Target */}
        {satData.isScanning && satData.z > 0 && (
          <g>
            <polygon
              points={`${satData.x},${satData.y} ${satData.targetX - 11},${satData.targetY - 11} ${satData.targetX + 11},${satData.targetY + 11}`}
              fill="url(#sq-scan-beam-grad)"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.7))' }}
            />
            {/* Laser Scan Sweep Line */}
            <line
              x1={satData.x}
              y1={satData.y}
              x2={satData.targetX}
              y2={satData.targetY}
              stroke="#ffffff"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }}
            />
          </g>
        )}

        {/* Miniature Earth-Observation Satellite Model */}
        {/* Rendered only if in front (z > 0) or slightly behind at edges */}
        <g
          transform={`translate(${satData.x}, ${satData.y}) rotate(${satData.angle}) scale(${satData.z > 0 ? 1 : 0.75})`}
          opacity={satData.z > -40 ? 1 : 0.25}
          style={{
            filter: satData.z > 0 ? 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.8))' : 'none',
            transition: 'opacity 0.2s ease'
          }}
        >
          {/* Main Bus Chassis (Gold thermal foil MLI) */}
          <rect x="-6" y="-8" width="12" height="16" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          
          {/* Earth-Facing Optical Sensor Pod */}
          <circle cx="6" cy="0" r="3" fill="#0f172a" stroke="#00f0ff" strokeWidth="1" />
          <circle cx="6" cy="0" r="1.2" fill="#00f0ff" />

          {/* Left Solar Array Wing */}
          <line x1="0" y1="-8" x2="0" y2="-12" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="-11" y="-26" width="22" height="14" rx="1.5" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
          {/* Solar cell grid divisions */}
          <line x1="0" y1="-26" x2="0" y2="-12" stroke="#38bdf8" strokeWidth="0.6" opacity="0.8" />
          <line x1="-11" y1="-19" x2="11" y2="-19" stroke="#38bdf8" strokeWidth="0.6" opacity="0.8" />

          {/* Right Solar Array Wing */}
          <line x1="0" y1="8" x2="0" y2="12" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="-11" y="12" width="22" height="14" rx="1.5" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
          {/* Solar cell grid divisions */}
          <line x1="0" y1="12" x2="0" y2="26" stroke="#38bdf8" strokeWidth="0.6" opacity="0.8" />
          <line x1="-11" y1="19" x2="11" y2="19" stroke="#38bdf8" strokeWidth="0.6" opacity="0.8" />

          {/* High-Gain Parabolic Dish Antenna */}
          <path d="M-6,-2 Q-10,0 -6,2 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.6" />
          <line x1="-6" y1="0" x2="-8" y2="0" stroke="#38bdf8" strokeWidth="1" />
        </g>
      </svg>

      {/* Subtle Purple Ambient Lighting matching the Portfolio */}
      <div className="visual-glow purple-glow" style={{ opacity: 0.12, pointerEvents: 'none' }} />
    </div>
  );
}
