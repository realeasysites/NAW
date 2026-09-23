const crypto = require('crypto');

function safeEqual(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function checkLogin(user, pass) {
  return safeEqual(user, process.env.ADMIN_USER || 'admin') &&
         safeEqual(pass, process.env.ADMIN_PASSWORD || 'change-me');
}
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  if (req.path.startsWith('/api')) return res.status(401).json({ error: 'Log in to continue.' });
  return res.redirect('/admin/login');
}
module.exports = { checkLogin, requireAdmin };
