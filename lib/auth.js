const crypto = require('crypto');

function safeEqual(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
// Password-only login (no username). First argument kept for compatibility.
function checkLogin(_user, pass) {
  return safeEqual(pass, process.env.ADMIN_PASSWORD || 'change-me');
}
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  if (req.path.startsWith('/api')) return res.status(401).json({ error: 'Log in to continue.' });
  return res.redirect('/admin/login');
}
module.exports = { checkLogin, requireAdmin };
