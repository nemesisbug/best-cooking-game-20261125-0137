// Ember & Oak — the chef: movement, carrying, and the walk-to-then-use queue.

import { clampToFloor } from './kitchen.js';
import { TUNING } from './data.js';

export class Chef {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.target = null; // {x, y} walk target, or null
    this.pending = null; // action to run on arrival: {run} or null
    this.hands = null; // carried item: {key, id, state} | {kind:'plate', items:[]} | null
    this.facing = 1; // 1 right, -1 left
    this.bob = 0; // walk-cycle phase
    this.moving = false;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.target = null;
    this.pending = null;
    this.hands = null;
    this.facing = 1;
    this.bob = 0;
    this.moving = false;
  }

  walkTo(point, pendingAction = null) {
    this.target = clampToFloor(point);
    this.pending = pendingAction;
  }

  // Keyboard nudge: direct movement, clears any queued action.
  nudge(dx, dy, dt) {
    if (dx === 0 && dy === 0) return;
    this.target = null;
    this.pending = null;
    const len = Math.hypot(dx, dy);
    this.x += (dx / len) * TUNING.chefSpeed * dt;
    this.y += (dy / len) * TUNING.chefSpeed * dt;
    const p = clampToFloor({ x: this.x, y: this.y });
    this.x = p.x;
    this.y = p.y;
    if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
    this.moving = true;
    this.bob += dt * 11;
  }

  update(dt) {
    this.moving = false;
    if (!this.target) return;
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 6) {
      this.target = null;
      const action = this.pending;
      this.pending = null;
      if (action) action();
      return;
    }
    const step = Math.min(dist, TUNING.chefSpeed * dt);
    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
    if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
    this.moving = true;
    this.bob += dt * 11;
  }

  carryingPlate() {
    return this.hands !== null && this.hands.kind === 'plate';
  }

  carryingItem() {
    return this.hands !== null && this.hands.kind !== 'plate';
  }
}
