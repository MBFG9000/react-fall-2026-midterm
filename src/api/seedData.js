import { GENRES, STATUSES } from '../constants.js';

const ADJECTIVES = ['Silent', 'Golden', 'Hidden', 'Broken', 'Last', 'Crimson', 'Forgotten', 'Endless', 'Hollow', 'Midnight', 'Distant', 'Burning'];
const NOUNS = ['Garden', 'Empire', 'Signal', 'Harbor', 'Compass', 'Archive', 'Orchard', 'Kingdom', 'Letter', 'Horizon', 'Tower', 'River'];
const AUTHORS = [
  'Elena Marsh', 'Tomas Reyes', 'Aiko Tanaka', 'Daniel Okafor', 'Sofia Lindqvist', 'Marcus Webb',
  'Priya Nair', 'Henrik Olsen', 'Amara Diallo', 'Lucas Ferreira', 'Mira Kovac', 'Oliver Grant',
  'Yuna Park', 'Samuel Adeyemi', 'Clara Beaumont', 'Rafael Soto', 'Nadia Karim', 'Victor Hale',
];
const BLURBS = {
  Fantasy: 'A reluctant hero crosses forgotten lands to restore a fading magic.',
  'Sci-Fi': 'A crew on the edge of known space uncovers a message that was never meant to be found.',
  Mystery: 'A quiet town hides a secret, and one detective is determined to uncover it.',
  Romance: 'Two people with opposite plans for their future are forced to share one summer.',
  History: 'A vivid account of the people and decisions that shaped a turning point in history.',
  Biography: 'An intimate portrait of a life shaped by ambition, doubt and unlikely friendships.',
  Thriller: 'Every clue brings the protagonist closer to a truth someone will kill to protect.',
  Science: 'A curious guide to the ideas that changed how we understand the world around us.',
};

// small deterministic PRNG so every visitor gets the same 120 starting books
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateBooks(count = 120) {
  const rand = mulberry32(2024);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const combos = [];
  for (const a of ADJECTIVES) for (const n of NOUNS) combos.push([a, n]);
  // Fisher-Yates shuffle with the seeded generator
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }
  return combos.slice(0, count).map(([adj, noun], i) => {
    const genre = pick(GENRES);
    return {
      id: i + 1,
      title: `The ${adj} ${noun}`,
      author: pick(AUTHORS),
      genre,
      year: 1960 + Math.floor(rand() * 65),
      pages: 160 + Math.floor(rand() * 560),
      rating: 1 + Math.floor(rand() * 5),
      status: pick(STATUSES).value,
      description: BLURBS[genre],
    };
  });
}
