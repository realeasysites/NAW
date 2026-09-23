require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
require('./db/database');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 8 }
}));

app.use('/api/build-request', require('./routes/quote'));
app.use('/admin', require('./routes/admin'));
// Pages are served with {{SITE_URL}} filled in, so link previews (texts, Facebook, etc.)
// get an absolute URL for the logo share image.
const fs = require('fs');
const pages = { '/': 'index.html', '/index.html': 'index.html', '/shop': 'shop.html', '/shop.html': 'shop.html' };
function sendPage(file, req, res, status = 200) {
  const base = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const html = fs.readFileSync(path.join(__dirname, 'public', file), 'utf8').replace(/{{SITE_URL}}/g, base);
  res.status(status).type('html').send(html);
}
app.get(Object.keys(pages), (req, res) => sendPage(pages[req.path], req, res));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d', index: false }));
app.use((req, res) => sendPage('index.html', req, res, 404));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nappi Autoworks running on port ${PORT}`));
