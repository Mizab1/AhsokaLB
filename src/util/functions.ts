const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max);

const randomRanged = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);
