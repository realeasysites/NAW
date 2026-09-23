const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function notifyNewLead(lead) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  const rows = [['Name', lead.name], ['Phone', lead.phone], ['Email', lead.email], ['Vehicle', lead.vehicle],
    ['Project', lead.project_type], ['Budget', lead.budget], ['Timeline', lead.timeline], ['Details', lead.message]]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${esc(v) || '—'}</td></tr>`).join('');
  try {
    await transporter.sendMail({
      from: `"Nappi Autoworks Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: lead.email || undefined,
      subject: `New build request: ${lead.name} — ${lead.project_type || 'General'}`,
      html: `<h2>New build request</h2><table>${rows}</table>`
    });
  } catch (err) { console.error('Email notification failed:', err.message); }
}
module.exports = { notifyNewLead };
