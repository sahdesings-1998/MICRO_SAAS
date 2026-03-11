/**
 * UNIVERSAL E.164 FORMAT ENFORCEMENT
 * Integration Guide for All Mobile Input Fields
 * 
 * This guide shows how to apply E.164 format enforcement across
 * all mobile number input fields in the application.
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: USING THE CUSTOM HOOK (RECOMMENDED)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * In any form component, use the usePhoneInput hook:
 */

import { usePhoneInput } from "../hooks";
import PhoneInput from "../components/PhoneInput/PhoneInput";

// Example 1: Add Member Form
function AddMemberForm() {
  const { mobile, mobileDial, handleMobileChange, handleDialChange, getE164, isValid, error } = usePhoneInput({
    defaultDial: "+91",
    onValidationChange: (isValid) => {
      console.log("Phone is valid:", isValid);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      alert("Please enter a valid phone number");
      return;
    }

    const e164Phone = getE164();  // Gets "+919876543210"

    try {
      await api.createMember({
        name: formData.name,
        email: formData.email,
        mobile: e164Phone,  // Save as E.164
        // ... other fields
      });
    } catch (error) {
      console.error("Failed to create member:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... other fields ... */}
      <div className="form-field">
        <label>Phone</label>
        <PhoneInput
          value={mobile}
          dialCode={mobileDial}
          onChange={(digits, dial) => {
            // Handled by hook, but can still listen if needed
          }}
          required
          error={error}
        />
        {error && <span className="error">{error}</span>}
      </div>
      <button type="submit" disabled={!isValid}>
        Create Member
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────

// Example 2: Edit Member Form (with initial phone)
function EditMemberForm({ memberId, member }) {
  const { mobile, mobileDial, handleMobileChange, handleDialChange, getE164, isValid, error } = usePhoneInput({
    initialPhone: member.mobile,  // "+2342034567890" from database
    defaultDial: "+91",
    onValidationChange: (isValid) => {
      console.log("Phone is valid:", isValid);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      alert("Please enter a valid phone number");
      return;
    }

    const e164Phone = getE164();

    try {
      await api.updateMember(memberId, {
        name: formData.name,
        email: formData.email,
        mobile: e164Phone,  // Save as E.164
        // ... other fields
      });
    } catch (error) {
      console.error("Failed to update member:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... other fields ... */}
      <div className="form-field">
        <label>Phone</label>
        <PhoneInput
          value={mobile}
          dialCode={mobileDial}
          onChange={(digits, dial) => {
            // Handled by hook
          }}
          required
          error={error}
        />
        {error && <span className="error">{error}</span>}
      </div>
      <button type="submit" disabled={!isValid}>
        Update Member
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: USING UTILITIES DIRECTLY (FOR NON-FORM SCENARIOS)
// ═══════════════════════════════════════════════════════════════════════════

import {
  formatPhoneInput,
  validatePhoneNumber,
  ensureE164Format,
  maskPhoneInput,
  handlePhonePaste,
  e164ToFormValues,
  formValuesToE164,
  stripCountryCode,
  addCountryCode
} from "../utils/phoneInputFormatter";

/**
 * Example 3: Formatting user input
 */
function formatUserInput(userInput, selectedDial) {
  const result = formatPhoneInput(userInput, selectedDial);
  console.log("Formatted:", result.formatted);      // "2034567890"
  console.log("Full E.164:", result.fullE164);      // "+2342034567890"
  console.log("Is Valid:", result.isValid);          // true/false
}

/**
 * Example 4: Validating before submit
 */
function validateBeforeSubmit(phoneNumber) {
  const result = validatePhoneNumber(phoneNumber);
  
  if (!result.isValid) {
    console.error("Error:", result.error);
    return false;
  }
  
  console.log("Phone valid:", result.fullNumber);
  return true;
}

/**
 * Example 5: Converting between formats
 */
function convertFormats() {
  // When editing: Convert E.164 to form values
  const e164Phone = "+2342034567890";
  const { mobile, mobileDial } = e164ToFormValues(e164Phone);
  console.log("Mobile field:", mobile);              // "2034567890"
  console.log("Dial dropdown:", mobileDial);         // "+234"

  // When saving: Convert form values to E.164
  const saved = formValuesToE164(mobile, mobileDial);
  console.log("Saved to DB:", saved);               // "+2342034567890"
}

/**
 * Example 6: Handling pasted content
 */
function handleUserPaste(pastedText, selectedDial) {
  const result = handlePhonePaste(pastedText, selectedDial);
  
  if (result.warning) {
    console.warn("Warning:", result.warning);
  }
  
  console.log("Pasted digits:", result.formatted);   // "2034567890"
  console.log("Is valid:", result.isValid);          // true/false
}

/**
 * Example 7: Masking as user types
 */
function handleKeypress(currentValue, newChar, selectedDial) {
  const masked = maskPhoneInput(currentValue, newChar, selectedDial);
  console.log("Masked input:", masked);              // "2034"
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: FORM SUBMISSION HANDLER
// Global function to prepare phone for any form
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standardized phone preparation for any form submission
 * Use this in all form submit handlers
 */
export const preparePhoneForSubmit = (mobile, mobileDial) => {
  // Ensure mobile and mobileDial are valid
  if (!mobile || !mobileDial) {
    return {
      success: false,
      error: "Phone number is incomplete",
      e164: null
    };
  }

  const e164 = formValuesToE164(mobile, mobileDial);
  const validation = validatePhoneNumber(e164);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
      e164: null
    };
  }

  return {
    success: true,
    error: null,
    e164: validation.fullNumber
  };
};

// Usage in any form:
// const result = preparePhoneForSubmit(mobile, mobileDial);
// if (result.success) {
//   await api.save({ mobile: result.e164, ... });
// } else {
//   showError(result.error);
// }

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: ENHANCED ADMIN DASHBOARD INTEGRATION
// Update handleEditMember to use new utilities
// ═══════════════════════════════════════════════════════════════════════════

import { parseE164Phone, getDefaultDialCode } from "../utils/phoneParser";

/**
 * Updated handleEditMember in AdminDashboard.jsx
 * This ensures the phone is parsed correctly when opening edit modal
 */
export function handleEditMember_Enhanced(id, members) {
  const m = members.find((x) => String(x._id || x.userId || "") === String(id));
  if (!m) return null;

  // Parse the stored E.164 phone number
  const storedMobile = m.mobile || "";
  const { dialCode, digits } = parseE164Phone(storedMobile);

  return {
    name: m.name || "",
    email: m.email || "",
    password: "",
    mobile: digits,              // Just digits: "2034567890"
    mobileDial: dialCode,        // Country code: "+234"
    companyName: m.companyName || "",
    subscriptionPlanId: "",
    startDate: "",
    isActive: m.isActive !== false,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: HANDLING DYNAMICALLY LOADED FORMS/MODALS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * For forms loaded dynamically (e.g., via AJAX, modals opened later)
 * Initialize phone input after DOM is ready
 */

function initializeDynamicPhoneInput(formElement) {
  // Get the phone input elements
  const mobileInput = formElement.querySelector('[data-phone-mobile]');
  const dialSelect = formElement.querySelector('[data-phone-dial]');
  const storedPhone = formElement.getAttribute('data-initial-phone');

  if (!mobileInput || !dialSelect) {
    console.warn("Phone input elements not found");
    return;
  }

  // Parse stored phone if available
  if (storedPhone) {
    const { mobile, mobileDial } = e164ToFormValues(storedPhone);
    mobileInput.value = mobile;
    dialSelect.value = mobileDial;
  }

  // Add event listeners
  mobileInput.addEventListener('paste', (e) => {
    const result = handlePhonePaste(e.clipboardData.getData('text'), dialSelect.value);
    mobileInput.value = result.formatted;
  });

  mobileInput.addEventListener('input', (e) => {
    const masked = maskPhoneInput(mobileInput.value, e.data, dialSelect.value);
    mobileInput.value = masked;
  });

  dialSelect.addEventListener('change', (e) => {
    // Dial code changed, update display if needed
    console.log("Dial code changed to:", e.target.value);
  });
}

// Usage with modal:
// document.addEventListener('modalOpened', (e) => {
//   if (e.detail.modalType === 'editMember') {
//     initializeDynamicPhoneInput(e.detail.form);
//   }
// });

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: VALIDATION RULES (ENFORCED EVERYWHERE)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Universal phone validation rules
 * Applied to ALL mobile number inputs
 */

export const PHONE_VALIDATION_RULES = {
  // Minimum digits required (after country code)
  MIN_DIGITS: 3,

  // Maximum digits allowed (E.164 standard)
  MAX_DIGITS: 15,

  // Must have country code
  REQUIRE_COUNTRY_CODE: true,

  // E.164 format
  FORMAT: "E.164",

  // Validation function
  validate: (phone) => {
    if (!phone || typeof phone !== "string") return false;
    if (!phone.startsWith("+")) return false;

    const digits = phone.replace(/[^0-9]/g, "");
    return digits.length >= PHONE_VALIDATION_RULES.MIN_DIGITS &&
           digits.length <= PHONE_VALIDATION_RULES.MAX_DIGITS;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PART 7: API INTEGRATION EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * When receiving data from API, always convert to form values
 */
function processApiResponse(apiData) {
  return {
    ...apiData,
    // Convert E.164 phone to form values for display
    mobile: apiData.mobile ? stripCountryCode(apiData.mobile) : "",
    mobileDial: apiData.mobile ? parseE164Phone(apiData.mobile).dialCode : "+91"
  };
}

/**
 * When sending data to API, always convert to E.164
 */
function prepareApiRequest(formData) {
  return {
    ...formData,
    // Convert form values to E.164 for storage
    mobile: formValuesToE164(formData.mobile, formData.mobileDial)
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 8: TESTING & EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test scenarios to verify E.164 enforcement
 */

export const TEST_SCENARIOS = {
  // Scenario 1: User types just digits
  scenario1: () => {
    const result = formatPhoneInput("2034567890", "+234");
    console.assert(result.formatted === "2034567890", "Should format digits");
    console.assert(result.fullE164 === "+2342034567890", "Should create E.164");
  },

  // Scenario 2: User pastes formatted number
  scenario2: () => {
    const result = handlePhonePaste("+234 (203) 456-7890", "+234");
    console.assert(result.formatted === "2034567890", "Should extract digits");
    console.assert(result.isValid === true, "Should validate");
  },

  // Scenario 3: Edit form initializes with E.164
  scenario3: () => {
    const values = e164ToFormValues("+2342034567890");
    console.assert(values.mobile === "2034567890", "Should extract digits");
    console.assert(values.mobileDial === "+234", "Should extract dial code");
  },

  // Scenario 4: Form submission prepares E.164
  scenario4: () => {
    const e164 = formValuesToE164("2034567890", "+234");
    console.assert(e164 === "+2342034567890", "Should create E.164");
  },

  // Scenario 5: Validate complete number
  scenario5: () => {
    const result = validatePhoneNumber("+2342034567890");
    console.assert(result.isValid === true, "Should validate");
    console.assert(result.fullNumber === "+2342034567890", "Should return full number");
  }
};

// Run tests: Object.values(TEST_SCENARIOS).forEach(fn => fn());

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY: UNIVERSAL E.164 FORMAT ENFORCEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * KEY PRINCIPLES:
 * 
 * 1. INPUT HANDLING
 *    - User types: "2034567890"
 *    - We format: "2034567890" (digits only)
 *    - We display: "2034567890" in input field
 * 
 * 2. COUNTRY CODE
 *    - Always selected in dropdown: "+234"
 *    - Combined with input: "+234" + "2034567890"
 *    - Stored in DB: "+2342034567890" (E.164)
 * 
 * 3. EDITING EXISTING
 *    - Load from DB: "+2342034567890"
 *    - Parse: dialCode = "+234", digits = "2034567890"
 *    - Set dropdown: "+234"
 *    - Set input: "2034567890"
 * 
 * 4. SUBMISSION
 *    - Get from form: mobile = "2034567890", mobileDial = "+234"
 *    - Convert: formValuesToE164() = "+2342034567890"
 *    - Save to DB: "+2342034567890"
 * 
 * 5. VALIDATION
 *    - Always validate before submit: validatePhoneNumber()
 *    - Minimum 3 digits, maximum 15 digits total
 *    - Must start with "+"
 *    - Must match E.164 format
 * 
 * 6. EVERYWHERE
 *    - Apply to ALL mobile input fields
 *    - Use custom hook for forms
 *    - Use utilities for direct manipulation
 *    - Works with dynamic forms/modals
 */

export default {
  preparePhoneForSubmit,
  handleEditMember_Enhanced,
  initializeDynamicPhoneInput,
  PHONE_VALIDATION_RULES,
  processApiResponse,
  prepareApiRequest,
  TEST_SCENARIOS
};
