/**
 * Submits a registration to a Google Form via its public formResponse endpoint.
 * No service account, no API keys, no OAuth — just the form ID + entry field IDs.
 *
 * How to get the values (one-time):
 * 1. Create a Google Form with these questions (Short answer / Paragraph):
 *    - Full name
 *    - Phone number
 *    - Email address
 *    - Home address
 *    - Reference          (optional but recommended)
 *    - Submitted at       (optional)
 * 2. Open the live form → View page source (or Inspect) and search for "entry.".
 *    Each question has a number like entry.1234567890.
 * 3. Put the form ID (from the URL) and the entry numbers into env vars.
 *
 * The formResponse URL looks like:
 *   https://docs.google.com/forms/d/e/FORM_ID/formResponse
 */

async function submitToGoogleForm({
  fullName,
  phone,
  email,
  address,
  reference,
  submittedAt,
}) {
  const formId = process.env.GOOGLE_FORM_ID;
  if (!formId) {
    throw new Error("Google Form is not configured: set GOOGLE_FORM_ID.");
  }

  // Entry IDs from your Google Form (see README for how to find them)
  const entryFullName = process.env.GOOGLE_FORM_ENTRY_FULL_NAME;
  const entryPhone = process.env.GOOGLE_FORM_ENTRY_PHONE;
  const entryEmail = process.env.GOOGLE_FORM_ENTRY_EMAIL;
  const entryAddress = process.env.GOOGLE_FORM_ENTRY_ADDRESS;
  const entryReference = process.env.GOOGLE_FORM_ENTRY_REFERENCE; // optional
  const entrySubmittedAt = process.env.GOOGLE_FORM_ENTRY_SUBMITTED_AT; // optional

  if (!entryFullName || !entryPhone || !entryEmail || !entryAddress) {
    throw new Error(
      "Google Form entry IDs are incomplete. Set GOOGLE_FORM_ENTRY_FULL_NAME, _PHONE, _EMAIL and _ADDRESS."
    );
  }

  const params = new URLSearchParams();
  params.append(`entry.${entryFullName}`, fullName);
  params.append(`entry.${entryPhone}`, phone);
  params.append(`entry.${entryEmail}`, email);
  params.append(`entry.${entryAddress}`, address);

  if (entryReference) {
    params.append(`entry.${entryReference}`, reference || "");
  }
  if (entrySubmittedAt) {
    params.append(`entry.${entrySubmittedAt}`, submittedAt || new Date().toISOString());
  }

  const url = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    // Google returns a 200 with a confirmation page; we treat any non-network error as success.
    // (They sometimes return 200 even when required fields are missing, so we already validated.)
    redirect: "follow",
  });

  // Google Forms almost always returns 200 on a successful POST.
  // A network failure or hard error will throw / return non-ok.
  if (!res.ok && res.status !== 200) {
    throw new Error(`Google Form submission failed with status ${res.status}`);
  }
}

module.exports = { submitToGoogleForm };
