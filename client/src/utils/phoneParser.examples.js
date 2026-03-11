/**
 * Phone Parser Utility - Usage Examples
 * 
 * This file demonstrates how to use the phoneParser utility to handle
 * E.164 format phone numbers in the member management system.
 */

import {
  parseE164Phone,
  reconstructE164Phone,
  isValidE164Phone,
} from "../phoneParser";

/**
 * Example 1: Parse a Nigerian phone number
 */
console.log("Example 1: Parse Nigerian phone number");
const nigeriaPhone = "+234203802987";
const parsed1 = parseE164Phone(nigeriaPhone);
console.log(`Input: ${nigeriaPhone}`);
console.log(`Parsed:`, parsed1);
// Output: { dialCode: "+234", digits: "203802987", isValid: true }

/**
 * Example 2: Parse an Indian phone number
 */
console.log("\nExample 2: Parse Indian phone number");
const indiaPhone = "+919876543210";
const parsed2 = parseE164Phone(indiaPhone);
console.log(`Input: ${indiaPhone}`);
console.log(`Parsed:`, parsed2);
// Output: { dialCode: "+91", digits: "9876543210", isValid: true }

/**
 * Example 3: Parse a US/Canada phone number (same dial code +1)
 */
console.log("\nExample 3: Parse US phone number");
const usPhone = "+12125552368";
const parsed3 = parseE164Phone(usPhone);
console.log(`Input: ${usPhone}`);
console.log(`Parsed:`, parsed3);
// Output: { dialCode: "+1", digits: "2125552368", isValid: true }

/**
 * Example 4: Parse a UK phone number
 */
console.log("\nExample 4: Parse UK phone number");
const ukPhone = "+442071838750";
const parsed4 = parseE164Phone(ukPhone);
console.log(`Input: ${ukPhone}`);
console.log(`Parsed:`, parsed4);
// Output: { dialCode: "+44", digits: "2071838750", isValid: true }

/**
 * Example 5: Parse Bangladesh phone number (longer dial code +880)
 */
console.log("\nExample 5: Parse Bangladesh phone number");
const bdPhone = "+8801712345678";
const parsed5 = parseE164Phone(bdPhone);
console.log(`Input: ${bdPhone}`);
console.log(`Parsed:`, parsed5);
// Output: { dialCode: "+880", digits: "1712345678", isValid: true }

/**
 * Example 6: Parse UAE phone number
 */
console.log("\nExample 6: Parse UAE phone number");
const uaePhone = "+971501234567";
const parsed6 = parseE164Phone(uaePhone);
console.log(`Input: ${uaePhone}`);
console.log(`Parsed:`, parsed6);
// Output: { dialCode: "+971", digits: "501234567", isValid: true }

/**
 * Example 7: Invalid phone number (missing +)
 */
console.log("\nExample 7: Invalid phone number (missing +)");
const invalidPhone = "234203802987";
const parsed7 = parseE164Phone(invalidPhone);
console.log(`Input: ${invalidPhone}`);
console.log(`Parsed:`, parsed7);
// Output: { dialCode: "+91", digits: "", isValid: false }

/**
 * Example 8: Reconstruct phone number from parts
 */
console.log("\nExample 8: Reconstruct phone number");
const reconstructed = reconstructE164Phone("+234", "203802987");
console.log(`Dial Code: "+234", Digits: "203802987"`);
console.log(`Reconstructed: ${reconstructed}`);
// Output: "+234203802987"

/**
 * Example 9: Validate phone numbers
 */
console.log("\nExample 9: Validate phone numbers");
console.log(`isValidE164Phone("+234203802987"): ${isValidE164Phone("+234203802987")}`);
// Output: true
console.log(`isValidE164Phone("234203802987"): ${isValidE164Phone("234203802987")}`);
// Output: false
console.log(`isValidE164Phone("+91"): ${isValidE164Phone("+91")}`);
// Output: false (no digits)

/**
 * Example 10: Real-world usage in a form
 * 
 * When the Edit Member modal opens with a stored phone number:
 */
console.log("\nExample 10: Real-world usage - Edit Member Modal");
const storedPhone = "+234203802987"; // From database
const { dialCode, digits } = parseE164Phone(storedPhone);
const formState = {
  mobile: digits,        // "203802987" - for the input field
  mobileDial: dialCode,  // "+234" - for the dropdown
};
console.log(`Stored phone: ${storedPhone}`);
console.log(`Form state:`, formState);
console.log(`Country code dropdown should show: ${formState.mobileDial}`);
console.log(`Mobile input field should show: ${formState.mobile}`);

/**
 * When the user submits the form:
 */
console.log("\nExample 11: Submit form");
const e164Number = reconstructE164Phone(formState.mobileDial, formState.mobile);
console.log(`Phone to save in database: ${e164Number}`);
// Output: "+234203802987"
