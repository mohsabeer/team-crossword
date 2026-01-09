// Simple greedy crossword placer (places main word horizontally in center and
// tries to intersect subsequent words by shared letters). Returns grid, placed
// words and unplaced list.

function normalizeRecords(records) {
  const out = [];
  for (const r of records) {
    if (!r) continue;
    if (typeof r === 'string') {
      const parts = r.split(',').map(s => s.trim()).filter(Boolean);
      const answerRaw = parts[0] || r;
      const clue = parts.slice(1).join(', ') || '';
      out.push({ raw: r, answerRaw, clue });
    } else if (typeof r === 'object') {
      const name = r.name || r.fullName || r.title || r[Object.keys(r)[0]] || '';
      const clueParts = [];
      if (r.title) clueParts.push(r.title);
      if (r.skills) clueParts.push(Array.isArray(r.skills) ? r.skills.join(', ') : r.skills);
      if (r.phone) clueParts.push(r.phone);
      const clue = clueParts.join(' · ');
      out.push({ raw: r, answerRaw: name, clue });
    }
  }
  return out.map(item => {
    const ans = ('' + (item.answerRaw || '')).toUpperCase().replace(/[^A-Z]/g, '');
    return { raw: item.raw, answer: ans, clue: item.clue || '' };
  }).filter(x => x.answer && x.answer.length >= 2);
}

function makeEmptyGrid(size) {
  const g = new Array(size);
  for (let r = 0; r < size; r++) {
    g[r] = new Array(size).fill(null);
  }
  return g;
}

function canPlace(grid, word, row, col, dir) {
  const size = grid.length;
  if (dir === 'across') {
    if (col < 0 || col + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
      const r = row, c = col + i;
      const ch = grid[r][c];
      if (ch && ch !== word[i]) return false;
    }
    if (col - 1 >= 0 && grid[row][col - 1]) return false;
    if (col + word.length < size && grid[row][col + word.length]) return false;
    return true;
  } else {
    if (row < 0 || row + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
      const r = row + i, c = col;
      const ch = grid[r][c];
      if (ch && ch !== word[i]) return false;
    }
    if (row - 1 >= 0 && grid[row - 1][col]) return false;
    if (row + word.length < size && grid[row + word.length][col]) return false;
    return true;
  }
}

function placeWord(grid, word, row, col, dir) {
  if (dir === 'across') {
    for (let i = 0; i < word.length; i++) {
      grid[row][col + i] = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      grid[row + i][col] = word[i];
    }
  }
}

function generateCrosswordFromRecords(records, options = {}) {
  const size = options.size || 21;
  const normalized = normalizeRecords(records);

  const seen = new Map();
  for (const it of normalized) {
    if (!seen.has(it.answer) || (it.clue && !seen.get(it.answer).clue)) {
      seen.set(it.answer, it);
    }
  }
  const items = Array.from(seen.values());

  items.sort((a, b) => b.answer.length - a.answer.length);

  const grid = makeEmptyGrid(size);
  const placed = [];
  const unplaced = [];

  if (items.length === 0) {
    return { grid, placed, unplaced: [] };
  }

  const first = items[0];
  const startRow = Math.floor(size / 2);
  const startCol = Math.floor((size - first.answer.length) / 2);
  if (!canPlace(grid, first.answer, startRow, startCol, 'across')) {
    placeWord(grid, first.answer, 0, 0, 'across');
    placed.push({
      answer: first.answer,
      clue: first.clue,
      row: 0,
      col: 0,
      dir: 'across',
      length: first.answer.length,
    });
  } else {
    placeWord(grid, first.answer, startRow, startCol, 'across');
    placed.push({
      answer: first.answer,
      clue: first.clue,
      row: startRow,
      col: startCol,
      dir: 'across',
      length: first.answer.length,
    });
  }

  function tryPlaceByIntersection(wordObj) {
    const word = wordObj.answer;
    for (const p of placed) {
      const pWord = p.answer;
      for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < pWord.length; j++) {
          if (word[i] !== pWord[j]) continue;
          if (p.dir === 'across') {
            const row = p.row - i;
            const col = p.col + j;
            if (canPlace(grid, word, row, col, 'down')) {
              placeWord(grid, word, row, col, 'down');
              placed.push({
                answer: word,
                clue: wordObj.clue,
                row,
                col,
                dir: 'down',
                length: word.length,
              });
              return true;
            }
          } else {
            const row = p.row + j;
            const col = p.col - i;
            if (canPlace(grid, word, row, col, 'across')) {
              placeWord(grid, word, row, col, 'across');
              placed.push({
                answer: word,
                clue: wordObj.clue,
                row,
                col,
                dir: 'across',
                length: word.length,
              });
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  for (let k = 1; k < items.length; k++) {
    const item = items[k];
    const placedOk = tryPlaceByIntersection(item);
    if (!placedOk) {
      let placedAny = false;
      for (let r = 0; r < size && !placedAny; r++) {
        for (let c = 0; c < size && !placedAny; c++) {
          if (canPlace(grid, item.answer, r, c, 'across')) {
            placeWord(grid, item.answer, r, c, 'across');
            placed.push({
              answer: item.answer,
              clue: item.clue,
              row: r,
              col: c,
              dir: 'across',
              length: item.answer.length,
            });
            placedAny = true;
          } else if (canPlace(grid, item.answer, r, c, 'down')) {
            placeWord(grid, item.answer, r, c, 'down');
            placed.push({
              answer: item.answer,
              clue: item.clue,
              row: r,
              col: c,
              dir: 'down',
              length: item.answer.length,
            });
            placedAny = true;
          }
        }
      }
      if (!placedAny) unplaced.push(item);
    }
  }

  return {
    size,
    grid,
    placed,
    unplaced,
  };
}

module.exports = { generateCrosswordFromRecords };
