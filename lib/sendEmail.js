const nodemailer = require("nodemailer");
const { buildConfirmationEmail, buildAdminAlertEmail } = require("./emailTemplate");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Sends:
 *  1. Confirmation to the attendee
 *  2. Immediate alert to admin (NOTIFY_EMAIL, default admin@reycorp.com.au)
 * Both go out at the same time so both inboxes get notified immediately.
 */
async function sendRegistrationEmails({ fullName, phone, email, address, reference, submittedAt }) {
  const fromName = process.env.SMTP_FROM_NAME || "Rey Corporate Group";
  const from = `"${fromName}" <${process.env.SMTP_USER}>`;
  const adminTo = process.env.NOTIFY_EMAIL || "admin@reycorp.com.au";

  const client = buildConfirmationEmail({ fullName, reference });
  const admin = buildAdminAlertEmail({ fullName, phone, email, address, reference, submittedAt });

  // Send both in parallel so client + admin are notified at the same moment
  await Promise.all([
    getTransporter().sendMail({
      from,
      to: email,
      subject: "Rey Corporate Group — Your registration is confirmed",
      text: client.text,
      html: client.html,
    }),
    getTransporter().sendMail({
      from,
      to: adminTo,
      subject: `New registration — ${reference} — ${fullName}`,
      text: admin.text,
      html: admin.html,
    }),
  ]);
}

module.exports = { sendRegistrationEmails };
