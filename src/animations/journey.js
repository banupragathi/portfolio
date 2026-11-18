// src/animations/journey.js
// Journey canvas + GSAP animations — ported from journey.js
import { gsap, ScrollTrigger } from '../lib/gsap';

export function initJourneyAnimation(sectionRef, canvasRef) {
  const section = sectionRef.current;
  const canvas  = canvasRef.current;
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let pathProgress = 0;
  const journeyStars = [];
  const NUM_STARS = 80;
  let mouseX = -1000, mouseY = -1000;
  let frameCount = 0;
  const travelingStars = [];
  const MAX_TRAVELERS = 6;

  function resizeCanvas() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resizeCanvas();

  function initStars() {
    journeyStars.length = 0;
    for (let i = 0; i < NUM_STARS; i++) {
      journeyStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.4 + 0.1,
        alpha: 0,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }
  initStars();

  function handleResize() { resizeCanvas(); initStars(); }
  window.addEventListener('resize', handleResize);

  function onMouseMove(e) {
    const rect = section.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top + section.scrollTop;
  }
  function onMouseLeave() { mouseX = -1000; mouseY = -1000; }
  section.addEventListener('mousemove', onMouseMove);
  section.addEventListener('mouseleave', onMouseLeave);

  function getNodePositions() {
    const positions = [];
    const sectionRect = section.getBoundingClientRect();
    const journeyNodes = section.querySelectorAll('.journey-node');
    journeyNodes.forEach(node => {
      const nodeRect = node.getBoundingClientRect();
      positions.push({
        x: nodeRect.left - sectionRect.left + nodeRect.width / 2,
        y: nodeRect.top  - sectionRect.top  + nodeRect.height / 2,
      });
    });
    return positions;
  }

  function spawnTraveler(positions) {
    if (travelingStars.length >= MAX_TRAVELERS || positions.length < 2) return;
    const segIdx = Math.floor(Math.random() * (positions.length - 1));
    travelingStars.push({
      segmentIndex: segIdx, t: 0,
      speed: Math.random() * 0.004 + 0.002,
      radius: Math.random() * 1.5 + 0.8,
      alpha: 0,
    });
  }

  function drawFrame() {
    if (!canvas.width || !canvas.height) { animId = requestAnimationFrame(drawFrame); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    const positions = getNodePositions();

    if (positions.length > 1) {
      for (let i = 0; i < positions.length - 1; i++) {
        const segProg = Math.max(0, Math.min(1, (pathProgress * (positions.length - 1) - i)));
        if (segProg <= 0) continue;
        const p1 = positions[i], p2 = positions[i + 1];
        const endX = p1.x + (p2.x - p1.x) * segProg;
        const endY = p1.y + (p2.y - p1.y) * segProg;

        const grad = ctx.createLinearGradient(p1.x, p1.y, endX, endY);
        grad.addColorStop(0,   'rgba(139,92,246,0.35)');
        grad.addColorStop(0.5, 'rgba(255,94,168,0.25)');
        grad.addColorStop(1,   'rgba(56,189,248,0.3)');
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();

        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(139,92,246,0.08)'; ctx.lineWidth = 6; ctx.stroke();
      }

      if (frameCount % 120 === 0) spawnTraveler(positions);

      for (let i = travelingStars.length - 1; i >= 0; i--) {
        const ts = travelingStars[i];
        ts.t += ts.speed;
        const segThreshold = (ts.segmentIndex + ts.t) / (positions.length - 1);
        if (segThreshold > pathProgress) { travelingStars.splice(i, 1); continue; }
        if (ts.t >= 1) {
          ts.segmentIndex++;
          ts.t = 0;
          if (ts.segmentIndex >= positions.length - 1) { travelingStars.splice(i, 1); continue; }
        }
        const p1 = positions[ts.segmentIndex], p2 = positions[ts.segmentIndex + 1];
        const tx = p1.x + (p2.x - p1.x) * ts.t;
        const ty = p1.y + (p2.y - p1.y) * ts.t;
        ts.alpha = Math.min(1, ts.alpha + 0.03);

        ctx.beginPath(); ctx.arc(tx, ty, ts.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ts.alpha * 0.8})`; ctx.fill();

        ctx.beginPath(); ctx.arc(tx, ty, ts.radius * 3, 0, Math.PI * 2);
        const tGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, ts.radius * 3);
        tGrad.addColorStop(0, `rgba(167,139,250,${ts.alpha * 0.3})`);
        tGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = tGrad; ctx.fill();
      }
    }

    positions.forEach((pos, i) => {
      const nodeProgress = Math.max(0, Math.min(1, pathProgress * (positions.length - 1) - i + 1));
      if (nodeProgress <= 0) return;
      const pulseAlpha = 0.15 + Math.sin(frameCount * 0.03 + i) * 0.08;
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      const nGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 18);
      nGrad.addColorStop(0, `rgba(139,92,246,${pulseAlpha * nodeProgress})`);
      nGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nGrad; ctx.fill();
    });

    journeyStars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
      const dx = star.x - mouseX, dy = star.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseBright = dist < 200 ? (1 - dist / 200) * 0.5 : 0;
      const alpha = star.baseAlpha * twinkle + mouseBright;
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`; ctx.fill();
    });

    animId = requestAnimationFrame(drawFrame);
  }
  animId = requestAnimationFrame(drawFrame);

  // GSAP ScrollTrigger
  let ctx2 = gsap.context(() => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      onUpdate: (self) => { pathProgress = self.progress; },
    });

    const journeyCards = section.querySelectorAll('.journey-archive');
    const journeyNodes = section.querySelectorAll('.journey-node');

    journeyCards.forEach((card, index) => {
      const isLeft = card.classList.contains('journey-archive--left');
      const xStart = isLeft ? -80 : 80;

      gsap.fromTo(card, { opacity: 0, y: 60, x: xStart, scale: 0.95 }, {
        opacity: 1, y: 0, x: 0, scale: 1, duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      });

      const border = card.querySelector('.journey-archive__border');
      if (border) {
        gsap.fromTo(border, { '--border-progress': '0' }, {
          '--border-progress': '1', duration: 1.4, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }

      const textEls = card.querySelectorAll('.journey-archive__number, .journey-archive__title, .journey-archive__org, .journey-archive__highlight, .journey-archive__quote');
      gsap.fromTo(textEls, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 78%', toggleActions: 'play none none reverse' },
      });

      const node = journeyNodes[index];
      if (node) {
        gsap.fromTo(node, { scale: 0, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)',
          scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      }

      const cardParticles = card.querySelectorAll('.journey-particle');
      cardParticles.forEach((p, pi) => {
        gsap.fromTo(p, { opacity: 0, scale: 0 }, {
          opacity: 0.6, scale: 1, duration: 1.5, delay: 0.3 + pi * 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
        gsap.to(p, {
          y: 'random(-30, 30)', x: 'random(-20, 20)',
          duration: 'random(3, 6)', repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      });

      // Hover lift/tilt
      card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, duration: 0.4, ease: 'power2.out' }));
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        gsap.to(card, { rotateY: x * 2, rotateX: -y * 2, duration: 0.3, ease: 'power1.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
      });
    });

    // Header
    const headerEl = section.querySelector('.journey-header');
    if (headerEl) {
      const tag   = headerEl.querySelector('.section-tag');
      const title = headerEl.querySelector('.journey-title');
      const sub   = headerEl.querySelector('.journey-subtitle');
      if (tag)   gsap.fromTo(tag,   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1,   ease: 'power3.out', scrollTrigger: { trigger: headerEl, start: 'top 85%', toggleActions: 'play none none reverse' } });
      if (title) gsap.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: headerEl, start: 'top 85%', toggleActions: 'play none none reverse' } });
      if (sub)   gsap.fromTo(sub,   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1,   delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: headerEl, start: 'top 85%', toggleActions: 'play none none reverse' } });
    }
  }, section);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
    section.removeEventListener('mousemove', onMouseMove);
    section.removeEventListener('mouseleave', onMouseLeave);
    ctx2.revert();
  };
}
