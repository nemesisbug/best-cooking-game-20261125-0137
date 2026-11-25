// Ember & Oak — data: ingredients, recipes, tuning and the palette.
// Values live here, not scattered through the game code.

export const VIEW = { w: 1280, h: 720 };

export const SHIFT_SECONDS = 180;
export const RUSH_AT_SECONDS_LEFT = 60;

// One ingredient, three ways to prepare it. `state` is raw | chopped | grilled | simmered | burnt.
export const INGREDIENTS = {
  bun:      { name: 'Bun',      color: '#e8b06a', chop: false, grill: false, pot: false, blurb: 'No prep — straight on the plate.' },
  patty:    { name: 'Patty',    color: '#7a4a2b', chop: false, grill: true,  pot: false, blurb: 'Grill it over the hearth fire.' },
  tomato:   { name: 'Tomato',   color: '#d94f3d', chop: true,  grill: false, pot: false, blurb: 'Chop it on the board.' },
  lettuce:  { name: 'Lettuce',  color: '#7cb342', chop: true,  grill: false, pot: false, blurb: 'Chop it on the board.' },
  mushroom: { name: 'Mushroom', color: '#c9b8a3', chop: true,  grill: true,  pot: true,  blurb: 'Chop, grill or simmer — the versatile one.' },
  corn:     { name: 'Corn',     color: '#f2c230', chop: true,  grill: true,  pot: true,  blurb: 'Chop, grill or simmer.' },
};

export const INGREDIENT_ORDER = ['bun', 'patty', 'tomato', 'lettuce', 'mushroom', 'corn'];

// A recipe is a list of prepared items, each "id:state".
export const RECIPES = [
  {
    id: 'burger', name: 'Ember Burger', coins: 14, color: '#e07840',
    needs: ['bun:raw', 'patty:grilled', 'tomato:chopped', 'lettuce:chopped'],
    tip: 'Bun + grilled patty + chopped tomato + chopped lettuce.',
  },
  {
    id: 'skewer', name: 'Forest Skewer', coins: 12, color: '#a9803e',
    needs: ['mushroom:chopped', 'mushroom:grilled', 'corn:grilled'],
    tip: 'Chopped mushroom + grilled mushroom + grilled corn.',
  },
  {
    id: 'soup', name: 'Golden Corn Soup', coins: 13, color: '#f2c230',
    needs: ['corn:chopped', 'corn:simmered', 'mushroom:chopped'],
    tip: 'Chopped corn + simmered corn + chopped mushroom.',
  },
  {
    id: 'salad', name: 'Garden Salad', coins: 10, color: '#7cb342',
    needs: ['tomato:chopped', 'lettuce:chopped', 'mushroom:chopped', 'corn:chopped'],
    tip: 'Four chopped things on one plate.',
  },
];

export const TUNING = {
  chopHits: 3,
  grillSecondsAtFullHeat: 6,
  potSeconds: 6,
  patienceSeconds: 55,
  patienceRushSeconds: 40,
  spawnFirstSeconds: 2,
  spawnGapSeconds: 14,
  spawnGapRushSeconds: 9,
  heatDecayPerSecond: 4,
  heatBellowsBoost: 28,
  burnSecondsAfterDone: 7,
  chefSpeed: 300,
  maxOrders: 3,
};

export const PALETTE = {
  wall: '#2b1a12',
  wallDark: '#20120c',
  floor: '#4a2f1d',
  floorLine: '#3a2415',
  wood: '#6b4423',
  woodLight: '#8a5a30',
  cream: '#f3e6cf',
  parchment: '#f6ead0',
  ink: '#2e1c10',
  ember: '#ff7a2f',
  gold: '#f2c230',
  green: '#7cb342',
  red: '#d94f3d',
  topbar: '#1d110a',
};
