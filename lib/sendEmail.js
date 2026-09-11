const path = require("path");
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

// Logo is attached and referenced as cid:reycorp-logo in the HTML
const logoAttachment = {
  filename: "reycorp-logo.png",
  path: path.join(__dirname, "reycorp-logo-email.png"),
  cid: "reycorp-logo",
};

/**
 * Sends:
 *  1. Confirmation to the attendee
 *  2. Immediate alert to admin
 */
async function sendRegistrationEmails({ fullName, phone, email, address, reference, submittedAt }) {
  const fromName = process.env.SMTP_FROM_NAME || "Rey Corporate Group";
  const from = `"${fromName}" <${process.env.SMTP_USER}>`;
  const adminTo = process.env.NOTIFY_EMAIL || "admin@reycorp.com.au";

  const client = buildConfirmationEmail({ fullName, reference });
  const admin = buildAdminAlertEmail({ fullName, phone, email, address, reference, submittedAt });

  await Promise.all([
    getTransporter().sendMail({
      from,
      to: email,
      subject: "Rey Corporate Group — Your registration is confirmed",
      text: client.text,
      html: client.html,
      attachments: [logoAttachment],
    }),
    getTransporter().sendMail({
      from,
      to: adminTo,
      subject: `New registration — ${reference} — ${fullName}`,
      text: admin.text,
      html: admin.html,
      attachments: [logoAttachment],
    }),
  ]);
}

module.exports = { sendRegistrationEmails };
