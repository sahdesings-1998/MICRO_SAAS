/**
 * Custom React Hook for Phone Input Management
 * Handles all phone formatting, validation, and E.164 enforcement
 * 
 * Usage:
 * const { mobile, mobileDial, handleMobileChange, handleDialChange, handlePaste, getE164 } = usePhoneInput();
 */

import { useState, useCallback, useEffect } from "react";
import {
  formatPhoneInput,
  validatePhoneNumber,
  maskPhoneInput,
  handlePhonePaste as formatPastedPhone,
  e164ToFormValues,
  formValuesToE164
} from "../utils/phoneInputFormatter";

/**
 * usePhoneInput Hook
 * 
 * Manages phone number state and provides formatting/validation
 * 
 * @param {object} options - Configuration options
 * @param {string} options.initialPhone - Initial phone number in E.164 format (e.g., "+2342034567890")
 * @param {string} options.defaultDial - Default country code (e.g., "+91")
 * @param {function} options.onValidationChange - Callback when validation state changes
 * @param {function} options.onFormatChange - Callback when format changes
 * 
 * @returns {object} State and handlers for phone input
 * 
 * @example
 * const { mobile, mobileDial, handleMobileChange, handleDialChange, getE164, isValid, error } = usePhoneInput({
 *   defaultDial: "+91",
 *   onValidationChange: (isValid) => console.log("Valid:", isValid)
 * });
 * 
 * // In JSX:
 * <select value={mobileDial} onChange={handleDialChange}>...</select>
 * <input value={mobile} onChange={handleMobileChange} />
 * <button disabled={!isValid}>Save</button>
 */
export const usePhoneInput = ({
  initialPhone = "",
  defaultDial = "+91",
  onValidationChange = null,
  onFormatChange = null
} = {}) => {
  // ───────────────────────────────────────────────────
  // Parse initial phone if provided
  // ───────────────────────────────────────────────────
  const initialValues = initialPhone
    ? e164ToFormValues(initialPhone)
    : { mobile: "", mobileDial: defaultDial };

  // ───────────────────────────────────────────────────
  // State
  // ───────────────────────────────────────────────────
  const [mobile, setMobile] = useState(initialValues.mobile);
  const [mobileDial, setMobileDial] = useState(initialValues.mobileDial);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [lastError, setLastError] = useState("");

  // ───────────────────────────────────────────────────
  // Validate on mobile or dial change
  // ───────────────────────────────────────────────────
  useEffect(() => {
    const fullNumber = mobileDial + mobile;
    
    if (!mobile) {
      setIsValid(false);
      setError("");
      return;
    }

    // Check if valid length (minimum 3 digits)
    const isValidLength = mobile.length >= 3 && mobile.length <= 15;
    setIsValid(isValidLength);

    if (!isValidLength) {
      if (mobile.length < 3) {
        setError(`Too short (${mobile.length}/3 minimum)`);
      } else {
        setError("Too long (maximum 15 digits)");
      }
      setLastError(error);
    } else {
      setError("");
    }

    // Call validation callback
    if (onValidationChange) {
      onValidationChange(isValidLength);
    }
  }, [mobile, mobileDial]);

  // ───────────────────────────────────────────────────
  // Handle mobile number input
  // ───────────────────────────────────────────────────
  const handleMobileChange = useCallback(
    (eOrValue, newDial, fullNumber) => {
      // Handle both event objects and direct values
      let value;
      let dial = mobileDial;
      
      if (eOrValue?.target?.value !== undefined) {
        // Event object from input element
        value = eOrValue.target.value;
        // Format the input - extract only the new character
        const formatted = maskPhoneInput(mobile, value.slice(-1), mobileDial);
        setMobile(formatted);
        
        // Callback when format changes
        if (onFormatChange) {
          onFormatChange({
            mobile: formatted,
            mobileDial: mobileDial,
            e164: mobileDial + formatted
          });
        }
      } else if (typeof eOrValue === 'string') {
        // Direct string value from PhoneInput component
        // PhoneInput passes the entire digits value, so use it directly
        value = eOrValue;
        if (newDial !== undefined) {
          dial = newDial;
          setMobileDial(newDial);
        }
        
        // Use the value directly (it's already digits only)
        setMobile(value);
        
        // Callback when format changes
        if (onFormatChange) {
          onFormatChange({
            mobile: value,
            mobileDial: dial,
            e164: dial + value
          });
        }
      }
    },
    [mobile, mobileDial, onFormatChange]
  );

  // ───────────────────────────────────────────────────
  // Handle country code change
  // ───────────────────────────────────────────────────
  const handleDialChange = useCallback(
    (eOrValue) => {
      // Handle both event objects and direct values
      let newDial;
      
      if (eOrValue?.target?.value !== undefined) {
        // Event object from select element
        newDial = eOrValue.target.value;
      } else if (typeof eOrValue === 'string') {
        // Direct string value (from PhoneInput component)
        newDial = eOrValue;
      } else {
        return;
      }
      
      setMobileDial(newDial);

      // Callback when format changes
      if (onFormatChange) {
        onFormatChange({
          mobile: mobile,
          mobileDial: newDial,
          e164: newDial + mobile
        });
      }
    },
    [mobile, onFormatChange]
  );

  // ───────────────────────────────────────────────────
  // Handle paste event
  // ───────────────────────────────────────────────────
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();

      const pastedText = e.clipboardData.getData("text");
      const result = formatPastedPhone(pastedText, mobileDial);

      if (result.isValid || result.formatted.length > 0) {
        setMobile(result.formatted);

        if (result.warning) {
          setError(result.warning);
        } else {
          setError("");
        }

        // Callback
        if (onFormatChange) {
          onFormatChange({
            mobile: result.formatted,
            mobileDial: mobileDial,
            e164: mobileDial + result.formatted
          });
        }
      }
    },
    [mobileDial, onFormatChange]
  );

  // ───────────────────────────────────────────────────
  // Get complete E.164 format
  // ───────────────────────────────────────────────────
  const getE164 = useCallback(() => {
    return formValuesToE164(mobile, mobileDial);
  }, [mobile, mobileDial]);

  // ───────────────────────────────────────────────────
  // Reset to initial state
  // ───────────────────────────────────────────────────
  const reset = useCallback(() => {
    setMobile(initialValues.mobile);
    setMobileDial(initialValues.mobileDial);
    setError("");
  }, [initialValues]);

  // ───────────────────────────────────────────────────
  // Update from external E.164 phone
  // ───────────────────────────────────────────────────
  const setFromE164 = useCallback((e164Phone) => {
    const values = e164ToFormValues(e164Phone);
    setMobile(values.mobile);
    setMobileDial(values.mobileDial);
    setError("");
  }, []);

  // ───────────────────────────────────────────────────
  // Return all state and handlers
  // ───────────────────────────────────────────────────
  return {
    // State
    mobile,
    mobileDial,
    isValid,
    error,

    // Handlers
    handleMobileChange,
    handleDialChange,
    handlePaste,

    // Utilities
    getE164,
    reset,
    setFromE164,
    setMobile,
    setMobileDial
  };
};

export default usePhoneInput;
