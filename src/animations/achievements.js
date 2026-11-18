// src/animations/achievements.js
// 3D gallery GSAP animation — ported from 3d-gallery.js
import { gsap, ScrollTrigger } from '../lib/gsap';

export function initAchievementsAnimation(containerRef, trackRef, sectionRef) {
  const container = containerRef.current;
  const track     = trackRef.current;
  const section   = sectionRef.current;
  if (!container || !track || !section) return;

  const cards = Array.from(container.querySelectorAll('.gallery-3d-card'));
  if (cards.length === 0) return;

  let activeHoverIndex = -1;
  const hoverWeight = { val: 0 };
  const proxy = { progress: 0 };
  const totalCards = cards.length;

  let ctx = gsap.context(() => {
    const updateCards = (activeIndex) => {
      cards.forEach((card, i) => {
        const d = i - activeIndex;
      let x = 0, y = 0, z = 0, opacity = 1, blur = 0, rotY = 0, scale = 1;
      let boxShadow = '0 15px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.05)';

      if (d > 0) {
        x = d * 140; y = -d * 20; z = -d * 180; rotY = -15;
        scale = 1 - (d * 0.04);
        opacity = Math.max(0, 1 - (d * 0.12));
        blur = d * 1.5;
      } else {
        x = d * 500; y = d * 40; z = d * -250; rotY = d * 20; scale = 1;
        opacity = Math.max(0, 1 + d * 1.2); blur = 0;
        if (Math.abs(d) < 0.5) {
          boxShadow = `0 30px 60px rgba(139,92,246,${0.4 * (1 - Math.abs(d))}), inset 0 0 30px rgba(255,255,255,0.1)`;
        }
      }

      if (activeHoverIndex !== -1 && hoverWeight.val > 0) {
        if (i === activeHoverIndex) {
          x += hoverWeight.val * -80; z += hoverWeight.val * 100; rotY -= hoverWeight.val * 10;
          boxShadow = `0 40px 80px rgba(139,92,246,${0.6 * hoverWeight.val}), inset 0 0 30px rgba(255,255,255,0.1)`;
        } else if (i > activeHoverIndex) {
          x += hoverWeight.val * 150; z += hoverWeight.val * -250;
          opacity = Math.max(0, opacity - (hoverWeight.val * 0.4));
          blur += hoverWeight.val * 5;
        } else {
          x += hoverWeight.val * -150;
        }
      }

      const globalOffsetX = -window.innerWidth * 0.15;
      gsap.set(card, { x: x + globalOffsetX, y, z, rotationY: rotY, scale, opacity, filter: `blur(${blur}px)`, boxShadow });
    });
  };

  updateCards(0);

  cards.forEach((card, i) => {
    const galleryPanel = card.querySelector('.card-expanded-gallery');
    const memoryImgs   = card.querySelectorAll('.expanded-memory-img');

    card.addEventListener('mouseenter', () => {
      const d = i - proxy.progress;
      if (Math.abs(d) > 0.8) return;
      activeHoverIndex = i;
      gsap.to(hoverWeight, { val: 1, duration: 0.8, ease: 'power3.out', onUpdate: () => updateCards(proxy.progress) });
      if (galleryPanel) {
        gsap.killTweensOf(galleryPanel); gsap.killTweensOf(memoryImgs);
        gsap.set(galleryPanel, { x: -40 });
        gsap.to(galleryPanel, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' });
        gsap.set(memoryImgs, { y: 20, rotation: 0, scale: 0.95 });
        gsap.to(memoryImgs, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.1 });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (activeHoverIndex !== i) return;
      gsap.to(hoverWeight, {
        val: 0, duration: 0.6, ease: 'power3.out',
        onUpdate: () => updateCards(proxy.progress),
        onComplete: () => { if (hoverWeight.val === 0) activeHoverIndex = -1; },
      });
      if (galleryPanel) {
        gsap.killTweensOf(galleryPanel); gsap.killTweensOf(memoryImgs);
        gsap.to(memoryImgs, { autoAlpha: 0, y: -10, scale: 0.95, duration: 0.4, stagger: 0.05, ease: 'power2.in' });
        gsap.to(galleryPanel, { autoAlpha: 0, x: -20, duration: 0.5, ease: 'power2.in', delay: 0.1 });
      }
    });
  });

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: `+=${totalCards * 600}`,
    pin: true,
    scrub: 2.5,
    animation: gsap.to(proxy, {
      progress: totalCards - 1,
      ease: 'none',
      onUpdate: () => updateCards(proxy.progress),
    }),
    refreshPriority: 10,
  });
  }); // close ctx

  function onMouseMove(e) {
    const rect = section.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(track, { rotationY: mouseX * 8, rotationX: -mouseY * 8, duration: 2.5, ease: 'power3.out' });
  }
  function onMouseLeave() {
    gsap.to(track, { rotationY: 0, rotationX: 0, duration: 2.5, ease: 'power3.out' });
  }

  section.addEventListener('mousemove', onMouseMove);
  section.addEventListener('mouseleave', onMouseLeave);

  return () => {
    section.removeEventListener('mousemove', onMouseMove);
    section.removeEventListener('mouseleave', onMouseLeave);
    ctx.revert();
  };
}
