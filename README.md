# team-crossword — React UI upgrade

This repository contains a minimal Node/Express backend and a React-based frontend (served from public/index.html via CDN) to convert a messy JSON list of team records into a playable, interlocking crossword.

Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run in development (nodemon):

   ```bash
   npm run dev
   ```

   Or run directly:

   ```bash
   npm start
   ```

3. Open http://localhost:3000 and paste your JSON input.

Notes

- The crossword generator is a greedy algorithm (works for many sets but may not place all names). You can replace it with a backtracking/constraint solver for better packing.
- The React client uses CDN React + Babel for a zero-build prototype. For production, convert to a proper React app with a build step (Vite/CRA) and bundle assets.

Next steps I can implement for you:
- Convert the frontend to a proper Vite/React app and commit built assets.
- Replace the greedy placement with a backtracking solver.
- Add numbering and stricter keyboard navigation within an active word.
