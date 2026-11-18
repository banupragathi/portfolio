// src/utils/canvas.js

/**
 * Resize a canvas to match its display size (DPR-aware)
 */
export function resizeCanvas(canvas, dprCap = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const w   = window.innerWidth;
  const h   = window.innerHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h, dpr };
}

/**
 * Resize a canvas to match a given parent element
 */
export function resizeCanvasToParent(canvas, parent) {
  canvas.width  = parent.offsetWidth;
  canvas.height = parent.offsetHeight;
}

/**
 * Create a cancel-able RAF loop
 */
export function createRafLoop(fn) {
  let id;
  const tick = (ts) => {
    fn(ts);
    id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(id);
}
