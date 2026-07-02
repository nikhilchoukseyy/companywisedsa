const nodemailer = require('nodemailer');
const config = require('../config');
const HttpError = require('../utils/httpError');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!config.smtpHost || !config.smtpUser || !config.smtpPass || !config.smtpFrom || !config.feedbackToEmail) {
    throw new HttpError(
      500,
      'Email configuration is incomplete. Set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, and FEEDBACK_TO_EMAIL.'
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  return cachedTransporter;
}

async function sendFeedbackEmail({ name, email, message }) {
  const transporter = getTransporter();
  const fromLabel = config.smtpFrom;
  const replyTo = email || undefined;

  await transporter.sendMail({
    from: fromLabel,
    to: config.feedbackToEmail,
    replyTo,
    subject: `New feedback from ${name}`,
    text: [
      `Name: ${name}`,
      email ? `Email: ${email}` : 'Email: not provided',
      '',
      'Feedback:',
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin: 0 0 12px;">New feedback submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${email ? escapeHtml(email) : 'Not provided'}</p>
        <p style="margin-top: 16px;"><strong>Feedback:</strong></p>
        <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
          ${escapeHtml(message)}
        </div>
      </div>
    `,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

module.exports = {
  sendFeedbackEmail,
};
