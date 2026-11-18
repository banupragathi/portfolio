// src/hooks/useLenis.js
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { ANIMATION } from '../constants/animation';

/**
 * Initializes Lenis smooth scroll, syncs it with GSAP ticker,
 * and returns the lenis instance ref for use by other hooks.
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: ANIMATION.lenisDuration,
      easing: ANIMATION.lenisEasing,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Add lenis RAF to GSAP ticker (single RAF loop)
    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
