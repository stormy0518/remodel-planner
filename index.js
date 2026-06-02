const express = require('express');
const path    = require('path');
const Database = require('@replit/database');

const app = express();
const db  = new Database();
const KEY = 'remodel-plan';

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// GET /data — load the saved plan
app.get('/data', async (req, res) => {
  try {
    const data = await db.get(KEY);
    if (data) {
      res.json(data);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('DB read error:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// POST /data — save the plan
app.post('/data', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    await db.set(KEY, payload);
    res.json({ ok: true });
  } catch (err) {
    console.error('DB write error:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Remodel Planner running on port ${PORT}`);
});
