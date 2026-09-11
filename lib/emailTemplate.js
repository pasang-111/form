function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Logo is attached by sendEmail.js and referenced via cid:
const LOGO_CID = "cid:reycorp-logo";

/**
 * Confirmation email sent to the attendee.
 */
function buildConfirmationEmail({ fullName, reference }) {
  const safeName = escapeHtml(fullName).split(" ")[0] || "there";
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rey Corporate Group — Registration Confirmed</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0b0e14; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0e14; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#12161f; border:1px solid #c9a24b55;">

            <tr>
              <td style="padding: 40px 48px 28px; text-align:center; border-bottom:1px solid #c9a24b3d;">
                <img
                  src="${LOGO_CID}"
                  alt="Rey Corporate Group"
                  width="120"
                  height="auto"
                  style="display:block; margin:0 auto 16px; max-width:120px; height:auto; border:0;"
                />
                <div style="font-family: Georgia, serif; font-size:20px; letter-spacing:2px; color:#ede9e0; text-transform:uppercase;">Rey Corporate Group</div>
                <div style="font-family: Arial, sans-serif; font-size:12px; letter-spacing:1px; color:#8b93a7; margin-top:6px;">Registration Confirmation</div>
              </td>
            </tr>

            <tr>
              <td style="padding: 40px 48px 10px; color:#ede9e0;">
                <p style="font-size:16px; line-height:1.7; margin:0 0 20px;">Dear ${safeName},</p>
                <p style="font-size:16px; line-height:1.8; margin:0 0 24px; color:#d8d4c8;">
                  Thank you for participating with us in this event.
                </p>
                <p style="font-size:14.5px; line-height:1.8; margin:0 0 28px; color:#a8afc0;">
                  Your registration has been received and confirmed. We are honoured to
                  have you join us, and look forward to welcoming you.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #c9a24b3d; margin-bottom: 30px;">
                  <tr>
                    <td style="padding: 18px 22px; font-family: Arial, sans-serif; font-size:12px; letter-spacing:1px; color:#c9a24b; text-transform:uppercase; border-bottom:1px solid #c9a24b26;">
                      Reference
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 22px; font-family: Georgia, serif; font-size:20px; letter-spacing:1px; color:#ede9e0;">
                      ${escapeHtml(reference)}
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; line-height:1.7; margin:0 0 6px; color:#a8afc0;">
                  Warm regards,
                </p>
                <p style="font-size:15px; line-height:1.6; margin:0 0 4px; color:#ede9e0;">
                  The Rey Corporate Group Events Team
                </p>
                <p style="font-size:13px; line-height:1.6; margin:0 0 34px; color:#8b93a7;">
                  admin@reycorp.com.au &nbsp;·&nbsp; reycorp.com.au
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 22px 48px 34px; border-top:1px solid #c9a24b26; text-align:center;">
                <div style="font-family: Arial, sans-serif; font-size:11px; color:#565f74; letter-spacing:0.4px;">
                  &copy; ${year} Rey Corporate Group. All rights reserved.
                </div>
                <div style="font-family: Arial, sans-serif; font-size:11px; color:#565f74; margin-top:6px;">
                  This message was sent to confirm an event registration submitted on reycorp.com.au.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Dear ${safeName},

Thank you for participating with us in this event.

Your registration has been received and confirmed.
Reference: ${reference}

Warm regards,
The Rey Corporate Group Events Team
admin@reycorp.com.au | reycorp.com.au`;

  return { html, text };
}

/**
 * Immediate alert email sent to admin with full registration details.
 */
function buildAdminAlertEmail({ fullName, phone, email, address, reference, submittedAt }) {
  const year = new Date().getFullYear();
  const when = submittedAt
    ? new Date(submittedAt).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })
    : new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" });

  const row = (label, value) => `
    <tr>
      <td style="padding:10px 14px; font-family:Arial,sans-serif; font-size:12px; color:#c9a24b; text-transform:uppercase; letter-spacing:0.6px; width:140px; border-bottom:1px solid #c9a24b22;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px; font-family:Arial,sans-serif; font-size:14px; color:#ede9e0; border-bottom:1px solid #c9a24b22;">${escapeHtml(value || "—")}</td>
    </tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New registration — ${escapeHtml(reference)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0b0e14; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0e14; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#12161f; border:1px solid #c9a24b55;">
            <tr>
              <td style="padding: 28px 36px 20px; text-align:center; border-bottom:1px solid #c9a24b3d;">
                <img
                  src="${LOGO_CID}"
                  alt="Rey Corporate Group"
                  width="90"
                  height="auto"
                  style="display:block; margin:0 auto 12px; max-width:90px; height:auto; border:0;"
                />
                <div style="font-family: Georgia, serif; font-size:18px; letter-spacing:2px; color:#ede9e0; text-transform:uppercase;">New Event Registration</div>
                <div style="font-family: Arial, sans-serif; font-size:12px; letter-spacing:1px; color:#8b93a7; margin-top:6px;">Immediate alert · Rey Corporate Group</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #c9a24b33;">
                  ${row("Reference", reference)}
                  ${row("Submitted", when + " (Sydney)")}
                  ${row("Full name", fullName)}
                  ${row("Phone", phone)}
                  ${row("Email", email)}
                  ${row("Address", address)}
                </table>
                <p style="font-family:Arial,sans-serif; font-size:12px; color:#8b93a7; margin:22px 0 0;">
                  This alert was sent automatically when the registration form was submitted.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 36px 28px; border-top:1px solid #c9a24b26; text-align:center;">
                <div style="font-family: Arial, sans-serif; font-size:11px; color:#565f74;">
                  &copy; ${year} Rey Corporate Group
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `NEW EVENT REGISTRATION

Reference: ${reference}
Submitted: ${when} (Sydney)

Full name: ${fullName}
Phone:     ${phone}
Email:     ${email}
Address:   ${address}

— Rey Corporate Group (automatic alert)`;

  return { html, text };
}

module.exports = { buildConfirmationEmail, buildAdminAlertEmail };
