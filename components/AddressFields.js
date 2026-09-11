"use client";

import { useEffect, useRef, useState } from "react";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

/**
 * A combobox: a text input plus a live suggestion list fetched from
 * /api/localities. Selecting a suggestion calls onSelect with the full
 * {suburb, state, postcode} row so the caller can cascade the other fields.
 */
function LocalityCombobox({
  id,
  label,
  type, // "suburb" | "postcode"
  value,
  onChange,
  onSelect,
  error,
  placeholder,
  autoBadge,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = value.trim();
    const minLen = type === "postcode" ? 2 : 2;
    if (q.length < minLen) {
      setOptions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/localities?type=${type}&q=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        setOptions(data.results || []);
        setActiveIndex(-1);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, type]);

  function choose(option) {
    onSelect(option);
    setOpen(false);
    setOptions([]);
  }

  function handleKeyDown(e) {
    if (!open || options.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        choose(options[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="field combobox" ref={boxRef}>
      <label htmlFor={id}>
        {label}
        {autoBadge && <span className="auto-badge">auto-detected</span>}
      </label>
      <div className="combobox-input-wrap">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          inputMode={type === "postcode" ? "numeric" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => value.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {loading && <span className="combobox-spinner" aria-hidden="true" />}
      </div>

      {open && options.length > 0 && (
        <ul className="combobox-list" role="listbox">
          {options.map((opt, i) => (
            <li
              key={`${opt.suburb}-${opt.postcode}-${opt.state}`}
              role="option"
              aria-selected={i === activeIndex}
              className={i === activeIndex ? "active" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(opt);
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="opt-suburb">{opt.suburb}</span>
              <span className="opt-meta">
                {opt.state} {opt.postcode}
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export default function AddressFields({ value, onChange, errors }) {
  const [autoState, setAutoState] = useState(false);
  const [autoPostcode, setAutoPostcode] = useState(false);
  const [autoSuburb, setAutoSuburb] = useState(false);

  function set(field, val) {
    onChange({ ...value, [field]: val });
  }

  function applySuburbSelection(option) {
    onChange({
      ...value,
      suburb: option.suburb,
      state: option.state,
      postcode: option.postcode,
    });
    setAutoState(true);
    setAutoPostcode(true);
    setAutoSuburb(false);
  }

  function applyPostcodeSelection(option) {
    onChange({
      ...value,
      postcode: option.postcode,
      suburb: option.suburb,
      state: option.state,
    });
    setAutoState(true);
    setAutoSuburb(true);
    setAutoPostcode(false);
  }

  return (
    <div className="address-group">
      <p className="address-hint">
        Start with suburb or postcode — state &amp; postcode auto-fill from Australian localities.
      </p>

      <div className="field">
        <label htmlFor="street">Street address</label>
        <input
          id="street"
          autoComplete="address-line1"
          placeholder="12 Memorial Avenue"
          value={value.street}
          onChange={(e) => set("street", e.target.value)}
        />
        {errors.street && <div className="field-error">{errors.street}</div>}
      </div>

      <div className="address-row">
        <LocalityCombobox
          id="suburb"
          label="Suburb"
          type="suburb"
          placeholder="e.g. Liverpool"
          value={value.suburb}
          error={errors.suburb}
          autoBadge={autoSuburb && value.suburb}
          onChange={(v) => {
            set("suburb", v);
            setAutoSuburb(false);
          }}
          onSelect={applySuburbSelection}
        />

        <LocalityCombobox
          id="postcode"
          label="Postcode"
          type="postcode"
          placeholder="e.g. 2170"
          value={value.postcode}
          error={errors.postcode}
          autoBadge={autoPostcode && value.postcode}
          onChange={(v) => {
            set("postcode", v.replace(/[^0-9]/g, "").slice(0, 4));
            setAutoPostcode(false);
          }}
          onSelect={applyPostcodeSelection}
        />
      </div>

      <div className="field">
        <label htmlFor="state">
          State / Territory
          {autoState && value.state && <span className="auto-badge">auto-detected</span>}
        </label>
        <select
          id="state"
          value={value.state}
          onChange={(e) => {
            set("state", e.target.value);
            setAutoState(false);
          }}
        >
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.state && <div className="field-error">{errors.state}</div>}
      </div>
    </div>
  );
}
