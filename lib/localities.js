// Imported (not fs.readFileSync'd) so bundlers — including Vercel's
// serverless function packaging — include this data automatically instead
// of relying on the runtime filesystem, which isn't guaranteed to carry
// static files alongside the function.
const data = require("./au-localities.json");

const STATE_ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

/**
 * Suburb typeahead: "Live" -> Liverpool NSW 2170, Liverpool NSW 2179, ...
 * Matches on suburb name starting with the query, then containing it.
 */
function searchBySuburb(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const starts = [];
  const contains = [];
  for (const row of data) {
    const s = row.suburb.toLowerCase();
    if (s.startsWith(q)) starts.push(row);
    else if (s.includes(q)) contains.push(row);
    if (starts.length >= limit * 3) break;
  }

  const combined = [...starts, ...contains]
    .sort((a, b) => a.suburb.localeCompare(b.suburb) || a.postcode.localeCompare(b.postcode))
    .slice(0, limit);

  return combined;
}

/**
 * Postcode lookup: "2170" -> every suburb that shares that postcode,
 * so the person can confirm which one is theirs.
 */
function searchByPostcode(query, limit = 12) {
  const q = query.trim();
  if (!/^\d{2,4}$/.test(q)) return [];

  const matches = data
    .filter((row) => row.postcode.startsWith(q))
    .sort((a, b) => a.postcode.localeCompare(b.postcode) || a.suburb.localeCompare(b.suburb))
    .slice(0, limit);

  return matches;
}

module.exports = { searchBySuburb, searchByPostcode, STATE_ORDER };
