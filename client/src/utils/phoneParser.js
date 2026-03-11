/**
 * Phone Number Parser Utility
 * Handles E.164 format phone number parsing and country code extraction
 */

/**
 * Country dial codes mapping (must match COUNTRIES list in PhoneInput.jsx)
 */
const COUNTRY_DIAL_CODES = [
  { dial: "+91",  code: "IN", name: "India" },
  { dial: "+1",   code: "US", name: "USA" },
  { dial: "+44",  code: "GB", name: "UK" },
  { dial: "+61",  code: "AU", name: "Australia" },
  { dial: "+1",   code: "CA", name: "Canada" },
  { dial: "+49",  code: "DE", name: "Germany" },
  { dial: "+33",  code: "FR", name: "France" },
  { dial: "+971", code: "AE", name: "UAE" },
  { dial: "+65",  code: "SG", name: "Singapore" },
  { dial: "+81",  code: "JP", name: "Japan" },
  { dial: "+86",  code: "CN", name: "China" },
  { dial: "+55",  code: "BR", name: "Brazil" },
  { dial: "+52",  code: "MX", name: "Mexico" },
  { dial: "+27",  code: "ZA", name: "South Africa" },
  { dial: "+234", code: "NG", name: "Nigeria" },
  { dial: "+92",  code: "PK", name: "Pakistan" },
  { dial: "+880", code: "BD", name: "Bangladesh" },
  { dial: "+63",  code: "PH", name: "Philippines" },
  { dial: "+62",  code: "ID", name: "Indonesia" },
  { dial: "+64",  code: "NZ", name: "New Zealand" },
  { dial: "+39",  code: "IT", name: "Italy" },
  { dial: "+34",  code: "ES", name: "Spain" },
  { dial: "+31",  code: "NL", name: "Netherlands" },
  { dial: "+46",  code: "SE", name: "Sweden" },
  { dial: "+47",  code: "NO", name: "Norway" },
  { dial: "+41",  code: "CH", name: "Switzerland" },
  { dial: "+7",   code: "RU", name: "Russia" },
  { dial: "+82",  code: "KR", name: "South Korea" },
  { dial: "+60",  code: "MY", name: "Malaysia" },
  { dial: "+66",  code: "TH", name: "Thailand" },
];

/**
 * Parses a phone number in E.164 format and extracts country code and digits
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., "+234203802987")
 * @returns {object} Object with { dialCode, digits, isValid }
 *
 * @example
 * parseE164Phone("+234203802987")
 * // Returns: { dialCode: "+234", digits: "203802987", isValid: true }
 *
 * @example
 * parseE164Phone("+91987654321")
 * // Returns: { dialCode: "+91", digits: "987654321", isValid: true }
 */
export const parseE164Phone = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return { dialCode: "+91", digits: "", isValid: false };
  }

  const trimmed = phoneNumber.trim();

  // Must start with +
  if (!trimmed.startsWith("+")) {
    return { dialCode: "+91", digits: "", isValid: false };
  }

  // Extract dial code by testing longest matches first (e.g., +880, +971, +234 before +1)
  // Sort by dial code length descending to match longest first
  const sortedDialCodes = [...COUNTRY_DIAL_CODES].sort(
    (a, b) => b.dial.length - a.dial.length
  );

  for (const country of sortedDialCodes) {
    if (trimmed.startsWith(country.dial)) {
      const dialCode = country.dial;
      const digits = trimmed.slice(dialCode.length);

      // Ensure digits only contain numbers
      const cleanedDigits = digits.replace(/[^0-9]/g, "");

      // Valid if we have digits after the country code
      const isValid = cleanedDigits.length > 0;

      return { dialCode, digits: cleanedDigits, isValid };
    }
  }

  // No matching dial code found, return default
  return { dialCode: "+91", digits: "", isValid: false };
};

/**
 * Reconstructs a full E.164 phone number from dial code and digits
 * @param {string} dialCode - Country dial code (e.g., "+91")
 * @param {string} digits - Phone number digits (e.g., "9876543210")
 * @returns {string} Full E.164 format number (e.g., "+919876543210")
 *
 * @example
 * reconstructE164Phone("+91", "9876543210")
 * // Returns: "+919876543210"
 */
export const reconstructE164Phone = (dialCode = "+91", digits = "") => {
  if (!dialCode || typeof dialCode !== "string") {
    dialCode = "+91";
  }
  if (!digits || typeof digits !== "string") {
    digits = "";
  }

  // Clean digits - remove everything except numbers
  const cleanDigits = digits.replace(/[^0-9]/g, "");
  return dialCode + cleanDigits;
};

/**
 * Validates if a phone number is in valid E.164 format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid E.164 format
 *
 * @example
 * isValidE164Phone("+234203802987") // true
 * isValidE164Phone("234203802987")  // false (missing +)
 * isValidE164Phone("+91")            // false (no digits)
 */
export const isValidE164Phone = (phoneNumber) => {
  const parsed = parseE164Phone(phoneNumber);
  return parsed.isValid;
};

/**
 * Gets the default/fallback dial code
 * @returns {string} Default dial code ("+91" for India)
 */
export const getDefaultDialCode = () => {
  return "+91";
};

/**
 * Gets all available country dial codes
 * @returns {array} Array of country objects with dial, code, and name
 */
export const getAllDialCodes = () => {
  return COUNTRY_DIAL_CODES;
};

export default {
  parseE164Phone,
  reconstructE164Phone,
  isValidE164Phone,
  getDefaultDialCode,
  getAllDialCodes,
};
