// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'alumni.db');
const db = new Database(dbPath);

const app = express();
app.use(cors());
app.use(bodyParser.json());


db.prepare(`CREATE TABLE IF NOT EXISTS alumni (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  batch_year INTEGER NOT NULL,
  company TEXT,
  linkedin_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

// GET /api/alumni?batch=2024
app.get('/api/alumni', (req, res) => {
  const { batch } = req.query;
  let rows;
  if (batch) {
    rows = db.prepare('SELECT * FROM alumni WHERE batch_year = ? ORDER BY created_at DESC').all(Number(batch));
  } else {
    rows = db.prepare('SELECT * FROM alumni ORDER BY created_at DESC').all();
  }
  res.json({ success: true, data: rows });
});

// POST /api/alumni
app.post('/api/alumni', (req, res) => {
  const { name, batch_year, company, linkedin_url } = req.body || {};
  if (!name || !batch_year) {
    return res.status(400).json({ success: false, message: 'name and batch_year required' });
  }
  const stmt = db.prepare('INSERT INTO alumni (name, batch_year, company, linkedin_url) VALUES (?, ?, ?, ?)');
  const info = stmt.run(name, Number(batch_year), company || '', linkedin_url || '');
  const newRow = db.prepare('SELECT * FROM alumni WHERE id = ?').get(info.lastInsertRowid);
  res.json({ success: true, data: newRow });
});

// optional health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
