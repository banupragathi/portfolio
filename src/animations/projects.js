// src/animations/projects.js
// GSAP stacked-deck animation for the Projects section
import { gsap, ScrollTrigger } from '../lib/gsap';

export function initProjectsAnimation(stackContainerRef) {
  const stackContainer = stackContainerRef.current;
  if (!stackContainer) return;

  const projectCards = gsap.utils.toArray('.project-landscape-card', stackContainer);
  if (projectCards.length === 0) return;

  // Global pause state for the entire section
  const style = document.createElement('style');
  style.id = 'projects-animation-controller';
  style.innerHTML = `
    .projects-stack:not(.stack-in-view) .proj-visual-scene * { animation-play-state: paused !important; }
    .project-landscape-card:not(.is-playing-animation) .proj-visual-scene * { animation-play-state: paused !important; }
  `;
  if (!document.getElementById('projects-animation-controller')) {
    document.head.appendChild(style);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      stackContainer.classList.add('stack-in-view');
    } else {
      stackContainer.classList.remove('stack-in-view');
    }
  }, { threshold: 0.1 });
  observer.observe(stackContainer);

  let ctx = gsap.context(() => {
    // Set initial states
    projectCards.forEach((card, i) => {
      // First card physically starts out actively playing
      if (i === 0) card.classList.add('is-playing-animation');

      const visualScene = card.querySelector('.proj-visual-scene');
      const contentEls  = card.querySelectorAll('.proj-category, .proj-title, .proj-desc, .proj-quote, .proj-tech, .btn-proj-action');

      if (i === 0) {
        gsap.set(card, { scale: 1, opacity: 1, y: 0 });
        gsap.set(contentEls, { opacity: 1, y: 0 });
        if (visualScene) gsap.set(visualScene, { opacity: 1, scale: 1, filter: 'blur(0px)' });
      } else {
        gsap.set(card, {
          scale:   1 - (i * 0.05),
          opacity: 1 - (i * 0.15),
          y:       i * 80,
        });
        gsap.set(contentEls, { opacity: 0, y: 20 });
        if (visualScene) gsap.set(visualScene, { opacity: 0, scale: 0.95, filter: 'blur(10px)' });
      }
    });

    const deckTl = gsap.timeline();

    for (let i = 0; i < projectCards.length - 1; i++) {
      const currentCard = projectCards[i];
      const nextCard    = projectCards[i + 1];
      const nextContent = nextCard.querySelectorAll('.proj-category, .proj-title, .proj-desc, .proj-quote, .proj-tech, .btn-proj-action');
      const nextVisual  = nextCard.querySelector('.proj-visual-scene');

      const stepTl = gsap.timeline();

      stepTl.to(currentCard, {
        y: -200, opacity: 0, scale: 1.05,
        ease: 'power2.inOut', duration: 1
      }, 0);

      for (let j = i + 1; j < projectCards.length; j++) {
        const newIndex = j - (i + 1);
        stepTl.to(projectCards[j], {
          scale:   1 - (newIndex * 0.05),
          opacity: 1 - (newIndex * 0.15),
          y:       newIndex * 80,
          ease: 'power2.inOut', duration: 1
        }, 0);
      }

      stepTl.to(nextContent, {
        opacity: 1, y: 0,
        duration: 0.6, stagger: 0.05, ease: 'power2.out'
      }, 0.4);

      if (nextVisual) {
        stepTl.to(nextVisual, {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 0.6, ease: 'power2.out'
        }, 0.4);
      }

      deckTl.add(stepTl);
    }

    ScrollTrigger.create({
      trigger: stackContainer,
      start: 'top 10%',
      end: `+=${(projectCards.length - 1) * 120}%`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: 1,
      animation: deckTl,
      refreshPriority: 5,
      onUpdate: (self) => {
        const activeIndex = Math.round(self.progress * (projectCards.length - 1));
        projectCards.forEach((card, idx) => {
          if (idx === activeIndex) {
            card.classList.add('is-playing-animation');
          } else {
            card.classList.remove('is-playing-animation');
          }
        });
      }
    });
  }, stackContainer);

  return () => {
    observer.disconnect();
    ctx.revert();
  };
}
