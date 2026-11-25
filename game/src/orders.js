// Ember & Oak — orders: the ticket rail. Orders arrive, wait with a
// patience bar, and are matched against a finished plate.

import { RECIPES, TUNING } from './data.js';

let nextOrderId = 1;

export class OrderDeck {
  constructor() {
    this.orders = [];
    this.spawnTimer = TUNING.spawnFirstSeconds;
    this.lastRecipeId = null;
  }

  reset() {
    this.orders = [];
    this.spawnTimer = TUNING.spawnFirstSeconds;
    this.lastRecipeId = null;
  }

  patienceFor(rush) {
    return rush ? TUNING.patienceRushSeconds : TUNING.patienceSeconds;
  }

  spawnGap(rush) {
    return rush ? TUNING.spawnGapRushSeconds : TUNING.spawnGapSeconds;
  }

  // Pick a recipe, avoiding an immediate repeat when there is a choice.
  pickRecipe() {
    const pool = RECIPES.filter((r) => r.id !== this.lastRecipeId);
    const recipe = pool[Math.floor(Math.random() * pool.length)];
    this.lastRecipeId = recipe.id;
    return recipe;
  }

  addOrder(rush) {
    if (this.orders.length >= TUNING.maxOrders) return null;
    const recipe = this.pickRecipe();
    const patience = this.patienceFor(rush);
    const order = {
      id: nextOrderId++,
      recipe,
      patience,
      maxPatience: patience,
      needs: [...recipe.needs],
    };
    this.orders.push(order);
    return order;
  }

  // Advance timers; returns orders that expired this tick.
  update(dt, rush, timeLeft) {
    const expired = [];
    if (timeLeft > 0 && this.orders.length < TUNING.maxOrders) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.addOrder(rush);
        this.spawnTimer = this.spawnGap(rush);
      }
    }
    for (const order of this.orders) order.patience -= dt;
    this.orders = this.orders.filter((o) => {
      if (o.patience <= 0) {
        expired.push(o);
        return false;
      }
      return true;
    });
    return expired;
  }

  // Does a plate's contents match this order exactly (same items, any order)?
  static plateMatches(order, plateItems) {
    if (plateItems.length !== order.needs.length) return false;
    const have = [...plateItems].sort();
    const want = [...order.needs].sort();
    return have.every((item, i) => item === want[i]);
  }

  findMatch(plateItems) {
    return this.orders.find((o) => OrderDeck.plateMatches(o, plateItems)) ?? null;
  }

  remove(order) {
    this.orders = this.orders.filter((o) => o.id !== order.id);
  }
}
