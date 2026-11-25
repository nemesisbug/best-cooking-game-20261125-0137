// Ember & Oak — rendering: every pixel of the kitchen is drawn here
// with canvas paths (no image files, no emoji art).

import { INGREDIENTS, PALETTE, VIEW } from './data.js';
import { STATIONS } from './kitchen.js';

const DISPLAY = 'Georgia, "Times New Roman", serif';
const UI = '"Trebuchet MS", Verdana, sans-serif';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

// ---------------------------------------------------------------- ingredients

// Draw one ingredient icon at (x, y) with radius r. `key` is "id:state".
export function drawIngredient(ctx, key, x, y, r) {
  const [id, state] = key.split(':');
  const def = INGREDIENTS[id];
  if (!def) return;
  ctx.save();
  ctx.translate(x, y);
  const burnt = state === 'burnt';
  if (burnt) {
    ctx.fillStyle = '#241a12';
    ellipse(ctx, 0, 0, r, r * 0.8);
    ctx.fill();
    ctx.fillStyle = '#3a2a1a';
    ellipse(ctx, -r * 0.3, -r * 0.2, r * 0.35, r * 0.25);
    ctx.fill();
    ctx.restore();
    return;
  }
  if (id === 'bun') {
    ctx.fillStyle = '#d99a4e';
    ellipse(ctx, 0, r * 0.25, r, r * 0.45);
    ctx.fill();
    ctx.fillStyle = '#e8b06a';
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.95, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f6ead0';
    for (const [sx, sy] of [[-0.4, -0.45], [0.05, -0.65], [0.45, -0.4]]) {
      ellipse(ctx, sx * r, sy * r, r * 0.09, r * 0.06);
      ctx.fill();
    }
  } else if (id === 'patty') {
    ctx.fillStyle = state === 'grilled' ? '#5e3018' : '#7a4a2b';
    rr(ctx, -r, -r * 0.55, r * 2, r * 1.1, r * 0.45);
    ctx.fill();
    if (state === 'grilled') {
      ctx.strokeStyle = '#2e1608';
      ctx.lineWidth = r * 0.12;
      for (const ox of [-0.5, 0, 0.5]) {
        ctx.beginPath();
        ctx.moveTo(ox * r, -r * 0.5);
        ctx.lineTo(ox * r, r * 0.5);
        ctx.stroke();
      }
    }
  } else if (id === 'tomato') {
    if (state === 'chopped') {
      ctx.fillStyle = '#d94f3d';
      for (const [ox, oy, rot] of [[-0.45, 0.1, -0.5], [0.1, -0.3, 0.4], [0.45, 0.35, 1.1]]) {
        ctx.save();
        ctx.translate(ox * r, oy * r);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.55);
        ctx.lineTo(r * 0.5, r * 0.4);
        ctx.lineTo(-r * 0.5, r * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else {
      ctx.fillStyle = '#d94f3d';
      ellipse(ctx, 0, 0, r * 0.9, r * 0.85);
      ctx.fill();
      ctx.fillStyle = '#5a7d2a';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(-r * 0.35, -r * 1.05);
      ctx.lineTo(0, -r * 0.85);
      ctx.lineTo(r * 0.35, -r * 1.05);
      ctx.closePath();
      ctx.fill();
    }
  } else if (id === 'lettuce') {
    ctx.fillStyle = '#7cb342';
    if (state === 'chopped') {
      for (const [ox, oy, rot] of [[-0.4, 0.2, 0.3], [0.15, -0.25, -0.4], [0.45, 0.3, 0.9]]) {
        ctx.save();
        ctx.translate(ox * r, oy * r);
        ctx.rotate(rot);
        ellipse(ctx, 0, 0, r * 0.5, r * 0.22);
        ctx.fill();
        ctx.restore();
      }
    } else {
      for (const [ox, oy] of [[-0.35, 0.15], [0.3, -0.1], [0, 0.35]]) {
        ellipse(ctx, ox * r, oy * r, r * 0.6, r * 0.42);
        ctx.fill();
      }
      ctx.fillStyle = '#9ccc65';
      ellipse(ctx, -r * 0.2, -r * 0.1, r * 0.35, r * 0.25);
      ctx.fill();
    }
  } else if (id === 'mushroom') {
    const cap = state === 'grilled' ? '#8a6d4b' : '#c9b8a3';
    if (state === 'chopped') {
      ctx.fillStyle = '#e8dcc8';
      for (const [ox, oy] of [[-0.4, 0.1], [0.1, -0.3], [0.45, 0.3]]) {
        ctx.beginPath();
        ctx.arc(ox * r, oy * r, r * 0.42, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#efe6d4';
      rr(ctx, -r * 0.22, -r * 0.1, r * 0.44, r * 0.75, r * 0.2);
      ctx.fill();
      ctx.fillStyle = cap;
      ctx.beginPath();
      ctx.arc(0, -r * 0.05, r * 0.95, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f6ead0';
      for (const [sx, sy] of [[-0.5, -0.55], [0.1, -0.75], [0.55, -0.45]]) {
        ellipse(ctx, sx * r, sy * r, r * 0.12, r * 0.08);
        ctx.fill();
      }
    }
  } else if (id === 'corn') {
    if (state === 'chopped') {
      ctx.fillStyle = '#f2c230';
      for (const [ox, oy] of [[-0.45, 0.2], [0, -0.25], [0.45, 0.15], [-0.05, 0.4]]) {
        ellipse(ctx, ox * r, oy * r, r * 0.3, r * 0.3);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = state === 'grilled' ? '#d9a41f' : '#f2c230';
      ellipse(ctx, 0, 0, r * 0.55, r * 0.95);
      ctx.fill();
      ctx.fillStyle = '#ffe082';
      for (let row = -2; row <= 2; row++) {
        for (let col = -1; col <= 1; col++) {
          ellipse(ctx, col * r * 0.28, row * r * 0.32, r * 0.09, r * 0.09);
          ctx.fill();
        }
      }
      if (state === 'grilled') {
        ctx.strokeStyle = '#7a4a12';
        ctx.lineWidth = r * 0.1;
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, -r * 0.3);
        ctx.lineTo(r * 0.4, r * 0.2);
        ctx.stroke();
      }
    }
  }
  if (state === 'simmered') {
    // A simmered item rides in a little bowl with steam.
    ctx.strokeStyle = 'rgba(246,234,208,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, r * 0.55);
    ctx.quadraticCurveTo(0, r * 0.95, r * 0.5, r * 0.55);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the scene

export function drawScene(ctx, g, time) {
  drawBackground(ctx, time);
  drawOrderRail(ctx, g);
  drawBackCounter(ctx, g, time);
  drawBoard(ctx, g);
  drawPlatingCounter(ctx, g);
  drawBins(ctx, g);
  drawTrash(ctx, g);
  drawParticles(ctx, g);
  drawChef(ctx, g, time);
  drawTopBar(ctx, g);
  drawFloaters(ctx, g);
  drawToast(ctx, g);
  if (g.state === 'title') drawTitle(ctx, g);
  if (g.state === 'paused') drawPause(ctx);
  if (g.state === 'over') drawGameOver(ctx, g);
}

function drawBackground(ctx, time) {
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  // Wall planks.
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let y = 70; y < 200; y += 34) {
    ctx.beginPath();
    ctx.moveTo(348, y);
    ctx.lineTo(VIEW.w, y);
    ctx.stroke();
  }
  // Dusk window with moon.
  ctx.save();
  rr(ctx, 1080, 210, 150, 110, 8);
  ctx.clip();
  const sky = ctx.createLinearGradient(0, 210, 0, 320);
  sky.addColorStop(0, '#2c3e6b');
  sky.addColorStop(0.6, '#7a4a5e');
  sky.addColorStop(1, '#e07840');
  ctx.fillStyle = sky;
  ctx.fillRect(1080, 210, 150, 110);
  ctx.fillStyle = '#f6ead0';
  ctx.beginPath();
  ctx.arc(1190, 240, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1d110a';
  ctx.beginPath();
  ctx.moveTo(1080, 320);
  ctx.lineTo(1140, 275);
  ctx.lineTo(1200, 320);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#4a2f1d';
  ctx.lineWidth = 6;
  rr(ctx, 1080, 210, 150, 110, 8);
  ctx.stroke();
  // Hanging pans.
  for (const [x, y, r] of [[420, 235, 16], [470, 232, 13], [1020, 235, 15]]) {
    ctx.strokeStyle = '#8a8a8a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 205);
    ctx.lineTo(x, y - r);
    ctx.stroke();
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Floor.
  ctx.fillStyle = PALETTE.floor;
  ctx.fillRect(348, 200, VIEW.w - 348, VIEW.h - 200);
  ctx.strokeStyle = PALETTE.floorLine;
  ctx.lineWidth = 2;
  for (let y = 250; y < VIEW.h; y += 52) {
    ctx.beginPath();
    ctx.moveTo(348, y);
    ctx.lineTo(VIEW.w, y);
    ctx.stroke();
  }
  // Warm hearth glow pulsing with the fire.
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.2);
  const glow = ctx.createRadialGradient(490, 150, 10, 490, 150, 260);
  glow.addColorStop(0, `rgba(255,122,47,${0.20 + 0.10 * pulse})`);
  glow.addColorStop(1, 'rgba(255,122,47,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(348, 64, 560, 320);
}

function drawTopBar(ctx, g) {
  ctx.fillStyle = PALETTE.topbar;
  ctx.fillRect(0, 0, VIEW.w, 64);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 26px ${DISPLAY}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('EMBER & OAK', 16, 24);
  ctx.font = `13px ${UI}`;
  ctx.fillStyle = '#c9a06a';
  ctx.fillText('HEARTH KITCHEN', 16, 48);
  // Shift timer, centre.
  const mins = Math.floor(Math.max(0, g.timeLeft) / 60);
  const secs = Math.floor(Math.max(0, g.timeLeft) % 60);
  const low = g.timeLeft <= 30 && g.state === 'playing';
  ctx.textAlign = 'center';
  ctx.font = `bold 30px ${DISPLAY}`;
  ctx.fillStyle = low ? '#ff6b4a' : PALETTE.cream;
  ctx.fillText(`${mins}:${String(secs).padStart(2, '0')}`, 640, 24);
  ctx.fillStyle = '#3a2415';
  rr(ctx, 520, 50, 240, 8, 4);
  ctx.fill();
  ctx.fillStyle = g.rush ? PALETTE.ember : PALETTE.gold;
  rr(ctx, 520, 50, 240 * (g.timeLeft / 180), 8, 4);
  ctx.fill();
  ctx.font = `bold 13px ${UI}`;
  ctx.fillStyle = g.rush ? PALETTE.ember : '#c9a06a';
  ctx.fillText(g.rush ? 'RUSH HOUR — DOUBLE COINS' : 'EVENING SHIFT', 640, 44);
  // Coins, score, served.
  ctx.textAlign = 'right';
  ctx.font = `bold 20px ${UI}`;
  ctx.fillStyle = PALETTE.gold;
  ctx.fillText(`◉ ${g.coins} coins`, 1272, 22);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `16px ${UI}`;
  ctx.fillText(`Score ${g.score}   Served ${g.served}`, 1272, 46);
  if (g.combo >= 2) {
    ctx.textAlign = 'left';
    ctx.fillStyle = PALETTE.ember;
    ctx.font = `bold 18px ${UI}`;
    ctx.fillText(`COMBO x${g.combo}`, 360, 30);
  }
}

function drawOrderRail(ctx, g) {
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  rr(ctx, 12, 76, 324, 620, 10);
  ctx.fill();
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 17px ${DISPLAY}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ORDER RAIL', 28, 100);
  ctx.font = `12px ${UI}`;
  ctx.fillStyle = '#c9a06a';
  ctx.fillText('Serve the ticket before its bar runs out.', 28, 122);
  const tickets = g.deck.orders;
  tickets.forEach((order, i) => {
    const y = 140 + i * 168;
    drawTicket(ctx, order, 28, y, 292, 152, g);
  });
  if (tickets.length === 0 && g.state === 'playing') {
    ctx.fillStyle = '#c9a06a';
    ctx.font = `15px ${UI}`;
    ctx.textAlign = 'center';
    ctx.fillText('No orders yet —', 174, 200);
    ctx.fillText('the next ticket is coming.', 174, 222);
  }
}

function drawTicket(ctx, order, x, y, w, h, g) {
  const r = order.recipe;
  const frac = Math.max(0, order.patience / order.maxPatience);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = PALETTE.parchment;
  rr(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.restore();
  // Colour band.
  ctx.fillStyle = r.color;
  rr(ctx, x, y, w, 10, 8);
  ctx.fill();
  ctx.fillRect(x, y + 5, w, 5);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 18px ${DISPLAY}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(r.name, x + 12, y + 32);
  ctx.font = `bold 14px ${UI}`;
  ctx.fillStyle = r.color;
  ctx.textAlign = 'right';
  ctx.fillText(`${r.coins}c`, x + w - 12, y + 32);
  // Needed items as chips in a 2x2 grid; a tick when the plate already holds it.
  const plateItems = g.plateOnCounter ? g.plateOnCounter.items : [];
  r.needs.forEach((need, i) => {
    const [id] = need.split(':');
    const done = plateItems.includes(need);
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = x + 12 + col * 138;
    const cy = y + 52 + row * 36;
    ctx.fillStyle = done ? '#dcecc8' : '#efe3c8';
    ctx.strokeStyle = done ? PALETTE.green : '#b09a72';
    ctx.lineWidth = 1.5;
    rr(ctx, cx, cy, 132, 30, 7);
    ctx.fill();
    ctx.stroke();
    drawIngredient(ctx, need, cx + 15, cy + 15, 11);
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `bold 11px ${UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(INGREDIENTS[id].name, cx + 30, cy + 11);
    ctx.fillStyle = done ? PALETTE.green : '#8a7a5e';
    ctx.font = `10px ${UI}`;
    ctx.fillText(done ? '✓ on plate' : need.split(':')[1], cx + 30, cy + 23);
  });
  // Patience bar.
  ctx.fillStyle = '#d8c9a8';
  rr(ctx, x + 12, y + h - 24, w - 24, 10, 5);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? PALETTE.green : frac > 0.25 ? PALETTE.gold : PALETTE.red;
  rr(ctx, x + 12, y + h - 24, (w - 24) * frac, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#8a7a5e';
  ctx.font = `11px ${UI}`;
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.ceil(order.patience)}s`, x + w - 12, y + h - 34);
}

function drawBackCounter(ctx, g, time) {
  // Wooden back counter.
  ctx.fillStyle = PALETTE.wood;
  ctx.fillRect(360, 176, VIEW.w - 372, 26);
  ctx.fillStyle = PALETTE.woodLight;
  ctx.fillRect(360, 176, VIEW.w - 372, 5);
  drawGrill(ctx, g, time);
  drawPot(ctx, g, time);
  drawPlateStack(ctx, g);
  drawServeWindow(ctx, g, time);
}

function flame(ctx, x, y, s, time, seed) {
  const flick = Math.sin(time * 9 + seed) * 0.12 + Math.sin(time * 5.3 + seed * 2) * 0.08;
  const h = s * (1 + flick);
  ctx.fillStyle = '#ff7a2f';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.55, y);
  ctx.quadraticCurveTo(x - s * 0.5, y - h * 0.7, x, y - h);
  ctx.quadraticCurveTo(x + s * 0.5, y - h * 0.7, x + s * 0.55, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffc23d';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y);
  ctx.quadraticCurveTo(x - s * 0.28, y - h * 0.5, x, y - h * 0.68);
  ctx.quadraticCurveTo(x + s * 0.28, y - h * 0.5, x + s * 0.3, y);
  ctx.closePath();
  ctx.fill();
}

function drawGrill(ctx, g, time) {
  const grill = STATIONS.grill;
  // Stone hearth.
  ctx.fillStyle = '#5a5a5a';
  rr(ctx, grill.rect.x, grill.rect.y, grill.rect.w, grill.rect.h, 8);
  ctx.fill();
  ctx.fillStyle = '#6e6e6e';
  rr(ctx, grill.rect.x + 6, grill.rect.y + 6, grill.rect.w - 12, grill.rect.h - 12, 6);
  ctx.fill();
  // Grate + slots.
  grill.slots.forEach((slot, i) => {
    const s = g.grill.slots[i];
    ctx.fillStyle = '#2b2b2b';
    rr(ctx, slot.rect.x, slot.rect.y, slot.rect.w, slot.rect.h, 6);
    ctx.fill();
    ctx.strokeStyle = '#8a8a8a';
    ctx.lineWidth = 2;
    for (let gx = slot.rect.x + 12; gx < slot.rect.x + slot.rect.w; gx += 14) {
      ctx.beginPath();
      ctx.moveTo(gx, slot.rect.y + 4);
      ctx.lineTo(gx, slot.rect.y + slot.rect.h - 4);
      ctx.stroke();
    }
    if (s && s.item) {
      drawIngredient(ctx, s.item.key, slot.rect.x + slot.rect.w / 2, slot.rect.y + slot.rect.h / 2 - 4, 20);
      // Cook progress ring.
      const frac = Math.min(1, s.progress / s.cookSeconds);
      ctx.strokeStyle = s.burnt ? '#ff6b4a' : s.done ? PALETTE.green : PALETTE.gold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(slot.rect.x + slot.rect.w / 2, slot.rect.y + slot.rect.h / 2, 26, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
      ctx.stroke();
      if (s.done && !s.burnt) {
        ctx.fillStyle = PALETTE.green;
        ctx.font = `bold 11px ${UI}`;
        ctx.textAlign = 'center';
        ctx.fillText('READY', slot.rect.x + slot.rect.w / 2, slot.rect.y + slot.rect.h - 2);
      } else if (s.burnt) {
        ctx.fillStyle = '#ff6b4a';
        ctx.font = `bold 11px ${UI}`;
        ctx.textAlign = 'center';
        ctx.fillText('BURNT!', slot.rect.x + slot.rect.w / 2, slot.rect.y + slot.rect.h - 2);
      }
    }
  });
  // Heat gauge + bellows.
  const heat = g.grill.heat;
  ctx.fillStyle = '#1d110a';
  rr(ctx, 398, 176, 186, 14, 7);
  ctx.fill();
  ctx.fillStyle = heat > 66 ? PALETTE.ember : heat > 33 ? PALETTE.gold : '#8a7a5e';
  rr(ctx, 398, 176, 186 * (heat / 100), 14, 7);
  ctx.fill();
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 11px ${UI}`;
  ctx.textAlign = 'left';
  ctx.fillText(`FIRE ${Math.round(heat)}°`, 398, 170);
  const b = grill.bellows;
  ctx.fillStyle = '#8a5a30';
  rr(ctx, b.rect.x, b.rect.y, b.rect.w, b.rect.h, 6);
  ctx.fill();
  ctx.fillStyle = '#c9a06a';
  ctx.font = `bold 10px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('BEL-', b.rect.x + b.rect.w / 2, b.rect.y + 28);
  ctx.fillText('LOWS', b.rect.x + b.rect.w / 2, b.rect.y + 42);
  ctx.fillText('click', b.rect.x + b.rect.w / 2, b.rect.y + 56);
  // Flames licking up from the hearth floor, drawn last so they show
  // in front of the grate. Their size follows the fire's heat.
  if (g.grill.heat > 8) {
    const fs = 10 + (g.grill.heat / 100) * 14;
    flame(ctx, 442, 196, fs, time, 1);
    flame(ctx, 540, 196, fs * 0.85, time, 4);
  }
}

function drawPot(ctx, g, time) {
  const pot = STATIONS.pot;
  ctx.fillStyle = '#3a3a3a';
  ellipse(ctx, pot.rect.x + 60, pot.rect.y + 92, 52, 14);
  ctx.fill();
  ctx.fillStyle = '#555';
  rr(ctx, pot.rect.x + 10, pot.rect.y + 40, 100, 56, 10);
  ctx.fill();
  ctx.fillStyle = '#2b1c10';
  ellipse(ctx, pot.rect.x + 60, pot.rect.y + 42, 46, 10);
  ctx.fill();
  // Label on the pot body.
  ctx.fillStyle = '#c9c9c9';
  ctx.font = `bold 11px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('SIMMER POT', pot.rect.x + 60, pot.rect.y + 82);
  const s = g.pot.slot;
  if (s && s.item) {
    drawIngredient(ctx, s.item.key, pot.rect.x + 60, pot.rect.y + 34, 16);
    const frac = Math.min(1, s.progress / s.cookSeconds);
    ctx.strokeStyle = s.burnt ? '#ff6b4a' : s.done ? PALETTE.green : PALETTE.gold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(pot.rect.x + 60, pot.rect.y + 40, 24, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    if (s.done && !s.burnt) {
      ctx.fillStyle = PALETTE.green;
      ctx.font = `bold 11px ${UI}`;
      ctx.textAlign = 'center';
      ctx.fillText('READY', pot.rect.x + 60, pot.rect.y + 116);
    } else if (s.burnt) {
      ctx.fillStyle = '#ff6b4a';
      ctx.font = `bold 11px ${UI}`;
      ctx.textAlign = 'center';
      ctx.fillText('BURNT!', pot.rect.x + 60, pot.rect.y + 116);
    }
  }
  if (s && s.item && !s.burnt) {
    ctx.strokeStyle = 'rgba(246,234,208,0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const sx = pot.rect.x + 40 + i * 20;
      const wob = Math.sin(time * 2 + i * 2) * 4;
      ctx.beginPath();
      ctx.moveTo(sx, pot.rect.y + 34);
      ctx.quadraticCurveTo(sx + wob, pot.rect.y + 18, sx - wob, pot.rect.y + 4);
      ctx.stroke();
    }
  }
}

function drawPlateStack(ctx, g) {
  const p = STATIONS.plates;
  ctx.fillStyle = '#8a5a30';
  rr(ctx, p.rect.x, p.rect.y, p.rect.w, p.rect.h, 6);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i === 0 ? '#ffffff' : '#e8e0d0';
    ellipse(ctx, p.rect.x + 40, p.rect.y + 96 - i * 9, 30, 8);
    ctx.fill();
  }
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 11px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('PLATES', p.rect.x + 40, p.rect.y + 112);
}

function drawServeWindow(ctx, g, time) {
  const s = STATIONS.serve;
  ctx.fillStyle = '#7a5a3a';
  rr(ctx, s.rect.x, s.rect.y, s.rect.w, s.rect.h, 8);
  ctx.fill();
  ctx.fillStyle = '#2b1c10';
  rr(ctx, s.rect.x + 8, s.rect.y + 8, s.rect.w - 16, s.rect.h - 16, 6);
  ctx.fill();
  ctx.fillStyle = '#f6ead0';
  ctx.font = `bold 20px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.fillText('SERVE HERE', s.rect.x + s.rect.w / 2, s.rect.y + 40);
  ctx.font = `13px ${UI}`;
  ctx.fillStyle = '#c9a06a';
  ctx.fillText('Bring a finished plate', s.rect.x + s.rect.w / 2, s.rect.y + 64);
  // Service bell.
  const bx = s.rect.x + s.rect.w - 44;
  const by = s.rect.y + s.rect.h - 34;
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.arc(bx, by, 14, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(bx - 14, by - 2, 28, 4);
  if (g.serveFlash > 0) {
    ctx.fillStyle = `rgba(242,194,48,${Math.min(1, g.serveFlash)})`;
    ctx.font = `bold 22px ${DISPLAY}`;
    ctx.fillText('DING!', s.rect.x + s.rect.w / 2, s.rect.y + 96);
  }
}

function drawBoard(ctx, g) {
  const b = STATIONS.board;
  // Island counter.
  ctx.fillStyle = PALETTE.wood;
  rr(ctx, b.rect.x - 14, b.rect.y - 14, b.rect.w + 28, b.rect.h + 28, 10);
  ctx.fill();
  ctx.fillStyle = '#d8c9a8';
  rr(ctx, b.rect.x, b.rect.y, b.rect.w, b.rect.h, 6);
  ctx.fill();
  ctx.strokeStyle = '#b09a72';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(b.rect.x + 20, b.rect.y + 30);
  ctx.lineTo(b.rect.x + b.rect.w - 20, b.rect.y + 30);
  ctx.moveTo(b.rect.x + 20, b.rect.y + 85);
  ctx.lineTo(b.rect.x + b.rect.w - 20, b.rect.y + 85);
  ctx.stroke();
  const item = g.board.item;
  if (item) {
    drawIngredient(ctx, item.key, b.rect.x + b.rect.w / 2, b.rect.y + b.rect.h / 2, 26);
    if (!item.done) {
      ctx.fillStyle = PALETTE.ink;
      ctx.font = `bold 13px ${UI}`;
      ctx.textAlign = 'center';
      ctx.fillText(`CHOP ${item.chops}/${3}`, b.rect.x + b.rect.w / 2, b.rect.y + b.rect.h - 8);
      // Knife.
      ctx.save();
      ctx.translate(b.rect.x + b.rect.w - 34, b.rect.y + 26);
      ctx.rotate(-0.5);
      ctx.fillStyle = '#c9c9c9';
      rr(ctx, 0, 0, 26, 8, 3);
      ctx.fill();
      ctx.fillStyle = '#4a2f1d';
      rr(ctx, 26, 1, 14, 6, 3);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = PALETTE.green;
      ctx.font = `bold 13px ${UI}`;
      ctx.textAlign = 'center';
      ctx.fillText('CHOPPED — click to take', b.rect.x + b.rect.w / 2, b.rect.y + b.rect.h - 8);
    }
  } else {
    ctx.fillStyle = '#8a7a5e';
    ctx.font = `13px ${UI}`;
    ctx.textAlign = 'center';
    ctx.fillText('CHOPPING BOARD', b.rect.x + b.rect.w / 2, b.rect.y + b.rect.h / 2 - 6);
    ctx.fillText('bring something raw', b.rect.x + b.rect.w / 2, b.rect.y + b.rect.h / 2 + 14);
  }
}

function drawPlatingCounter(ctx, g) {
  const c = STATIONS.counter;
  ctx.fillStyle = PALETTE.wood;
  rr(ctx, c.rect.x - 14, c.rect.y - 14, c.rect.w + 28, c.rect.h + 28, 10);
  ctx.fill();
  ctx.fillStyle = '#efe3c8';
  rr(ctx, c.rect.x, c.rect.y, c.rect.w, c.rect.h, 6);
  ctx.fill();
  const plate = g.plateOnCounter;
  if (plate) {
    // The plate with its assembled items.
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, c.rect.x + c.rect.w / 2, c.rect.y + c.rect.h / 2 + 8, 78, 26);
    ctx.fill();
    ctx.fillStyle = '#e8e0d0';
    ellipse(ctx, c.rect.x + c.rect.w / 2, c.rect.y + c.rect.h / 2 + 8, 58, 18);
    ctx.fill();
    plate.items.forEach((key, i) => {
      const angle = (i / Math.max(1, plate.items.length)) * Math.PI * 2 - Math.PI / 2;
      const ix = c.rect.x + c.rect.w / 2 + Math.cos(angle) * 34;
      const iy = c.rect.y + c.rect.h / 2 + 6 + Math.sin(angle) * 12;
      drawIngredient(ctx, key, ix, iy, 15);
    });
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `bold 13px ${UI}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      plate.items.length === 0 ? 'EMPTY PLATE — add items' : `${plate.items.length} item${plate.items.length > 1 ? 's' : ''} on the plate`,
      c.rect.x + c.rect.w / 2, c.rect.y + c.rect.h - 6,
    );
  } else {
    ctx.fillStyle = '#8a7a5e';
    ctx.font = `13px ${UI}`;
    ctx.textAlign = 'center';
    ctx.fillText('PLATING COUNTER', c.rect.x + c.rect.w / 2, c.rect.y + c.rect.h / 2 - 6);
    ctx.fillText('assemble the dish here', c.rect.x + c.rect.w / 2, c.rect.y + c.rect.h / 2 + 14);
  }
}

function drawBins(ctx, g) {
  for (const bin of STATIONS.bins) {
    const def = INGREDIENTS[bin.id];
    const r = bin.rect;
    ctx.fillStyle = '#5a3a22';
    rr(ctx, r.x, r.y, r.w, r.h, 8);
    ctx.fill();
    ctx.fillStyle = '#7a5230';
    rr(ctx, r.x + 5, r.y + 5, r.w - 10, r.h - 10, 6);
    ctx.fill();
    // A heap of the ingredient.
    for (let i = 0; i < 3; i++) {
      drawIngredient(ctx, `${bin.id}:raw`, r.x + 34 + i * 32, r.y + 46, 15);
    }
    ctx.fillStyle = PALETTE.cream;
    ctx.font = `bold 14px ${UI}`;
    ctx.textAlign = 'center';
    ctx.fillText(def.name, r.x + r.w / 2, r.y + r.h - 12);
    ctx.fillStyle = '#c9a06a';
    ctx.font = `11px ${UI}`;
    const hints = [];
    if (def.chop) hints.push('chop');
    if (def.grill) hints.push('grill');
    if (def.pot) hints.push('simmer');
    ctx.fillText(hints.length ? hints.join(' · ') : 'no prep', r.x + r.w / 2, r.y + r.h - 26);
  }
}

function drawTrash(ctx, g) {
  const t = STATIONS.trash;
  ctx.fillStyle = '#3a3a3a';
  rr(ctx, t.rect.x, t.rect.y, t.rect.w, t.rect.h, 8);
  ctx.fill();
  ctx.fillStyle = '#555';
  rr(ctx, t.rect.x + 8, t.rect.y + 8, t.rect.w - 16, 18, 4);
  ctx.fill();
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 14px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('TRASH', t.rect.x + t.rect.w / 2, t.rect.y + t.rect.h - 12);
  ctx.fillStyle = '#c9a06a';
  ctx.font = `11px ${UI}`;
  ctx.fillText('burnt or wrong bits', t.rect.x + t.rect.w / 2, t.rect.y + t.rect.h - 28);
}

function drawParticles(ctx, g) {
  for (const p of g.particles) {
    const a = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * a + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawChef(ctx, g, time) {
  const c = g.chef;
  const bob = c.moving ? Math.sin(c.bob) * 3 : 0;
  // Shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ellipse(ctx, c.x, c.y + 26, 24, 7);
  ctx.fill();
  ctx.save();
  ctx.translate(c.x, c.y + bob * 0.4);
  // Body / apron.
  ctx.fillStyle = '#f6ead0';
  ctx.beginPath();
  ctx.moveTo(-16, 26);
  ctx.quadraticCurveTo(-20, -6, -12, -8);
  ctx.lineTo(12, -8);
  ctx.quadraticCurveTo(20, -6, 16, 26);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e07840';
  ctx.fillRect(-16, 8, 32, 5);
  // Arms.
  ctx.strokeStyle = '#f6ead0';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-20 * c.facing, 12);
  ctx.moveTo(12, 0);
  ctx.lineTo(20 * c.facing, 12);
  ctx.stroke();
  // Head.
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(0, -20, 13, 0, Math.PI * 2);
  ctx.fill();
  // Toque.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-8, -32, 8, 0, Math.PI * 2);
  ctx.arc(0, -36, 9, 0, Math.PI * 2);
  ctx.arc(8, -32, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-11, -33, 22, 6);
  // Eyes + smile.
  ctx.fillStyle = '#2e1c10';
  ctx.beginPath();
  ctx.arc(-4.5 * c.facing, -21, 1.8, 0, Math.PI * 2);
  ctx.arc(4.5 * c.facing, -21, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e1c10';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -17, 4, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.restore();
  // Carried item floats above the hands.
  if (c.hands) {
    const hx = c.x + 24 * c.facing;
    const hy = c.y - 6 + bob * 0.4;
    if (c.hands.kind === 'plate') {
      ctx.fillStyle = '#ffffff';
      ellipse(ctx, hx, hy, 24, 8);
      ctx.fill();
      c.hands.items.forEach((key, i) => {
        drawIngredient(ctx, key, hx - 12 + i * 12, hy - 8, 8);
      });
    } else {
      drawIngredient(ctx, c.hands.key, hx, hy - 6, 15);
    }
  }
}

function drawFloaters(ctx, g) {
  ctx.textAlign = 'center';
  for (const f of g.floaters) {
    const a = Math.max(0, f.life / f.maxLife);
    ctx.globalAlpha = a;
    ctx.fillStyle = f.color;
    ctx.font = `bold ${f.size}px ${DISPLAY}`;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}

function drawToast(ctx, g) {
  if (!g.toast || g.toastLife <= 0) return;
  ctx.globalAlpha = Math.min(1, g.toastLife);
  ctx.fillStyle = 'rgba(29,17,10,0.92)';
  const w = ctx.measureText(g.toast).width + 36;
  rr(ctx, 640 - w / 2, 76, w, 34, 17);
  ctx.fill();
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `15px ${UI}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(g.toast, 640, 94);
  ctx.globalAlpha = 1;
}

function drawTitle(ctx, g) {
  ctx.fillStyle = 'rgba(23,16,11,0.72)';
  ctx.fillRect(0, 64, VIEW.w, VIEW.h - 64);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.gold;
  ctx.font = `bold 64px ${DISPLAY}`;
  ctx.fillText('EMBER & OAK', 640, 220);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `italic 26px ${DISPLAY}`;
  ctx.fillText('a hearth-fire cooking game', 640, 262);
  ctx.font = `17px ${UI}`;
  ctx.fillStyle = '#e8dcc8';
  ctx.fillText('Run the mountain lodge kitchen. Chop, grill and simmer over a live fire,', 640, 320);
  ctx.fillText('build each ticket on the plating counter, and serve before patience runs out.', 640, 344);
  ctx.fillStyle = PALETTE.ember;
  ctx.font = `bold 22px ${DISPLAY}`;
  ctx.fillText('CLICK TO START YOUR SHIFT', 640, 410);
  ctx.fillStyle = '#c9a06a';
  ctx.font = `14px ${UI}`;
  ctx.fillText('Click a station to walk there · Space chops & interacts · 1–6 grab ingredients · P pause · M mute', 640, 452);
  ctx.fillText('Stoke the bellows to keep the fire hot — hot food cooks fast, left too long it burns.', 640, 476);
}

function drawPause(ctx) {
  ctx.fillStyle = 'rgba(23,16,11,0.7)';
  ctx.fillRect(0, 64, VIEW.w, VIEW.h - 64);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 44px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', 640, 340);
  ctx.font = `17px ${UI}`;
  ctx.fillText('Press P to get back to the fire.', 640, 380);
}

function drawGameOver(ctx, g) {
  ctx.fillStyle = 'rgba(23,16,11,0.78)';
  ctx.fillRect(0, 64, VIEW.w, VIEW.h - 64);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.gold;
  ctx.font = `bold 52px ${DISPLAY}`;
  ctx.fillText('SHIFT OVER', 640, 220);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = `bold 30px ${DISPLAY}`;
  ctx.fillText(`Grade ${g.grade}  ·  ${g.served} dishes served  ·  ${g.coins} coins`, 640, 280);
  ctx.font = `18px ${UI}`;
  ctx.fillStyle = '#e8dcc8';
  ctx.fillText(`Score ${g.score}   ·   Best combo x${g.bestCombo}   ·   Orders lost ${g.lost}`, 640, 320);
  ctx.fillStyle = PALETTE.ember;
  ctx.font = `bold 22px ${DISPLAY}`;
  ctx.fillText('Press R to run another shift', 640, 380);
}
