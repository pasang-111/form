function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Logo embedded as base64 (optimized for email)
const LOGO_URL = "data:image/png;base64,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";

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
                  src="${LOGO_URL}"
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
                  src="${LOGO_URL}"
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
