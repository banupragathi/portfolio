// src/utils/helpers.js

/**
 * Easing function matching Lenis smooth scroll
 */
export const easeOutExpo = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Linear interpolation
 */
export const lerp = (start, end, t) => start + (end - start) * t;

/**
 * Get scroll-safe section trigger offset
 */
export const getSectionOffset = (el, offset = 0) => {
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY + offset;
};
