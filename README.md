# A Very Important Question ❤️

An interactive, single-page date invitation. Built with React + Vite + Tailwind CSS + Framer Motion. No backend, no database, no tracking — just a story in seven screens.

---

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

> If port 5173 is already taken by another project, run `npm run dev -- --port 5199` instead.

### Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built site locally
```

---

## Send it to her phone

**Fastest option — Netlify Drop (no account needed):**
1. `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder onto the page
4. Copy the link it gives you and send it

**Vercel:**
```bash
npm i -g vercel
vercel
```

**GitHub Pages / any static host:** upload the contents of `dist/`. The build uses relative asset paths (`base: './'`), so it works from a subfolder too.

**Test on your own phone first (same Wi-Fi):**
`npm run dev` prints a `Network:` URL — open that on your phone.

---

## Make it personal (do this first)

Everything you'd want to change lives in **`src/data/content.js`**:

| What | Where |
|---|---|
| Her name | `HER_NAME` — set it to e.g. `'Aisha'`. Leave empty and it says "beautiful". |
| The 3 date plans | `DATE_PLANS` — emoji, title, one-liner, and the extra line that appears when selected |
| The 4 moods + replies | `MOODS` |
| NO-button taunts | `NO_TAUNTS` |
| How the NO button's label evolves | `NO_LABELS` |
| "Maybe" comebacks | `MAYBE_REPLIES` |

Other useful knobs:
- **How long the NO button runs before giving up** — `MAX_DODGES` in `src/components/FunnyNoButton.jsx` (default `9`).
- **Page title / link preview text** — the `<title>` and `og:` meta tags in `index.html`. This is what shows when you send the link in WhatsApp.
- **Colors** — the `blush` / `rouge` / `cream` / `plum` palettes in `tailwind.config.js`.

---

## The flow

1. **Landing** — sealed envelope, "Hey beautiful ❤️", `Ask Me 😌`. Tapping the envelope gives a few extra one-liners.
2. **Question** — "Will you go on a date with me? 🥺❤️" with `YESSS ❤️`, `Maybe... 😏`, and `NO 😌`.
3. **The NO button** — dodges to a random spot, the card flinches, a random taunt appears. It shrinks as YES grows. After 9 attempts it stops running and turns into "Okay okay... YES? 🥺" — which just says yes.
4. **Celebration** — confetti + hearts, "YAYYYYY!!!", then a "Date successfully booked" receipt.
5. **Date plan** — three cards, each revealing an extra line when picked.
6. **Mood** — four moods, each with a personalised comeback.
7. **Final** — a "Date Pass" ticket with her plan, mood, and `SHE SAID YES ❤️`. Built to be screenshotted.
8. **Surprise** — `One More Thing 👀` reveals the closing lines, plus a tappable heart that fires more confetti.

---

## Notes on how it's built

**Music.** There's no audio file to ship. The toggle synthesises a soft looping arpeggio with the Web Audio API (`src/hooks/useAmbientMusic.js`). It never autoplays — the audio context isn't even created until she taps the toggle — and it pauses when the tab is backgrounded.

*Want a real song instead?* Drop an mp3 in `public/`, then replace the internals of `useAmbientMusic` with an `<audio loop>` element. Keep the `{ enabled, ready, toggle, chime }` return shape and nothing else needs to change.

**Confetti.** Hand-written canvas particle system (`src/components/Confetti.jsx`) — no dependency. One rAF loop that stops itself when the last particle dies, particle count scales down on small screens, and there's a hard cap so repeated taps can't cause a stutter.

**Background.** Floating hearts and twinkling stars run on pure CSS keyframes animating only `transform` and `opacity`, so they stay on the compositor and never trigger a React re-render.

**Persistence.** Progress and selections are saved to `localStorage` (`src/hooks/usePersistentState.js`), so a refresh doesn't lose her place. Every access is wrapped in try/catch — it degrades to in-memory state in private windows or when site data is blocked. **Start over** clears it.

**The NO button.** It starts in normal document flow, then switches to `position: fixed` once threatened. It picks the farthest of 8 candidate positions so each dodge is clearly visible, always stays inside the viewport (clear of the top bar and the progress dots), never shrinks below a 44px tap target, and re-clamps itself on resize. Desktop dodges on pointer-enter; touch dodges on tap.

> ⚠️ **If you edit this component:** once loose, the button is rendered through a **React portal into `<body>`** — and it has to stay that way. The screen transitions animate `filter: blur()`, and a filtered ancestor becomes the containing block for `position: fixed`. Without the portal the button measures `top` from the card instead of the viewport and lands off-screen (it was doing exactly that: `top: 683px` rendering at `y: 903` on an 844px-tall phone).

**Accessibility.** `prefers-reduced-motion` disables the decorative loops. Buttons carry `aria-label` / `aria-pressed`. Reaction-message areas have reserved height so the layout never jumps.

---

## Project structure

```
date/
├── index.html                  ← title + link-preview meta
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                 ← screen router + shared state
    ├── index.css               ← palette, glassmorphism, keyframes
    ├── data/
    │   └── content.js          ← ALL COPY LIVES HERE
    ├── hooks/
    │   ├── usePersistentState.js
    │   └── useAmbientMusic.js
    └── components/
        ├── LandingScreen.jsx
        ├── QuestionScreen.jsx
        ├── FunnyNoButton.jsx
        ├── Celebration.jsx
        ├── DateSelection.jsx
        ├── MoodSelection.jsx
        ├── FinalScreen.jsx
        ├── SurpriseScreen.jsx
        ├── Confetti.jsx
        ├── FloatingBackground.jsx
        └── ui/
            ├── Screen.jsx      ← shared transition choreography
            └── TopBar.jsx      ← music toggle + start over
```

---

Good luck. 🤞❤️
