```markdown
# team-crossword — React UI upgrade

This branch adds a React-based client (served from public/index.html via CDN), improves the UI, and adds keyboard-friendly behavior.

Quick start
1. Install dependencies:
   ```
   npm install
   ```
2. Run:
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```
3. Open http://localhost:3000

What changed
- The client is now a React single-file app (no build required) in `public/index.html`.
- Improved UI and keyboard navigation:
  - Arrow keys, Tab, Shift+Tab navigate cells.
  - Type to auto-advance in the active direction (across/down).
  - Enter toggles active direction.
  - Clicking a clue focuses that word.
  - Check answers / Reveal solution buttons.

Notes & next steps
- For production you may want to convert the client to a proper React app (Vite/Create React App) and build/serve static assets.
- I can replace the greedy generator with a backtracking solver to increase placement success and add persistent puzzles, sharing, or exports.

```