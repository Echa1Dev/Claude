/**
 * MathUtils — utilidades matemáticas para animaciones y shaders.
 */

export const lerp = (a, b, t) => a + (b - a) * t;

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const map = (v, inMin, inMax, outMin, outMax) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

export const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const randomRange = (min, max) => min + Math.random() * (max - min);

export const randomInt = (min, max) => Math.floor(randomRange(min, max + 1));

export const degToRad = (deg) => (deg * Math.PI) / 180;

export const radToDeg = (rad) => (rad * 180) / Math.PI;

// Interpolación esférica simple para rotaciones
export const slerpAngle = (a, b, t) => {
  let diff = b - a;
  while (diff > Math.PI)  diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
};

// Hash determinístico para posiciones de partículas (evita Math.random en updates)
export const hash = (n) => {
  let x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
};
