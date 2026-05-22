const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

const SMOOBU_KEY = 'd8cfsjABysSFHumEyPFR1PkzDSPVsCZJW0Y7HGB2Iz';

app.get('/api/:endpoint(*)', async (req, res) => {
  try {
    const url = `https://login.smoobu.com/api/${req.params.endpoint}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    const response = await fetch(url, {
      headers: { 'Api-Key': SMOOBU_KEY, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);