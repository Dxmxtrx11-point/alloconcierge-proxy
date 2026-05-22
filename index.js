const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const SMOOBU_KEY = 'd8cfsjABysSFHumEyPFR1PkzDSPVsCZJW0Y7HGB2Iz';

app.get('/api/:endpoint(*)', async (req, res) => {
  try {
    const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const url = `https://login.smoobu.com/api/${req.params.endpoint}${qs}`;
    const response = await fetch(url, {
      headers: { 'Api-Key': SMOOBU_KEY, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/claude', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
