import { useState, useRef, useEffect } from "react";
import "./phone-input.css";

// ──────────────────────────────────────────────────────────────────────────────
// Country list – dial code + flag emoji + name
// ──────────────────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: "IN", name: "India",          dial: "+91",  flag: "🇮🇳" },
  { code: "US", name: "USA",            dial: "+1",   flag: "🇺🇸" },
  { code: "GB", name: "UK",             dial: "+44",  flag: "🇬🇧" },
  { code: "AU", name: "Australia",      dial: "+61",  flag: "🇦🇺" },
  { code: "CA", name: "Canada",         dial: "+1",   flag: "🇨🇦" },
  { code: "DE", name: "Germany",        dial: "+49",  flag: "🇩🇪" },
  { code: "FR", name: "France",         dial: "+33",  flag: "🇫🇷" },
  { code: "AE", name: "UAE",            dial: "+971", flag: "🇦🇪" },
  { code: "SG", name: "Singapore",      dial: "+65",  flag: "🇸🇬" },
  { code: "JP", name: "Japan",          dial: "+81",  flag: "🇯🇵" },
  { code: "CN", name: "China",          dial: "+86",  flag: "🇨🇳" },
  { code: "BR", name: "Brazil",         dial: "+55",  flag: "🇧🇷" },
  { code: "MX", name: "Mexico",         dial: "+52",  flag: "🇲🇽" },
  { code: "ZA", name: "South Africa",   dial: "+27",  flag: "🇿🇦" },
  { code: "NG", name: "Nigeria",        dial: "+234", flag: "🇳🇬" },
  { code: "PK", name: "Pakistan",       dial: "+92",  flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh",     dial: "+880", flag: "🇧🇩" },
  { code: "PH", name: "Philippines",    dial: "+63",  flag: "🇵🇭" },
  { code: "ID", name: "Indonesia",      dial: "+62",  flag: "🇮🇩" },
  { code: "NZ", name: "New Zealand",    dial: "+64",  flag: "🇳🇿" },
  { code: "IT", name: "Italy",          dial: "+39",  flag: "🇮🇹" },
  { code: "ES", name: "Spain",          dial: "+34",  flag: "🇪🇸" },
  { code: "NL", name: "Netherlands",    dial: "+31",  flag: "🇳🇱" },
  { code: "SE", name: "Sweden",         dial: "+46",  flag: "🇸🇪" },
  { code: "NO", name: "Norway",         dial: "+47",  flag: "🇳🇴" },
  { code: "CH", name: "Switzerland",    dial: "+41",  flag: "🇨🇭" },
  { code: "RU", name: "Russia",         dial: "+7",   flag: "🇷🇺" },
  { code: "KR", name: "South Korea",    dial: "+82",  flag: "🇰🇷" },
  { code: "MY", name: "Malaysia",       dial: "+60",  flag: "🇲🇾" },
  { code: "TH", name: "Thailand",       dial: "+66",  flag: "🇹🇭" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Helper – strip non-digit characters from phone
// ──────────────────────────────────────────────────────────────────────────────
const digitsOnly = (val) => String(val ?? "").replace(/[^0-9]/g, "");

// ──────────────────────────────────────────────────────────────────────────────
// PhoneInput
//
// Props:
//   value          {string}   raw digits (no dial code), e.g. "9876543210"
//   dialCode       {string}   selected dial code, e.g. "+91"
//   onChange       {fn}       called with (digits, dialCode, fullNumber)
//   placeholder    {string}   optional placeholder text
//   id             {string}   optional id for the number input
//   className      {string}   extra class(es) on the root wrapper
//   required       {bool}
//   disabled       {bool}
//   inputClassName {string}   extra class to apply to <input> – lets you match
//                             the host form's look (e.g. "sa-form-input" or
//                             "sa-account-form-input") WITHOUT overriding any
//                             existing host styles.
// ──────────────────────────────────────────────────────────────────────────────
const PhoneInput = ({
  value = "",
  dialCode = "+91",
  onChange,
  placeholder = "Enter phone number",
  id,
  className = "",
  required = false,
  disabled = false,
  inputClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDial, setSelectedDial] = useState(dialCode);
  const dropRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search box when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filtered = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search)
      )
    : COUNTRIES;

  const selectedCountry =
    COUNTRIES.find((c) => c.dial === selectedDial) || COUNTRIES[0];

  const handleDialSelect = (country) => {
    setSelectedDial(country.dial);
    setOpen(false);
    setSearch("");
    const digits = digitsOnly(value);
    onChange?.(digits, country.dial, country.dial + digits);
  };

  const handleNumberChange = (e) => {
    const digits = digitsOnly(e.target.value);
    onChange?.(digits, selectedDial, selectedDial + digits);
  };

  return (
    <div className={`phi-wrapper ${className}`.trim()}>
      {/* ── Country code trigger ── */}
      <div className="phi-dial-wrap" ref={dropRef}>
        <button
          type="button"
          className="phi-dial-btn"
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select country code"
        >
          <span className="phi-flag" aria-hidden="true">
            {selectedCountry.flag}
          </span>
          <span className="phi-dial-code">{selectedDial}</span>
          <span className={`phi-chevron ${open ? "phi-chevron-open" : ""}`} aria-hidden="true">
            ▾
          </span>
        </button>

        {/* ── Dropdown ── */}
        {open && (
          <div className="phi-dropdown" role="listbox" aria-label="Country codes">
            <div className="phi-search-wrap">
              <input
                ref={searchRef}
                type="text"
                className="phi-search-input"
                placeholder="Search country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search country"
              />
            </div>
            <ul className="phi-country-list">
              {filtered.length === 0 ? (
                <li className="phi-no-results">No results found</li>
              ) : (
                filtered.map((c) => (
                  <li
                    key={c.code}
                    className={`phi-country-item ${
                      c.dial === selectedDial ? "phi-country-selected" : ""
                    }`}
                    role="option"
                    aria-selected={c.dial === selectedDial}
                    onClick={() => handleDialSelect(c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleDialSelect(c);
                    }}
                    tabIndex={0}
                  >
                    <span className="phi-item-flag">{c.flag}</span>
                    <span className="phi-item-name">{c.name}</span>
                    <span className="phi-item-dial">{c.dial}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Phone number input ── */}
      <input
        id={id}
        type="tel"
        className={`phi-number-input ${inputClassName}`.trim()}
        value={value}
        onChange={handleNumberChange}
        placeholder={placeholder}
        inputMode="numeric"
        required={required}
        disabled={disabled}
        autoComplete="tel-national"
        aria-label="Phone number"
      />
    </div>
  );
};

export default PhoneInput;
