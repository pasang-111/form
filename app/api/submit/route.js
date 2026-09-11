import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sendRegistrationEmails } from "../../../lib/sendEmail";
import { submitToGoogleForm } from "../../../lib/googleForm";
import { isAustralianPhone, normaliseAustralianPhone } from "../../../lib/phone";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = randomUUID().split("-")[0].toUpperCase();
  return `RCG-${stamp}-${rand}`;
}

const VALID_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const fullName = (body.fullName || "").toString().trim();
  const phoneRaw = (body.phone || "").toString().trim();
  const email = (body.email || "").toString().trim().toLowerCase();
  const street = (body.street || "").toString().trim();
  const suburb = (body.suburb || "").toString().trim();
  const state = (body.state || "").toString().trim().toUpperCase();
  const postcode = (body.postcode || "").toString().trim();

  if (!fullName || !phoneRaw || !email || !street || !suburb || !state || !postcode) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }
  if (!isAustralianPhone(phoneRaw)) {
    return NextResponse.json(
      {
        message:
          "Enter a valid Australian phone number (e.g. 04XX XXX XXX or +61 4XX XXX XXX).",
      },
      { status: 400 }
    );
  }
  if (!VALID_STATES.includes(state)) {
    return NextResponse.json(
      { message: "Select a valid Australian state or territory." },
      { status: 400 }
    );
  }
  if (!/^\d{4}$/.test(postcode)) {
    return NextResponse.json({ message: "Enter a valid 4-digit postcode." }, { status: 400 });
  }

  const phone = normaliseAustralianPhone(phoneRaw);
  const address = `${street}, ${suburb} ${state} ${postcode}`;
  const reference = makeReference();
  const submittedAt = new Date().toISOString();

  // Persist to Google Form (non-fatal if Forms is briefly down)
  try {
    await submitToGoogleForm({
      fullName,
      phone,
      email,
      address,
      reference,
      submittedAt,
    });
  } catch (err) {
    console.error("Failed to write submission to Google Form:", err);
  }

  // Email client + admin immediately
  try {
    await sendRegistrationEmails({
      fullName,
      phone,
      email,
      address,
      reference,
      submittedAt,
    });
  } catch (err) {
    console.error("Failed to send registration emails:", err);
    return NextResponse.json(
      {
        message:
          "Your registration was recorded, but the confirmation email could not be sent. Our team will follow up.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, reference }, { status: 200 });
}
