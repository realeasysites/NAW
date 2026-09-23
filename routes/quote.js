const express = require('express');
const db = require('../db/database');
const { notifyNewLead } = require('../lib/mailer');
const router = express.Router();

const recent = new Map(); // simple per-IP rate limit
router.post('/', async (req, res) => {
  const ip = req.ip, now = Date.now();
  if (recent.has(ip) && now - recent.get(ip) < 30000) return res.status(429).json({ error: 'Give it 30 seconds before sending another request.' });
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot
  const clip = (v, n = 200) => String(v || '').trim().slice(0, n);
  const lead = {
    name: clip(b.name, 100), phone: clip(b.phone, 40), email: clip(b.email, 120), vehicle: clip(b.vehicle, 120),
    project_type: clip(b.project_type, 80), budget: clip(b.budget, 60), timeline: clip(b.timeline, 60), message: clip(b.message, 3000)
  };
  if (!lead.name) return res.status(400).json({ error: 'Add your name so Joe knows who to call back.' });
  if (!lead.phone && !lead.email) return res.status(400).json({ error: 'Add a phone number or email so Joe can reach you.' });
  db.prepare(`INSERT INTO leads (name, phone, email, vehicle, project_type, budget, timeline, message)
              VALUES (@name, @phone, @email, @vehicle, @project_type, @budget, @timeline, @message)`).run(lead);
  recent.set(ip, now);
  notifyNewLead(lead);
  res.json({ ok: true });
});
module.exports = router;
