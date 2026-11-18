// src/hooks/useCursor.js
import { useEffect } from 'react';

/**
 * Manages cursor glow element + trail particles.
 * Reads #cursor-glow from the DOM (rendered by GlobalBackground).
 */
export function useCursor() {
  useEffect(() => {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isTouch = false;
    let animId;

    // Start off-screen
    cursorGlow.style.transform = `translate3d(-999px, -999px, 0) translate(-50%, -50%)`;

    // Trail particles
    const particles = [];
    const maxParticles = 30;
    let lastMouseX = 0;
    let lastMouseY = 0;

    function spawnParticle(x, y) {
      if (isTouch) return;
      if (particles.length >= maxParticles) {
        const oldest = particles.shift();
        if (oldest && oldest.el.parentNode) oldest.el.parentNode.removeChild(oldest.el);
      }

      const el = document.createElement('div');
      el.className = 'cursor-particle';
      const size = Math.random() * 8 + 4;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = '0px';
      el.style.top = '0px';

      const colors = [
        'rgba(139,92,246,0.75)',
        'rgba(56,189,248,0.75)',
        'rgba(255,94,168,0.75)',
        'rgba(255,255,255,0.85)',
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.background = `radial-gradient(circle, ${color} 0%, transparent 80%)`;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      document.body.appendChild(el);

      particles.push({ el, x, y, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6 - 0.6, life: 1.0 });
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.028;
        if (p.life <= 0) {
          if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
          particles.splice(i, 1);
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${p.life})`;
          p.el.style.opacity = p.life;
        }
      }
    }

    function onMouseMove(e) {
      if (isTouch) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      const dist = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      if (dist > 15) {
        spawnParticle(mouseX, mouseY);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    }

    function animateCursor() {
      if (!isTouch) {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        updateParticles();
      }
      animId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover expand
    function setupHovers() {
      document.querySelectorAll('a, button, .skill-pill, .achievement-card, .project-card, .hero-hello')
        .forEach(el => {
          el.addEventListener('mouseenter', () => { if (!isTouch) cursorGlow.classList.add('active'); });
          el.addEventListener('mouseleave', () => { if (!isTouch) cursorGlow.classList.remove('active'); });
        });
    }
    setupHovers();
    window.addEventListener('load', setupHovers);

    function onTouchStart() {
      isTouch = true;
      cursorGlow.style.display = 'none';
      particles.forEach(p => { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); });
      particles.length = 0;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchstart', onTouchStart, { once: true });

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('load', setupHovers);
      particles.forEach(p => { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); });
    };
  }, []);
}
