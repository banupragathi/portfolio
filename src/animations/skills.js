// src/animations/skills.js
// Constellation Islands canvas + GSAP — ported from constellation-islands.js
import { gsap, ScrollTrigger } from '../lib/gsap';

export function initSkillsAnimation(canvasRef, slidesRef, islands) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, RX, RY, RW, RH;
  let globalProgress = 0;
  let time = 0;
  let animId;
  let lastBurstIdx = -1;

  const particles     = [];
  const bgStars       = [];
  const burstParticles = [];
  const NUM_PARTICLES = 45;
  const NUM_BG_STARS  = 50;

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        size: Math.random() * 2.2 + 0.5,
        speedY: -(Math.random() * 0.00025 + 0.0001),
        drift: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.003 + 0.001,
        driftAmp: Math.random() * 0.008 + 0.004,
        opacity: Math.random() * 0.45 + 0.15,
      });
    }
  }

  function initBgStars() {
    bgStars.length = 0;
    for (let i = 0; i < NUM_BG_STARS; i++) {
      bgStars.push({
        x: 0.38 + Math.random() * 0.60, y: Math.random(),
        size: Math.random() * 1.4 + 0.3,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
      });
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    RX = W * 0.40; RY = H * 0.03;
    RW = W * 0.57; RH = H * 0.94;
  }
  resize();
  initParticles();
  initBgStars();
  window.addEventListener('resize', resize);

  function emitBurst(island) {
    const a = island.accent;
    for (let i = 0; i < 20; i++) {
      burstParticles.push({
        x: 0.65 + (Math.random() - 0.5) * 0.3,
        y: 0.35 + (Math.random() - 0.5) * 0.25,
        vx: (Math.random() - 0.5) * 0.004,
        vy: -(Math.random() * 0.004 + 0.001),
        size: Math.random() * 3 + 1,
        life: 1.0, decay: Math.random() * 0.015 + 0.008,
        r: a.r, g: a.g, b: a.b,
      });
    }
  }

  function nodePos(node, scatter, idx) {
    const sx = Math.sin(idx * 2.7 + time * 0.3) * scatter * RW * 0.14;
    const sy = Math.cos(idx * 3.1 + time * 0.25) * scatter * RH * 0.14;
    const fx = Math.sin(time * 0.6 + idx * 0.8) * 3;
    const fy = Math.sin(time * 0.5 + idx * 1.1) * 4;
    return { x: RX + node.x * RW + sx + fx, y: RY + node.y * RH + sy + fy };
  }

  function drawIslandTerrain(island, alpha, offsetY) {
    const a = island.accent;
    const cx = RX + RW * 0.50;
    const baseY = RY + RH * 0.72 + offsetY;
    const iW = RW * 0.82;
    const sx = cx - iW / 2;

    ctx.save();
    ctx.globalAlpha = alpha;
    const ug = ctx.createRadialGradient(cx, baseY + H * 0.02, 0, cx, baseY + H * 0.02, iW * 0.55);
    ug.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0.22)`);
    ug.addColorStop(0.4, `rgba(${a.r},${a.g},${a.b},0.08)`);
    ug.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ug;
    ctx.beginPath();
    ctx.ellipse(cx, baseY + H * 0.02, iW * 0.55, iW * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    function traceTop() {
      ctx.moveTo(sx, baseY);
      ctx.bezierCurveTo(sx+iW*0.06, baseY-H*0.03, sx+iW*0.14, baseY-H*0.07, sx+iW*0.22, baseY-H*0.06);
      ctx.bezierCurveTo(sx+iW*0.30, baseY-H*0.09, sx+iW*0.38, baseY-H*0.13, sx+iW*0.48, baseY-H*0.14);
      ctx.bezierCurveTo(sx+iW*0.56, baseY-H*0.12, sx+iW*0.64, baseY-H*0.09, sx+iW*0.72, baseY-H*0.07);
      ctx.bezierCurveTo(sx+iW*0.82, baseY-H*0.04, sx+iW*0.92, baseY-H*0.02, sx+iW, baseY);
    }
    function traceBottom() {
      ctx.bezierCurveTo(sx+iW*0.88, baseY+H*0.05, sx+iW*0.72, baseY+H*0.11, sx+iW*0.58, baseY+H*0.14);
      ctx.bezierCurveTo(sx+iW*0.48, baseY+H*0.16, sx+iW*0.40, baseY+H*0.15, sx+iW*0.34, baseY+H*0.12);
      ctx.bezierCurveTo(sx+iW*0.22, baseY+H*0.08, sx+iW*0.10, baseY+H*0.04, sx, baseY);
    }

    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath(); traceTop(); traceBottom(); ctx.closePath();
    const bodyGrd = ctx.createLinearGradient(sx, baseY - H * 0.14, sx, baseY + H * 0.16);
    bodyGrd.addColorStop(0,   `rgba(${Math.min(255,a.r+40)},${Math.min(255,a.g+40)},${Math.min(255,a.b+40)},0.55)`);
    bodyGrd.addColorStop(0.25,`rgba(${a.r},${a.g},${a.b},0.35)`);
    bodyGrd.addColorStop(0.5, `rgba(${a.r>>1},${a.g>>1},${a.b>>1},0.20)`);
    bodyGrd.addColorStop(0.8, `rgba(${a.r>>2},${a.g>>2},${a.b>>2},0.10)`);
    bodyGrd.addColorStop(1,   `rgba(${a.r>>2},${a.g>>2},${a.b>>2},0.03)`);
    ctx.fillStyle = bodyGrd; ctx.fill();

    ctx.shadowColor = `rgba(${a.r},${a.g},${a.b},0.9)`; ctx.shadowBlur = 35;
    ctx.strokeStyle = `rgba(${a.r},${a.g},${a.b},0.40)`; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = alpha;
    ctx.beginPath(); traceTop();
    ctx.shadowColor = `rgba(${a.r},${a.g},${a.b},1)`; ctx.shadowBlur = 22;
    ctx.strokeStyle = `rgba(${a.r},${a.g},${a.b},0.70)`; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = alpha * 0.35;
    ctx.beginPath(); traceTop();
    ctx.lineTo(sx + iW, baseY + H * 0.01);
    ctx.bezierCurveTo(sx+iW*0.75, baseY - H*0.03, sx+iW*0.25, baseY - H*0.03, sx, baseY + H * 0.01);
    ctx.closePath();
    const surfGrd = ctx.createLinearGradient(sx, baseY - H * 0.14, sx, baseY + H * 0.01);
    surfGrd.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0.3)`); surfGrd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = surfGrd; ctx.fill();

    ctx.globalAlpha = alpha * 0.6;
    for (let i = 0; i < 18; i++) {
      const t = 0.06 + i * 0.05;
      const gx = sx + iW * t;
      const surfD = Math.sin(t * Math.PI) * 0.11 + 0.025;
      const gy = baseY - H * surfD;
      const gh = H * (0.010 + Math.sin(time * 0.9 + i * 0.8) * 0.004);
      ctx.beginPath(); ctx.moveTo(gx-2, gy); ctx.lineTo(gx, gy-gh); ctx.lineTo(gx+2, gy); ctx.closePath();
      ctx.fillStyle = `rgba(${a.r},${a.g},${a.b},0.50)`; ctx.fill();
    }

    ctx.globalAlpha = alpha * 0.7;
    [0.30, 0.48, 0.70].forEach((ct, ci) => {
      const cx2 = sx + iW * ct;
      const surfD = Math.sin(ct * Math.PI) * 0.11 + 0.025;
      const cy2 = baseY - H * surfD;
      const spireH = H * (0.025 + Math.sin(time * 0.5 + ci * 2) * 0.005);
      ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(cx2, cy2 - spireH);
      ctx.strokeStyle = `rgba(${a.r},${a.g},${a.b},0.6)`; ctx.lineWidth = 1.5;
      ctx.shadowColor = `rgba(${a.r},${a.g},${a.b},0.8)`; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
      const tipGrd = ctx.createRadialGradient(cx2, cy2-spireH, 0, cx2, cy2-spireH, 8);
      tipGrd.addColorStop(0, 'rgba(255,255,255,0.7)'); tipGrd.addColorStop(0.5, `rgba(${a.r},${a.g},${a.b},0.4)`); tipGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(cx2, cy2-spireH, 8, 0, Math.PI*2); ctx.fillStyle = tipGrd; ctx.fill();
    });

    ctx.globalAlpha = alpha * 0.65;
    [0.38, 0.50, 0.62].forEach((fx, fi) => {
      const fallX = sx + iW * fx;
      const fallStart = baseY + H * 0.025;
      const fallLen = H * 0.08 + Math.sin(time * 0.7 + fi * 2.3) * H * 0.015;
      const fg = ctx.createLinearGradient(fallX, fallStart, fallX, fallStart + fallLen);
      fg.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0.55)`);
      fg.addColorStop(0.7, `rgba(${a.r},${a.g},${a.b},0.15)`);
      fg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(fallX-1.5, fallStart); ctx.lineTo(fallX+1.5, fallStart);
      ctx.lineTo(fallX+0.5, fallStart+fallLen); ctx.lineTo(fallX-0.5, fallStart+fallLen);
      ctx.fillStyle = fg; ctx.fill();
      const dripY = fallStart + fallLen + Math.sin(time * 2.5 + fi * 1.4) * H * 0.018;
      ctx.beginPath(); ctx.arc(fallX, dripY, 2, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${a.r},${a.g},${a.b},${0.35 + Math.sin(time*3+fi)*0.2})`; ctx.fill();
    });

    ctx.globalAlpha = alpha * 0.3;
    [0.25, 0.42, 0.58, 0.75].forEach((rx, ri) => {
      const rootX = sx + iW * rx;
      const rootStart = baseY + H * 0.04;
      const rootLen = H * (0.04 + Math.sin(time * 0.4 + ri * 1.7) * 0.008);
      const sway = Math.sin(time * 0.6 + ri * 2) * 4;
      ctx.beginPath(); ctx.moveTo(rootX, rootStart);
      ctx.quadraticCurveTo(rootX + sway, rootStart + rootLen * 0.6, rootX + sway * 0.5, rootStart + rootLen);
      ctx.strokeStyle = `rgba(${a.r},${a.g},${a.b},0.3)`; ctx.lineWidth = 1; ctx.stroke();
    });

    ctx.restore();
  }

  function drawConstellation(island, alpha, scatter) {
    const a = island.accent, aAlt = island.accentAlt, ns = island.nodes, conns = island.connections;
    ctx.save(); ctx.globalAlpha = alpha;
    const positions = ns.map((node, idx) => nodePos(node, scatter, idx));
    conns.forEach(([i, j]) => {
      const p1 = positions[i], p2 = positions[j];
      const lg = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      lg.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0.40)`);
      lg.addColorStop(0.5, `rgba(${aAlt.r},${aAlt.g},${aAlt.b},0.22)`);
      lg.addColorStop(1, `rgba(${a.r},${a.g},${a.b},0.40)`);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = lg; ctx.lineWidth = 1.2; ctx.stroke();
    });
    positions.forEach((pos, idx) => {
      const nx = pos.x, ny = pos.y;
      const ps = 4.5 + Math.sin(time * 1.2 + idx * 1.5) * 1.8;
      const hg = ctx.createRadialGradient(nx, ny, 0, nx, ny, ps * 7);
      hg.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0.22)`);
      hg.addColorStop(0.4, `rgba(${a.r},${a.g},${a.b},0.06)`);
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(nx, ny, ps*7, 0, Math.PI*2); ctx.fillStyle = hg; ctx.fill();
      ctx.beginPath(); ctx.arc(nx, ny, ps*2.5, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(${a.r},${a.g},${a.b},0.18)`; ctx.lineWidth = 0.5; ctx.stroke();
      const cg = ctx.createRadialGradient(nx, ny, 0, nx, ny, ps);
      cg.addColorStop(0, 'rgba(255,255,255,0.95)');
      cg.addColorStop(0.4, `rgba(${a.r},${a.g},${a.b},0.85)`);
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(nx, ny, ps, 0, Math.PI*2); ctx.fillStyle = cg; ctx.fill();
      const labelA = Math.max(0, 1 - scatter * 3);
      if (labelA > 0.05) {
        ctx.font = '500 11px Manrope, sans-serif';
        ctx.fillStyle = `rgba(255,255,255,${0.75 * labelA})`;
        ctx.textAlign = 'center';
        ctx.shadowColor = `rgba(${a.r},${a.g},${a.b},0.6)`; ctx.shadowBlur = 10;
        ctx.fillText(ns[idx].label, nx, ny - ps * 3 - 6); ctx.shadowBlur = 0;
      }
    });
    ctx.restore();
  }

  function drawBgStars() {
    ctx.save();
    bgStars.forEach(s => {
      const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed * 60 + s.twinklePhase));
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${tw * 0.35})`; ctx.fill();
    });
    ctx.restore();
  }

  function drawParticles(island, alpha) {
    const a = island.accent;
    ctx.save();
    particles.forEach(p => {
      p.y += p.speedY; p.drift += p.driftSpeed;
      const px = (0.38 + p.x * 0.60) * W + Math.sin(p.drift) * p.driftAmp * W;
      const py = p.y * H;
      if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
      const pa = p.opacity * alpha * (0.5 + 0.5 * Math.sin(time * 2 + p.drift));
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${a.r},${a.g},${a.b},${pa})`; ctx.fill();
    });
    ctx.restore();
  }

  function drawBurstParticles() {
    ctx.save();
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.x += bp.vx; bp.y += bp.vy; bp.life -= bp.decay;
      if (bp.life <= 0) { burstParticles.splice(i, 1); continue; }
      ctx.beginPath(); ctx.arc(bp.x * W, bp.y * H, bp.size * bp.life, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${bp.r},${bp.g},${bp.b},${bp.life * 0.5})`; ctx.fill();
    }
    ctx.restore();
  }

  function updateSlides(idx, segProg) {
    const slides = slidesRef.current;
    if (!slides) return;
    const slideEls = slides.querySelectorAll('.island-slide');
    let show = idx;
    if (idx < islands.length - 1 && segProg > 0.80) show = idx + 1;
    slideEls.forEach((s, i) => {
      if (i === show) s.classList.add('active');
      else s.classList.remove('active');
    });
  }

  function render() {
    time += 0.016;
    ctx.clearRect(0, 0, W, H);
    const segSize = 1 / islands.length;
    const rawIdx = globalProgress / segSize;
    const idx = Math.min(Math.floor(rawIdx), islands.length - 1);
    const segProg = rawIdx - idx;
    const TS = 0.65, TE = 0.95;
    let curA = 1, nxtA = 0, curSc = 0, nxtSc = 1;
    let curOff = 0, nxtOff = H * 0.15;

    if (idx < islands.length - 1 && segProg > TS) {
      const t = Math.min((segProg - TS) / (TE - TS), 1);
      const e = t * t * (3 - 2 * t);
      curA = 1 - e; nxtA = e; curSc = e; nxtSc = 1 - e;
      curOff = -e * H * 0.08; nxtOff = (1 - e) * H * 0.15;
      if (lastBurstIdx !== idx) { emitBurst(islands[idx]); lastBurstIdx = idx; }
    } else {
      lastBurstIdx = -1;
    }
    const floatY = Math.sin(time * 0.4) * 8;
    drawBgStars();
    drawIslandTerrain(islands[idx], curA, floatY + curOff);
    drawConstellation(islands[idx], curA, curSc);
    drawParticles(islands[idx], curA);
    if (nxtA > 0.01 && idx < islands.length - 1) {
      drawIslandTerrain(islands[idx + 1], nxtA, floatY + nxtOff);
      drawConstellation(islands[idx + 1], nxtA, nxtSc);
      drawParticles(islands[idx + 1], nxtA * 0.4);
    }
    drawBurstParticles();
    updateSlides(idx, segProg);
    animId = requestAnimationFrame(render);
  }
  animId = requestAnimationFrame(render);

  let ctx2 = gsap.context(() => {
    ScrollTrigger.create({
      trigger: '#constellation-islands',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate: (self) => { globalProgress = self.progress; },
  });
  }); // close ctx2

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    ctx2.revert();
  };
}
