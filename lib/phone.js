/**
 * Australian phone number helpers.
 * Accepts mobile and landline in common formats, normalises to E.164-ish (+61...).
 */

function digitsOnly(str) {
  return String(str || "").replace(/\D/g, "");
}

/**
 * Returns true if the number looks like a valid Australian phone.
 * Allowed:
 *   Mobile:  04XX XXX XXX  |  +61 4XX XXX XXX  |  61 4XX XXX XXX
 *   Landline: (02|03|07|08) XXXX XXXX  |  +61 2/3/7/8 ...
 */
function isAustralianPhone(phone) {
  const d = digitsOnly(phone);
  if (!d) return false;

  // Strip leading 61 or 0 for length checks
  let national = d;
  if (national.startsWith("61") && national.length >= 11) {
    national = national.slice(2);
  } else if (national.startsWith("0") && national.length >= 10) {
    national = national.slice(1);
  }

  // After normalisation we expect 9 digits (mobile 4xxxxxxxx or landline 2/3/7/8xxxxxxxx)
  if (national.length !== 9) return false;

  const first = national[0];
  // Mobile
  if (first === "4") return true;
  // Landline area codes
  if (["2", "3", "7", "8"].includes(first)) return true;

  return false;
}

/**
 * Normalise to a consistent display/storage form: +61XXXXXXXXX (no spaces)
 */
function normaliseAustralianPhone(phone) {
  const d = digitsOnly(phone);
  if (!d) return "";

  let national = d;
  if (national.startsWith("61") && national.length >= 11) {
    national = national.slice(2);
  } else if (national.startsWith("0")) {
    national = national.slice(1);
  }

  return `+61${national}`;
}

module.exports = { isAustralianPhone, normaliseAustralianPhone, digitsOnly };
