// Ember & Oak — kitchen layout: every station's rectangle, its front
// (where the chef stands to use it) and hit-testing for mouse clicks.

import { INGREDIENT_ORDER } from './data.js';

export const STATIONS = {
  // Six ingredient crates along the bottom.
  bins: INGREDIENT_ORDER.map((id, i) => ({
    kind: 'bin',
    id,
    rect: { x: 380 + i * 140, y: 500, w: 132, h: 112 },
    front: { x: 380 + i * 140 + 66, y: 646 },
  })),
  // The chopping board on the island counter.
  board: {
    kind: 'board',
    rect: { x: 560, y: 280, w: 220, h: 120 },
    front: { x: 670, y: 440 },
  },
  // The grill: two slots over the hearth fire, plus the bellows.
  grill: {
    kind: 'grill',
    rect: { x: 380, y: 76, w: 220, h: 120 },
    front: { x: 490, y: 236 },
    slots: [
      { rect: { x: 398, y: 96, w: 88, h: 72 } },
      { rect: { x: 496, y: 96, w: 88, h: 72 } },
    ],
    bellows: { rect: { x: 612, y: 96, w: 56, h: 72 } },
  },
  // The simmering pot.
  pot: {
    kind: 'pot',
    rect: { x: 700, y: 76, w: 120, h: 120 },
    front: { x: 760, y: 236 },
    slot: { rect: { x: 716, y: 96, w: 88, h: 72 } },
  },
  // The plate stack.
  plates: {
    kind: 'plates',
    rect: { x: 850, y: 76, w: 80, h: 120 },
    front: { x: 890, y: 236 },
  },
  // The plating counter where a dish is assembled.
  counter: {
    kind: 'counter',
    rect: { x: 840, y: 280, w: 220, h: 120 },
    front: { x: 950, y: 440 },
  },
  // The serve window on the right of the back counter.
  serve: {
    kind: 'serve',
    rect: { x: 960, y: 76, w: 292, h: 120 },
    front: { x: 1106, y: 236 },
  },
  // The trash bin.
  trash: {
    kind: 'trash',
    rect: { x: 1120, y: 280, w: 132, h: 100 },
    front: { x: 1186, y: 420 },
  },
};

export function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

// The station (and sub-part) under a canvas point, or null for open floor.
// Returns { station, part, id } where part is 'slot0' | 'slot1' | 'bellows' | 'slot' | null.
export function stationAt(x, y) {
  for (const bin of STATIONS.bins) {
    if (pointInRect(x, y, bin.rect)) return { station: bin, part: null, id: bin.id };
  }
  const g = STATIONS.grill;
  for (let i = 0; i < g.slots.length; i++) {
    if (pointInRect(x, y, g.slots[i].rect)) return { station: g, part: `slot${i}`, id: null };
  }
  if (pointInRect(x, y, g.bellows.rect)) return { station: g, part: 'bellows', id: null };
  if (pointInRect(x, y, g.rect)) return { station: g, part: null, id: null };
  const p = STATIONS.pot;
  if (pointInRect(x, y, p.slot.rect)) return { station: p, part: 'slot', id: null };
  if (pointInRect(x, y, p.rect)) return { station: p, part: null, id: null };
  for (const key of ['board', 'plates', 'counter', 'serve', 'trash']) {
    const s = STATIONS[key];
    if (pointInRect(x, y, s.rect)) return { station: s, part: null, id: null };
  }
  return null;
}

// The chef's walkable floor, as a rectangle the chef's feet stay inside.
export const FLOOR = { x: 360, y: 210, w: 900, h: 470 };

export function clampToFloor(p) {
  return {
    x: Math.max(FLOOR.x + 14, Math.min(FLOOR.x + FLOOR.w - 14, p.x)),
    y: Math.max(FLOOR.y + 14, Math.min(FLOOR.y + FLOOR.h - 14, p.y)),
  };
}
