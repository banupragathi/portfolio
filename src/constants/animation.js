// src/constants/animation.js
export const ANIMATION = {
  lenisDuration: 1.1,
  lenisEasing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  scrubSky: 1.5,
  scrubProjects: 1,
  scrubIslands: 1.5,
  scrubGallery: 2.5,
  scrubJourney: 1,
};
