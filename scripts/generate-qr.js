/**
 * Generates the QR code attendees scan to open the registration form.
 * Run after you know the live URL (e.g. after your Vercel deploy):
 *
 *   NEXT_PUBLIC_FORM_URL=https://register.reycorp.com.au npm run generate-qr
 *
 * Produces:
 *   public/reycorp-qr.png   (for use inside the app / print)
 *   reycorp-qr.svg          (vector, best for large-format printing)
 */
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const url =
  process.env.NEXT_PUBLIC_FORM_URL ||
  process.argv[2] ||
  "https://register.reycorp.com.au";

const outDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pngPath = path.join(outDir, "reycorp-qr.png");
const svgPath = path.join(__dirname, "..", "reycorp-qr.svg");

async function run() {
  await QRCode.toFile(pngPath, url, {
    type: "png",
    width: 1024,
    margin: 2,
    color: { dark: "#0b0e14ff", light: "#ffffffff" },
  });

  const svg = await QRCode.toString(url, { type: "svg", margin: 2 });
  fs.writeFileSync(svgPath, svg);

  console.log(`QR code generated for: ${url}`);
  console.log(`  PNG -> ${pngPath}`);
  console.log(`  SVG -> ${svgPath}`);
}

run().catch((err) => {
  console.error("Failed to generate QR code:", err);
  process.exit(1);
});
