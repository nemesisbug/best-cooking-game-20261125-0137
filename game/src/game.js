// Ember & Oak — game: state, the shift clock, cooking stations,
// interactions, scoring and the rush hour.

import { INGREDIENTS, RECIPES, TUNING, SHIFT_SECONDS, RUSH_AT_SECONDS_LEFT } from './data.js';
import { STATIONS, stationAt, clampToFloor } from './kitchen.js';
import { OrderDeck } from './orders.js';
import { Chef } from './chef.js';
import { SoundBank } from './audio.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sounds = new SoundBank();
    this.state = 'title'; // title | playing | paused | over
    this.time = 0; // wall-clock seconds since boot (drives animation)
    this.timeLeft = SHIFT_SECONDS;
    this.score = 0;
    this.coins = 0;
    this.served = 0;
    this.lost = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.rush = false;
    this.rushAnnounced = false;
    this.deck = new OrderDeck();
    this.chef = new Chef(800, 560);
    this.grill = { heat: 55, slots: [null, null] };
    this.pot = { slot: null };
    this.board = { item: null }; // {key, id, chops, done}
    this.plateOnCounter = null; // {items: []}
    this.floaters = [];
    this.particles = [];
    this.toast = '';
    this.toastLife = 0;
    this.serveFlash = 0;
    this.grade = 'C';
    this.keys = new Set();
    this.lastTickSecond = -1;
    this.spawnEmberTimer = 0;
  }

  startShift() {
    this.state = 'playing';
    this.timeLeft = SHIFT_SECONDS;
    this.score = 0;
    this.coins = 0;
    this.served = 0;
    this.lost = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.rush = false;
    this.rushAnnounced = false;
    this.deck.reset();
    this.chef.reset(800, 560);
    this.grill = { heat: 55, slots: [null, null] };
    this.pot = { slot: null };
    this.board = { item: null };
    this.plateOnCounter = null;
    this.floaters = [];
    this.particles = [];
    this.serveFlash = 0;
    this.setToast('Shift started — first ticket coming!');
    this.sounds.ensure();
  }

  setToast(text) {
    this.toast = text;
    this.toastLife = 2.6;
  }

  addFloater(x, y, text, color, size = 22) {
    this.floaters.push({ x, y, text, color, size, life: 1.4, maxLife: 1.4 });
  }

  burst(x, y, color, n = 10) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 30 + Math.random() * 70;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 40,
        size: 2 + Math.random() * 3,
        color,
        life: 0.7 + Math.random() * 0.5,
        maxLife: 1.2,
      });
    }
  }

  // ---------------------------------------------------------- main update

  update(dt) {
    this.time += dt;
    if (this.toastLife > 0) this.toastLife -= dt;
    if (this.serveFlash > 0) this.serveFlash -= dt;
    for (const f of this.floaters) {
      f.life -= dt;
      f.y -= 34 * dt;
    }
    this.floaters = this.floaters.filter((f) => f.life > 0);
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 60 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    if (this.state !== 'playing') return;

    // Shift clock.
    this.timeLeft -= dt;
    const whole = Math.ceil(this.timeLeft);
    if (whole !== this.lastTickSecond) {
      this.lastTickSecond = whole;
      if (whole <= 10 && whole > 0) this.sounds.tick();
    }
    if (this.timeLeft <= RUSH_AT_SECONDS_LEFT && !this.rush) {
      this.rush = true;
      if (!this.rushAnnounced) {
        this.rushAnnounced = true;
        this.addFloater(640, 300, 'RUSH HOUR — DOUBLE COINS!', '#ff7a2f', 34);
        this.sounds.rush();
      }
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endShift();
      return;
    }

    // Orders.
    const before = this.deck.orders.length;
    const expired = this.deck.update(dt, this.rush, this.timeLeft);
    if (this.deck.orders.length > before) this.sounds.orderIn();
    for (const order of expired) {
      this.lost++;
      this.combo = 0;
      this.setToast(`Ticket lost: ${order.recipe.name} walked out!`);
      this.addFloater(174, 200, 'ORDER LOST', '#d94f3d', 20);
    }

    // Fire: heat decays; embers rise.
    this.grill.heat = Math.max(0, this.grill.heat - TUNING.heatDecayPerSecond * dt);
    this.spawnEmberTimer -= dt;
    if (this.spawnEmberTimer <= 0) {
      this.spawnEmberTimer = 0.25;
      this.particles.push({
        x: 420 + Math.random() * 140,
        y: 150,
        vx: (Math.random() - 0.5) * 12,
        vy: -28 - Math.random() * 20,
        size: 1.5 + Math.random() * 2,
        color: Math.random() < 0.5 ? '#ff7a2f' : '#ffc23d',
        life: 0.9,
        maxLife: 0.9,
      });
    }

    // Grill slots cook at a rate set by the fire.
    for (const slot of this.grill.slots) {
      if (!slot || !slot.item) continue;
      const rate = 0.25 + (this.grill.heat / 100) * 1.5;
      slot.progress += rate * dt;
      if (!slot.done && slot.progress >= slot.cookSeconds) {
        slot.done = true;
        slot.overcook = 0;
        this.sounds.sizzle();
        this.addFloater(490, 120, 'READY!', '#7cb342', 16);
      } else if (slot.done) {
        slot.overcook += dt;
        if (slot.overcook >= TUNING.burnSecondsAfterDone && !slot.burnt) {
          slot.burnt = true;
          slot.item = { ...slot.item, key: `${slot.item.id}:burnt` };
          this.setToast('Something burned on the grill!');
        }
      }
    }

    // Pot simmers on its own clock.
    const potSlot = this.pot.slot;
    if (potSlot && potSlot.item) {
      potSlot.progress += dt;
      if (!potSlot.done && potSlot.progress >= potSlot.cookSeconds) {
        potSlot.done = true;
        potSlot.overcook = 0;
        this.sounds.sizzle();
        this.addFloater(760, 120, 'READY!', '#7cb342', 16);
      } else if (potSlot.done) {
        potSlot.overcook += dt;
        if (potSlot.overcook >= TUNING.burnSecondsAfterDone && !potSlot.burnt) {
          potSlot.burnt = true;
          potSlot.item = { ...potSlot.item, key: `${potSlot.item.id}:burnt` };
          this.setToast('Something burned in the pot!');
        }
      }
    }

    // Chef movement (keyboard or click-to-walk).
    this.chef.update(dt);
    if (this.keys.size > 0) {
      let dx = 0;
      let dy = 0;
      if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) dx -= 1;
      if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) dx += 1;
      if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) dy -= 1;
      if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) dy += 1;
      if (dx !== 0 || dy !== 0) this.chef.nudge(dx, dy, dt);
    }
  }

  endShift() {
    this.state = 'over';
    this.grade =
      this.served >= 12 ? 'S' : this.served >= 9 ? 'A' : this.served >= 6 ? 'B' : this.served >= 3 ? 'C' : 'D';
    this.sounds.serve();
  }

  // ---------------------------------------------------------- interactions

  // Canvas click in CSS pixels -> canvas pixels.
  clickAt(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 1280;
    const y = ((clientY - rect.top) / rect.height) * 720;
    this.handleClick(x, y);
  }

  handleClick(x, y) {
    this.sounds.ensure();
    if (this.state === 'title') {
      this.startShift();
      return;
    }
    if (this.state === 'over') return;
    if (this.state === 'paused') return;
    const hit = stationAt(x, y);
    if (!hit) {
      this.chef.walkTo(clampToFloor({ x, y }));
      return;
    }
    const { station, part, id } = hit;
    const front = station.front;
    const run = () => this.useStation(station, part, id);
    const dist = Math.hypot(this.chef.x - front.x, this.chef.y - front.y);
    if (dist < 70) run();
    else this.chef.walkTo(front, run);
  }

  // Space / E: use the nearest station in reach.
  interactNearest() {
    if (this.state !== 'playing') return;
    let best = null;
    let bestDist = 90;
    const all = [
      ...STATIONS.bins,
      STATIONS.board,
      STATIONS.grill,
      STATIONS.pot,
      STATIONS.plates,
      STATIONS.counter,
      STATIONS.serve,
      STATIONS.trash,
    ];
    for (const s of all) {
      const d = Math.hypot(this.chef.x - s.front.x, this.chef.y - s.front.y);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    if (best) this.useStation(best, null, best.id ?? null);
  }

  useStation(station, part, id) {
    if (this.state !== 'playing') return;
    switch (station.kind) {
      case 'bin': this.useBin(id); break;
      case 'board': this.useBoard(); break;
      case 'grill':
        if (part === 'bellows') this.useBellows();
        else if (part === 'slot0') this.useGrillSlot(0);
        else if (part === 'slot1') this.useGrillSlot(1);
        else this.useGrillSlot(this.grill.slots[0] ? 1 : 0);
        break;
      case 'pot': this.usePot(); break;
      case 'plates': this.usePlateStack(); break;
      case 'counter': this.useCounter(); break;
      case 'serve': this.useServe(); break;
      case 'trash': this.useTrash(); break;
      default: break;
    }
  }

  useBin(id) {
    const def = INGREDIENTS[id];
    if (!def) return;
    if (this.chef.hands) {
      this.setToast('Hands full — serve, plate or trash it first.');
      this.sounds.error();
      return;
    }
    this.chef.hands = { kind: 'item', id, key: `${id}:raw` };
    this.sounds.pickup();
  }

  useBoard() {
    const item = this.board.item;
    if (!item) {
      // Place a raw, choppable item on the board.
      const hands = this.chef.hands;
      if (!hands || hands.kind === 'plate') {
        this.setToast('Bring a raw ingredient to chop.');
        return;
      }
      const def = INGREDIENTS[hands.id];
      if (!def.chop) {
        this.setToast(`${def.name} does not need chopping.`);
        this.sounds.error();
        return;
      }
      this.board.item = { key: hands.key, id: hands.id, chops: 0, done: false };
      this.chef.hands = null;
      this.sounds.place();
      return;
    }
    if (!item.done) {
      item.chops += 1;
      this.sounds.chop();
      this.burst(670, 330, '#d8c9a8', 5);
      if (item.chops >= TUNING.chopHits) {
        item.done = true;
        item.key = `${item.id}:chopped`;
      }
      return;
    }
    // Pick the chopped item up.
    if (this.chef.hands) {
      this.setToast('Hands full — put something down first.');
      this.sounds.error();
      return;
    }
    this.chef.hands = { kind: 'item', id: item.id, key: item.key };
    this.board.item = null;
    this.sounds.pickup();
  }

  useGrillSlot(i) {
    const slot = this.grill.slots[i];
    if (!slot || !slot.item) {
      const hands = this.chef.hands;
      if (!hands || hands.kind === 'plate') {
        this.setToast('Bring something raw to grill.');
        return;
      }
      const def = INGREDIENTS[hands.id];
      if (!def.grill) {
        this.setToast(`${def.name} does not go on the grill.`);
        this.sounds.error();
        return;
      }
      this.grill.slots[i] = {
        item: { ...hands },
        progress: 0,
        cookSeconds: TUNING.grillSecondsAtFullHeat,
        done: false,
        overcook: 0,
        burnt: false,
      };
      this.chef.hands = null;
      this.sounds.place();
      return;
    }
    if (!slot.done) {
      this.setToast('Still cooking — watch the ring, and mind the fire.');
      return;
    }
    if (this.chef.hands) {
      this.setToast('Hands full — put something down first.');
      this.sounds.error();
      return;
    }
    // A burnt item can be picked up too — it has to go to the trash.
    // A finished item leaves the grill as grilled; a burnt one keeps its burnt key.
    const key = slot.burnt ? slot.item.key : `${slot.item.id}:grilled`;
    this.chef.hands = { kind: 'item', id: slot.item.id, key };
    this.grill.slots[i] = null;
    this.sounds.pickup();
  }

  useBellows() {
    this.grill.heat = Math.min(100, this.grill.heat + TUNING.heatBellowsBoost);
    this.sounds.bellows();
    this.burst(490, 150, '#ff7a2f', 8);
    this.addFloater(640, 130, `FIRE ${Math.round(this.grill.heat)}°`, '#ff7a2f', 15);
  }

  usePot() {
    const slot = this.pot.slot;
    if (!slot || !slot.item) {
      const hands = this.chef.hands;
      if (!hands || hands.kind === 'plate') {
        this.setToast('Bring a chopped ingredient to simmer.');
        return;
      }
      const def = INGREDIENTS[hands.id];
      if (!def.pot || hands.key !== `${hands.id}:chopped`) {
        this.setToast('The pot takes chopped ingredients.');
        this.sounds.error();
        return;
      }
      this.pot.slot = {
        item: { ...hands },
        progress: 0,
        cookSeconds: TUNING.potSeconds,
        done: false,
        overcook: 0,
        burnt: false,
      };
      this.chef.hands = null;
      this.sounds.place();
      return;
    }
    if (!slot.done) {
      this.setToast('Still simmering — give it a moment.');
      return;
    }
    if (this.chef.hands) {
      this.setToast('Hands full — put something down first.');
      this.sounds.error();
      return;
    }
    // A burnt item can be picked up too — it has to go to the trash.
    const key = slot.burnt ? slot.item.key : `${slot.item.id}:simmered`;
    this.chef.hands = { kind: 'item', id: slot.item.id, key };
    this.pot.slot = null;
    this.sounds.pickup();
  }

  usePlateStack() {
    if (this.chef.hands) {
      this.setToast('Hands full — put something down first.');
      this.sounds.error();
      return;
    }
    this.chef.hands = { kind: 'plate', items: [] };
    this.sounds.pickup();
  }

  useCounter() {
    const hands = this.chef.hands;
    // Put a carried plate down, or pick the plate up.
    if (hands && hands.kind === 'plate') {
      if (this.plateOnCounter) {
        this.setToast('A plate is already on the counter.');
        this.sounds.error();
        return;
      }
      this.plateOnCounter = hands;
      this.chef.hands = null;
      this.sounds.place();
      return;
    }
    if (!hands && this.plateOnCounter) {
      this.chef.hands = this.plateOnCounter;
      this.plateOnCounter = null;
      this.sounds.pickup();
      return;
    }
    // Add a prepared item to the plate on the counter.
    if (hands && hands.kind === 'item') {
      if (!this.plateOnCounter) {
        this.setToast('Put a plate on the counter first.');
        this.sounds.error();
        return;
      }
      if (hands.key.endsWith(':raw') && hands.id !== 'bun') {
        this.setToast('That still needs cooking — chop, grill or simmer it first.');
        this.sounds.error();
        return;
      }
      if (hands.key.endsWith(':burnt')) {
        this.setToast('Burnt food never goes on a plate. Trash it.');
        this.sounds.error();
        return;
      }
      this.plateOnCounter.items.push(hands.key);
      this.chef.hands = null;
      this.sounds.place();
      return;
    }
    this.setToast('Bring a plate or a prepared item to the counter.');
  }

  useServe() {
    const hands = this.chef.hands;
    if (!hands || hands.kind !== 'plate') {
      this.setToast('Bring a finished plate to the serve window.');
      return;
    }
    if (hands.items.length === 0) {
      this.setToast('An empty plate serves nobody.');
      this.sounds.error();
      return;
    }
    const order = this.deck.findMatch(hands.items);
    if (!order) {
      this.setToast('No ticket matches this plate — check the order rail.');
      this.sounds.error();
      this.combo = 0;
      return;
    }
    // Serve it.
    const patienceBonus = Math.round((order.patience / order.maxPatience) * 6);
    const rushMult = this.rush ? 2 : 1;
    const comboMult = 1 + Math.min(this.combo, 4) * 0.25;
    const earned = Math.round((order.recipe.coins + patienceBonus) * rushMult * comboMult);
    this.coins += earned;
    this.score += earned * 10;
    this.served++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.deck.remove(order);
    this.chef.hands = null;
    this.serveFlash = 0.9;
    this.sounds.serve();
    this.burst(1106, 150, '#f2c230', 16);
    this.addFloater(1106, 220, `+${earned} coins`, '#f2c230', 24);
    if (this.combo >= 2) this.addFloater(1106, 250, `COMBO x${this.combo}`, '#ff7a2f', 18);
    this.setToast(`${order.recipe.name} served! +${earned} coins.`);
  }

  useTrash() {
    if (!this.chef.hands) {
      this.setToast('Nothing in your hands to trash.');
      return;
    }
    this.chef.hands = null;
    this.sounds.place();
    this.setToast('Tossed it.');
  }
}
