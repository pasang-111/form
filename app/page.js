"use client";

import { useState } from "react";
import AddressFields from "../components/AddressFields";


/** Client-side Australian phone check (mirrors lib/phone.js). */
function isAustralianPhoneClient(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  if (!d) return false;
  let national = d;
  if (national.startsWith("61") && national.length >= 11) national = national.slice(2);
  else if (national.startsWith("0") && national.length >= 10) national = national.slice(1);
  if (national.length !== 9) return false;
  return ["4", "2", "3", "7", "8"].includes(national[0]);
}

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  street: "",
  suburb: "",
  state: "",
  postcode: "",
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!form.phone.trim()) {
    errors.phone = "Enter a phone number.";
  } else if (!isAustralianPhoneClient(form.phone.trim())) {
    errors.phone = "Enter a valid Australian number (e.g. 04XX XXX XXX).";
  }
  if (!form.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.street.trim()) errors.street = "Enter your street address.";
  if (!form.suburb.trim()) errors.suburb = "Enter your suburb.";
  if (!form.state.trim()) errors.state = "Select your state.";
  if (!/^\d{4}$/.test(form.postcode.trim())) errors.postcode = "Enter a valid postcode.";
  return errors;
}

function Field({ id, label, type = "text", autoComplete, placeholder, value, onChange, onBlur, error }) {
  const hasValue = value && value.length > 0;
  return (
    <div className={`field floating ${hasValue ? "has-value" : ""} ${error ? "has-error" : ""}`}>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder=" "
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label htmlFor={id}>{label}</label>
      {error && (
        <div className="field-error" id={`${id}-error`} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (touched[field] || errors[field]) {
        // Live re-validate this field once it has been touched
        const next = { ...form, [field]: value };
        const fieldErrors = validate(next);
        setErrors((er) => ({ ...er, [field]: fieldErrors[field] }));
      }
    };
  }

  function handleBlur(field) {
    return () => {
      setTouched((t) => ({ ...t, [field]: true }));
      const fieldErrors = validate(form);
      setErrors((er) => ({ ...er, [field]: fieldErrors[field] }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      street: true,
      suburb: true,
      state: true,
      postcode: true,
    });
    if (Object.keys(v).length > 0) return;

    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        // Surface field-level duplicate errors on the matching input
        if (res.status === 409 && data?.field) {
          setErrors((er) => ({
            ...er,
            [data.field]: data.message,
          }));
        }
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      setReference(data.reference || "");
      setStatus("done");
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="page">
      <div className="mark">
        <img
          src="/reycorp-logo.png"
          alt="Rey Corporate Group"
          className="mark-logo"
          width={280}
          height={70}
        />
        <div className="mark-sub">Property · Construction · Investment</div>
      </div>

      <section className="checkpoint">
        <span className="corner-tl" aria-hidden="true" />
        <span className="corner-br" aria-hidden="true" />
        {status !== "done" && <span className="scan-line" aria-hidden="true" />}

        {status === "done" ? (
          <div className="confirmation">
            <div className="icon" aria-hidden="true">
              ✓
            </div>
            <h1>You're registered</h1>
            <p>
              Thank you for participating with us in this event. A confirmation
              has been sent to {form.email}.
            </p>
            {reference && <div className="ref">REF {reference}</div>}
          </div>
        ) : (
          <>
            <h1>Confirm your details</h1>
            <p className="lede">
              Complete the fields below to register your attendance. A
              confirmation will be emailed to you immediately.
            </p>

            {status === "error" && (
              <div className="status-banner error" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Field
                id="fullName"
                label="Full name"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={errors.fullName}
              />

              <Field
                id="phone"
                label="Phone number"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                error={errors.phone}
              />

              <Field
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
              />

              <AddressFields
                value={{
                  street: form.street,
                  suburb: form.suburb,
                  state: form.state,
                  postcode: form.postcode,
                }}
                onChange={(addr) => {
                  setForm((f) => ({ ...f, ...addr }));
                  setErrors((er) => ({
                    ...er,
                    street: undefined,
                    suburb: undefined,
                    state: undefined,
                    postcode: undefined,
                  }));
                }}
                errors={errors}
              />

              <button
                type="submit"
                className="submit-btn"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span className="btn-loading">
                    <span className="spinner" aria-hidden="true" />
                    Submitting...
                  </span>
                ) : (
                  "Submit registration"
                )}
              </button>

              <p className="form-note">
                Your details are sent securely to Rey Corporate Group and used
                only for this event.
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
