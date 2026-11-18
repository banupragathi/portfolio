// src/hooks/useMasterTimeline.js
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export function useMasterTimeline() {
  useEffect(() => {
    let ctx = gsap.context(() => {
      const globalBg = document.getElementById('global-bg');
      const sunContainer = document.getElementById('sun-container');
      const starsCanvas = document.getElementById('stars-canvas');
      const meshContainer = document.querySelector('.mesh-container');
      const sunWrapper = document.getElementById('sun-wrapper');

      if (globalBg && sunContainer && sunWrapper) {
        const tl = gsap.timeline({
          scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: 1.5, // cinematic smooth scrubbing
          }
        });

        // 1. Background Color Transition (Sunrise -> Morning -> Sunset -> Night)
        // Set initial Sunrise color slightly darker for the 'Hello' section
        gsap.set(globalBg, { backgroundColor: '#350b2d' }); 
        
        tl.to(globalBg, { backgroundColor: '#d97736', duration: 15, ease: 'sine.inOut' }, 0)    // 0-15%: Sunrise to Morning (warm golden orange)
          .to(globalBg, { backgroundColor: '#4a2f73', duration: 25, ease: 'sine.inOut' }, 15)   // 15-40%: Morning to Sunset (purple/lavender)
          .to(globalBg, { backgroundColor: '#0f2b46', duration: 35, ease: 'sine.inOut' }, 40)   // 40-75%: Sunset to Dusk (Deep blue across Projects & Skills)
          .to(globalBg, { backgroundColor: '#050816', duration: 20, ease: 'sine.inOut'}, 80);   // 80-100%: Dusk to Night (Cosmic night starting after Skills)

        // Pin the Sun Wrapper at 30% from the top of viewport
        ScrollTrigger.create({
          trigger: sunWrapper,
          start: 'top 30%',
          end: 'max',
          pin: true,
          pinSpacing: false,
          refreshPriority: 20,
        });

        // 2. Sun Movement (Rise and Descend arc)
        // Start low (y: '70vh' puts it just above the bottom edge when pinned at 30%).
        gsap.set(sunContainer, { scale: 0.8, y: '70vh' }); 
        
        tl.to(sunContainer, { y: '0vh', scale: 1.25, duration: 15, ease: 'sine.out' }, 0) // 0-15%: Sun rises to peak height in Morning
          .to(sunContainer, { y: '35vh', scale: 1.0, duration: 25, ease: 'none' }, 15) // 15-40%: Sun gently descends during Sunset
          .to(sunContainer, { y: '50vh', scale: 0.9, duration: 35, ease: 'none' }, 40) // 40-75%: Sun continues slowly across Projects & Skills, still highly visible
          .to(sunContainer, { y: '80vh', duration: 20, ease: 'sine.inOut' }, 80); // 80-100%: Sun finishes setting completely after the 5th skill card

        // 3. Stars Opacity
        if (starsCanvas) {
          gsap.set(starsCanvas, { opacity: 0.4 }); // More visible at early dark sunrise
          tl.to(starsCanvas, { opacity: 0, duration: 10, ease: 'sine.inOut' }, 0)  // Fade out fully for Morning
            .to(starsCanvas, { opacity: 1, duration: 15, ease: 'sine.inOut' }, 85);  // Fade back in for cosmic night
        }

        // 4. Mesh Opacity (Atmospheric haze)
        if (meshContainer) {
          gsap.set(meshContainer, { opacity: 0.65 }); // Slightly reduced haze for a darker early sky
          tl.to(meshContainer, { opacity: 0.35, duration: 15, ease: 'sine.inOut' }, 15) // Clearer sky in Morning
            .to(meshContainer, { opacity: 0.85, duration: 25, ease: 'sine.inOut' }, 40) // Colorful haze at sunset
            .to(meshContainer, { opacity: 0.35, duration: 15, ease: 'sine.inOut' }, 85); // Calm at night
        }
      }

      // Staggered reveal animations with ScrollTrigger
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach((el) => {
        gsap.fromTo(el, {
          opacity: 0,
          y: 35
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

    });

    return () => ctx.revert();
  }, []);
}
