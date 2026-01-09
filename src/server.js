const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateCrosswordFromRecords } = require('./generator');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '..', 'public')));

app.post('/api/generate', (req, res) => {
  try {
    const records = req.body.records || req.body || [];
    const options = req.body.options || {};
    const puzzle = generateCrosswordFromRecords(records, options);
    res.json({ ok: true, puzzle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`team-crossword server listening on http://localhost:${PORT}`);
});
