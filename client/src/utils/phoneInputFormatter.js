/**
 * Phone Input Formatter Utility
 * Handles automatic formatting, validation, and E.164 enforcement
 * for all mobile number input fields across the application
 */

import { parseE164Phone, reconstructE164Phone, isValidE164Phone } from "./phoneParser";

/**
 * Formats raw input into E.164 format
 * Automatically prepends country code if missing
 * Removes non-numeric characters (except leading +)
 * 
 * @param {string} input - Raw user input
 * @param {string} dialCode - Selected country code (e.g., "+234")
 * @returns {object} { formatted, digits, isValid, fullE164 }
 * 
 * @example
 * formatPhoneInput("2034567890", "+234")
 * // Returns: {
 * //   formatted: "2034567890",      // Just digits for input field
 * //   digits: "2034567890",         // Same as formatted
 * //   fullE164: "+2342034567890",   // Complete E.164
 * //   isValid: true
 * // }
 * 
 * @example
 * formatPhoneInput("+2342034567890", "+234")
 * // Returns: {
 * //   formatted: "2034567890",
 * //   digits: "2034567890",
 * //   fullE164: "+2342034567890",
 * //   isValid: true
 * // }
 * 
 * @example
 * formatPhoneInput("203", "+234")
 * // Returns: {
 * //   formatted: "203",
 * //   digits: "203",
 * //   fullE164: "+234203",
 * //   isValid: false  // Too short, but still formatted
 * // }
 */
export const formatPhoneInput = (input, dialCode = "+91") => {
  if (!input || typeof input !== "string") {
    return { formatted: "", digits: "", fullE164: dialCode, isValid: false };
  }

  // Normalize dial code
  const normalizedDial = dialCode || "+91";

  // ─────────────────────────────────────────────────────
  // Step 1: Remove leading + if present (user typed it)
  // ─────────────────────────────────────────────────────
  const trimmed = input.trim();
  
  // If input starts with +, extract only the digits
  // This handles case where user pastes "+2342034567890"
  let digits;
  if (trimmed.startsWith("+")) {
    // Extract just the digits after any dial code
    digits = trimmed.replace(/[^0-9]/g, "");
  } else {
    // Input is just digits, remove any non-numeric
    digits = trimmed.replace(/[^0-9]/g, "");
  }

  // ─────────────────────────────────────────────────────
  // Step 2: Check if digits are reasonable length
  // ─────────────────────────────────────────────────────
  // Minimum: 3 digits (partial), Maximum: 15 digits (E.164 standard)
  const isValidLength = digits.length >= 3 && digits.length <= 15;

  // ─────────────────────────────────────────────────────
  // Step 3: Construct full E.164 number
  // ─────────────────────────────────────────────────────
  const fullE164 = reconstructE164Phone(normalizedDial, digits);

  return {
    formatted: digits,        // Just digits for display in input
    digits: digits,           // Clean digits
    fullE164: fullE164,      // Complete E.164 format
    isValid: isValidLength    // Valid if reasonable length
  };
};

/**
 * Validates a complete phone number
 * Checks if it's a valid E.164 format with minimum digits
 * 
 * @param {string} phoneNumber - Phone number in E.164 format
 * @returns {object} { isValid, error, fullNumber }
 * 
 * @example
 * validatePhoneNumber("+2342034567890")
 * // { isValid: true, error: null, fullNumber: "+2342034567890" }
 * 
 * @example
 * validatePhoneNumber("+234203")
 * // { isValid: false, error: "Too short", fullNumber: "+234203" }
 * 
 * @example
 * validatePhoneNumber("2342034567890")
 * // { isValid: false, error: "Missing + prefix", fullNumber: "" }
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return {
      isValid: false,
      error: "Phone number is required",
      fullNumber: ""
    };
  }

  const trimmed = phoneNumber.trim();

  // ─────────────────────────────────────────────────────
  // Check 1: Must start with +
  // ─────────────────────────────────────────────────────
  if (!trimmed.startsWith("+")) {
    return {
      isValid: false,
      error: "Phone number must start with + (E.164 format)",
      fullNumber: ""
    };
  }

  // ─────────────────────────────────────────────────────
  // Check 2: Parse the number
  // ─────────────────────────────────────────────────────
  const parsed = parseE164Phone(trimmed);

  if (!parsed.isValid) {
    return {
      isValid: false,
      error: "Invalid phone number format",
      fullNumber: ""
    };
  }

  // ─────────────────────────────────────────────────────
  // Check 3: Must have enough digits
  // E.164 standard: 4-15 digits total (including country code)
  // ─────────────────────────────────────────────────────
  const totalDigits = parsed.dialCode.replace(/[^0-9]/g, "").length + parsed.digits.length;

  if (totalDigits < 4) {
    return {
      isValid: false,
      error: `Phone number too short (need at least 4 digits total)`,
      fullNumber: parsed.dialCode + parsed.digits
    };
  }

  if (totalDigits > 15) {
    return {
      isValid: false,
      error: `Phone number too long (maximum 15 digits total)`,
      fullNumber: parsed.dialCode + parsed.digits
    };
  }

  return {
    isValid: true,
    error: null,
    fullNumber: parsed.dialCode + parsed.digits
  };
};

/**
 * Ensures phone number is in E.164 format
 * If missing country code, prepends the selected one
 * If already has country code, validates it
 * 
 * @param {string} input - User input (may or may not have country code)
 * @param {string} selectedDial - Currently selected country code
 * @returns {object} { e164, digits, dialCode, isValid }
 * 
 * @example
 * ensureE164Format("2034567890", "+234")
 * // { e164: "+2342034567890", digits: "2034567890", dialCode: "+234", isValid: true }
 * 
 * @example
 * ensureE164Format("+919876543210", "+234")
 * // { e164: "+919876543210", digits: "9876543210", dialCode: "+91", isValid: true }
 * // Note: Preserves the country code from input if valid
 */
export const ensureE164Format = (input, selectedDial = "+91") => {
  if (!input || typeof input !== "string") {
    return { e164: selectedDial, digits: "", dialCode: selectedDial, isValid: false };
  }

  const trimmed = input.trim();

  // ─────────────────────────────────────────────────────
  // If input starts with +, assume it has country code
  // ─────────────────────────────────────────────────────
  if (trimmed.startsWith("+")) {
    const parsed = parseE164Phone(trimmed);
    return {
      e164: parsed.dialCode + parsed.digits,
      digits: parsed.digits,
      dialCode: parsed.dialCode,
      isValid: parsed.isValid
    };
  }

  // ─────────────────────────────────────────────────────
  // Input is just digits, prepend selected country code
  // ─────────────────────────────────────────────────────
  const digits = trimmed.replace(/[^0-9]/g, "");
  const dialCode = selectedDial || "+91";
  const e164 = dialCode + digits;

  return {
    e164: e164,
    digits: digits,
    dialCode: dialCode,
    isValid: digits.length >= 3 && digits.length <= 15
  };
};

/**
 * Masks phone input as user types
 * Shows formatted output in real-time
 * 
 * @param {string} currentValue - Current input value
 * @param {string} newChar - Character user just typed
 * @param {string} dialCode - Selected country code
 * @returns {string} Formatted value for input field
 * 
 * @example
 * // User typed "2" in field with "+234" selected
 * maskPhoneInput("", "2", "+234")  // "2"
 * 
 * @example
 * // User typed "0" after "203"
 * maskPhoneInput("203", "0", "+234")  // "2030"
 */
export const maskPhoneInput = (currentValue = "", newChar = "", dialCode = "+91") => {
  // Only allow digits to be typed
  if (!/^\d$/.test(newChar)) {
    return currentValue;
  }

  // Concatenate new character
  const newValue = currentValue + newChar;

  // Remove non-digits
  const cleaned = newValue.replace(/[^0-9]/g, "");

  // Limit to 15 digits (E.164 standard)
  const limited = cleaned.slice(0, 15);

  return limited;
};

/**
 * Handles paste event and formats pasted content
 * Removes formatting, extracts digits, validates
 * 
 * @param {string} pastedText - Text from clipboard
 * @param {string} dialCode - Selected country code
 * @returns {object} { formatted, isValid, warning }
 * 
 * @example
 * handlePhonePaste("+234 (203) 802-987", "+234")
 * // { formatted: "2034567890", isValid: true, warning: null }
 * 
 * @example
 * handlePhonePaste("202-3456-7890", "+1")
 * // { formatted: "2023456789", isValid: true, warning: null }
 */
export const handlePhonePaste = (pastedText, dialCode = "+91") => {
  if (!pastedText || typeof pastedText !== "string") {
    return { formatted: "", isValid: false, warning: "Nothing pasted" };
  }

  // ─────────────────────────────────────────────────────
  // Check if pasted text has a country code
  // ─────────────────────────────────────────────────────
  const trimmed = pastedText.trim();
  let digits = "";
  let warning = null;

  if (trimmed.startsWith("+")) {
    // Pasted text has country code, parse it
    const parsed = parseE164Phone(trimmed);
    digits = parsed.digits;
    
    // Warn if country code differs
    if (parsed.dialCode !== dialCode) {
      warning = `Country code changed from ${dialCode} to ${parsed.dialCode}`;
    }
  } else {
    // Pasted text is just digits, use selected country code
    digits = trimmed.replace(/[^0-9]/g, "");
  }

  // Validate length
  const isValid = digits.length >= 3 && digits.length <= 15;

  return {
    formatted: digits,
    isValid: isValid,
    warning: warning
  };
};

/**
 * Converts stored E.164 to form input values
 * Used when initializing forms or editing
 * 
 * @param {string} e164Phone - Phone number in E.164 format
 * @returns {object} { mobile, mobileDial }
 * 
 * @example
 * e164ToFormValues("+2342034567890")
 * // { mobile: "2034567890", mobileDial: "+234" }
 * 
 * @example
 * e164ToFormValues("+919876543210")
 * // { mobile: "9876543210", mobileDial: "+91" }
 */
export const e164ToFormValues = (e164Phone) => {
  if (!e164Phone || typeof e164Phone !== "string") {
    return { mobile: "", mobileDial: "+91" };
  }

  const parsed = parseE164Phone(e164Phone);

  return {
    mobile: parsed.digits,
    mobileDial: parsed.dialCode
  };
};

/**
 * Converts form input values to E.164 format for storage
 * Used when saving forms
 * 
 * @param {string} mobile - Mobile number (just digits)
 * @param {string} mobileDial - Country code
 * @returns {string} Phone number in E.164 format
 * 
 * @example
 * formValuesToE164("2034567890", "+234")
 * // "+2342034567890"
 * 
 * @example
 * formValuesToE164("9876543210", "+91")
 * // "+919876543210"
 */
export const formValuesToE164 = (mobile, mobileDial = "+91") => {
  return reconstructE164Phone(mobileDial, mobile);
};

/**
 * Strips country code from E.164 number
 * Returns only the digits
 * 
 * @param {string} e164Phone - Phone number in E.164 format
 * @returns {string} Just the digits
 * 
 * @example
 * stripCountryCode("+2342034567890")
 * // "2034567890"
 */
export const stripCountryCode = (e164Phone) => {
  const parsed = parseE164Phone(e164Phone);
  return parsed.digits;
};

/**
 * Adds country code to digits
 * Returns E.164 format
 * 
 * @param {string} digits - Just the phone number digits
 * @param {string} dialCode - Country code to prepend
 * @returns {string} Phone number in E.164 format
 * 
 * @example
 * addCountryCode("2034567890", "+234")
 * // "+2342034567890"
 */
export const addCountryCode = (digits, dialCode = "+91") => {
  if (!digits || typeof digits !== "string") {
    return dialCode;
  }

  const cleanDigits = digits.replace(/[^0-9]/g, "");
  return (dialCode || "+91") + cleanDigits;
};

export default {
  formatPhoneInput,
  validatePhoneNumber,
  ensureE164Format,
  maskPhoneInput,
  handlePhonePaste,
  e164ToFormValues,
  formValuesToE164,
  stripCountryCode,
  addCountryCode
};
