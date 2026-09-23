const express = require('express');
const path = require('path');
const db = require('../db/database');
const { checkLogin, requireAdmin } = require('../lib/auth');
const router = express.Router();
const STATUSES = ['new', 'contacted', 'quoted', 'booked', 'in the shop', 'done', 'lost'];

router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'admin-login.html')));
router.post('/login', (req, res) => {
  if (checkLogin(req.body.username, req.body.password)) { req.session.isAdmin = true; return res.redirect('/admin'); }
  res.redirect('/admin/login?error=1');
});
router.post('/logout', (req, res) => req.session.destroy(() => res.redirect('/admin/login')));

router.get('/', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'admin-dashboard.html')));
router.get('/api/leads', requireAdmin, (req, res) => {
  res.json({ statuses: STATUSES, leads: db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() });
});
router.patch('/api/leads/:id', requireAdmin, (req, res) => {
  const { status, notes } = req.body || {};
  if (status !== undefined && !STATUSES.includes(status)) return res.status(400).json({ error: 'Unknown status.' });
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  db.prepare('UPDATE leads SET status = ?, notes = ? WHERE id = ?')
    .run(status ?? lead.status, notes !== undefined ? String(notes).slice(0, 3000) : lead.notes, lead.id);
  res.json({ ok: true });
});
router.delete('/api/leads/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});
module.exports = router;
