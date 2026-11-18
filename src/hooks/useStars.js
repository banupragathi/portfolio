// src/hooks/useStars.js
import { useEffect } from 'react';

/**
 * Initializes a twinkling star canvas animation on a canvas ref.
 * @param {React.RefObject} canvasRef - ref to the <canvas> element
 * @param {number} count - number of stars
 * @param {object} options - { maxR, enableShootingStars, colors }
 */
export function useStars(canvasRef, count = 250, options = {}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement || document.body;
    let animId;

    function resize() {
      canvas.width  = canvas.clientWidth  || parent.offsetWidth  || window.innerWidth;
      canvas.height = canvas.clientHeight || parent.offsetHeight || window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    const colors = options.colors || ['#ffffff', '#ffd6f0', '#d0e8ff', '#fffacd', '#e8d0ff'];

    const stars = Array.from({ length: count }, () => ({
      x:             Math.random() * canvas.width,
      y:             Math.random() * canvas.height,
      r:             Math.random() * (options.maxR || 1.4) + 0.1,
      speed:         Math.random() * 0.8 + 0.2,
      phase:         Math.random() * Math.PI * 2,
      color:         colors[Math.floor(Math.random() * colors.length)],
      parallaxSpeed: Math.random() * 0.35 + 0.05,
    }));

    let shootingStar = null;

    function spawnShootingStar() {
      if (Math.random() > 0.003) return;
      const startX  = Math.random() * (canvas.width * 0.8);
      const startY  = Math.random() * (canvas.height * 0.4);
      const angle   = Math.PI / 6 + Math.random() * (Math.PI / 12);
      const speed   = Math.random() * 2 + 1.5;
      shootingStar  = {
        x: startX, y: startY,
        dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
        len: Math.random() * 80 + 40,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 120 + 80,
      };
    }

    function draw(timestamp) {
      const t = timestamp * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scrollY = window.scrollY;

      stars.forEach(s => {
        let renderY = (s.y - scrollY * s.parallaxSpeed) % canvas.height;
        if (renderY < 0) renderY += canvas.height;
        const alpha = 0.25 + 0.75 * Math.abs(Math.sin(s.phase + t * s.speed));

        ctx.beginPath();
        ctx.arc(s.x, renderY, s.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha * 0.18;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, renderY, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      if (options.enableShootingStars) {
        if (!shootingStar) {
          spawnShootingStar();
        } else {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y,
            shootingStar.x - shootingStar.dx * 12, shootingStar.y - shootingStar.dy * 12
          );
          grad.addColorStop(0,   `rgba(255,255,255,${shootingStar.opacity})`);
          grad.addColorStop(0.5, `rgba(139,92,246,${shootingStar.opacity * 0.4})`);
          grad.addColorStop(1,   'rgba(56,189,248,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x - shootingStar.dx * 12, shootingStar.y - shootingStar.dy * 12);
          ctx.stroke();

          shootingStar.x += shootingStar.dx;
          shootingStar.y += shootingStar.dy;
          shootingStar.life++;

          if (shootingStar.life > shootingStar.maxLife - 30) {
            shootingStar.opacity = Math.max(0, (shootingStar.maxLife - shootingStar.life) / 30);
          }
          if (shootingStar.life >= shootingStar.maxLife || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
            shootingStar = null;
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [canvasRef, count]); // eslint-disable-line react-hooks/exhaustive-deps
}
