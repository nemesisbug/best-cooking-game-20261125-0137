// Ember & Oak — entry point: boot the game, wire input, run the loop.

import { Game } from './game.js';
import { drawScene } from './render.js';
import { STATIONS } from './kitchen.js';
import { INGREDIENT_ORDER } from './data.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

// Title screen shows the kitchen with a couple of sample tickets,
// so the first thing a player sees is the game itself.
game.deck.addOrder(false);
game.deck.addOrder(false);

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(dt);
  drawScene(game.ctx, game, game.time);
  requestAnimationFrame(frame);
}

canvas.addEventListener('click', (e) => game.clickAt(e.clientX, e.clientY));

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Space' || e.code === 'KeyE') {
    if (game.state === 'title') game.startShift();
    else if (game.state === 'playing') game.interactNearest();
    return;
  }
  if (e.code === 'KeyP' || e.code === 'Escape') {
    if (game.state === 'playing') game.state = 'paused';
    else if (game.state === 'paused') game.state = 'playing';
    return;
  }
  if (e.code === 'KeyM') {
    game.sounds.ensure();
    const muted = game.sounds.toggleMute();
    game.setToast(muted ? 'Sound off.' : 'Sound on.');
    return;
  }
  if (e.code === 'KeyR' && game.state === 'over') {
    game.startShift();
    return;
  }
  if (e.code.startsWith('Digit')) {
    const n = Number(e.code.slice(5));
    if (game.state === 'playing' && n >= 1 && n <= 6) {
      const id = INGREDIENT_ORDER[n - 1];
      const bin = STATIONS.bins.find((b) => b.id === id);
      if (bin) {
        const run = () => game.useStation(bin, null, id);
        const dist = Math.hypot(game.chef.x - bin.front.x, game.chef.y - bin.front.y);
        if (dist < 70) run();
        else game.chef.walkTo(bin.front, run);
      }
    }
    return;
  }
  game.keys.add(e.code);
});

window.addEventListener('keyup', (e) => game.keys.delete(e.code));

// Testing handle: lets an automated play-test read the state and drive
// the same click path a player uses. It changes no gameplay.
window.__emberOak = {
  game,
  state: () => ({
    state: game.state,
    timeLeft: game.timeLeft,
    coins: game.coins,
    score: game.score,
    served: game.served,
    combo: game.combo,
    rush: game.rush,
    orders: game.deck.orders.map((o) => ({ name: o.recipe.name, needs: o.needs, patience: Math.round(o.patience) })),
    hands: game.chef.hands,
    chef: { x: Math.round(game.chef.x), y: Math.round(game.chef.y), target: game.chef.target },
    plate: game.plateOnCounter,
    grill: game.grill,
    pot: game.pot,
    board: game.board,
  }),
  clickCanvas: (x, y) => game.handleClick(x, y),
  start: () => game.startShift(),
  skipTo: (secondsLeft) => {
    game.timeLeft = secondsLeft;
    if (secondsLeft <= 60) game.rush = true;
  },
};

requestAnimationFrame(frame);
