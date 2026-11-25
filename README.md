# Ember & Oak — Hearth Kitchen

[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/nemesisbug/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/nemesisbug/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![game](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A hearth-fire cooking game for the make.fun "Make the best cooking game" bounty
(`best-cooking-game-20261125-0137`). You run a mountain lodge kitchen over a
live wood fire: chop, grill and simmer, build each ticket on the plating
counter, and serve before the ticket's patience runs out.

## The game

- **The fire is alive.** Food on the grill cooks at a rate set by the hearth's
  heat. Stoke the bellows to cook fast — but leave a dish on too long and it
  burns.
- **Four recipes, three prep stations.** Ember Burger, Forest Skewer, Golden
  Corn Soup and Garden Salad, built from six ingredients across the chopping
  board, the grill and the simmer pot.
- **Order rail with patience.** Tickets arrive on the rail; serve on time for
  a patience bonus, lose the ticket if the bar runs out.
- **Rush hour.** At 60 seconds left the dinner rush hits: tickets come faster
  and every serve pays double coins. Chain serves without a mistake to build
  a combo multiplier.
- **A full shift.** 3 minutes, then a grade (S/A/B/C/D), your dishes served,
  coins and best combo.

## How to play

Click a station to walk there and use it, or move with WASD / arrow keys.
Space (or E) uses the nearest station. Keys 1–6 grab an ingredient from its
crate. P pauses, M mutes, R starts a new shift after the shift ends.

The flow for one dish: take a raw ingredient from a crate → chop it on the
board / grill it / simmer it in the pot → take a plate from the stack, set it
on the plating counter, add the prepared items → carry the finished plate to
the serve window.

## Play it

Open `game/index.html` in a desktop browser. Everything is static files —
no network requests, no build step. All art is drawn in code and all sounds
are synthesized with WebAudio.

## Layout

- `game/index.html` — the page
- `game/style.css` — page chrome
- `game/src/main.js` — entry point, input wiring, game loop
- `game/src/game.js` — state, shift clock, stations, scoring
- `game/src/data.js` — ingredients, recipes, tuning, palette
- `game/src/kitchen.js` — station layout and click hit-testing
- `game/src/orders.js` — the ticket rail
- `game/src/chef.js` — the chef: movement and carrying
- `game/src/render.js` — all canvas drawing
- `game/src/audio.js` — synthesized sounds
- `main.ts` — the hand-in program (copies `game/` + `screenshots/`, writes `dossier.json`)
- `vendor/makefun-game.ts` — the kit's library, unchanged
