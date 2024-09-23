const { validateLicense, createLicense } = require("license-key-gen");

/**
 * Generate license key
 * @param {Object} licenseData the license data
 * @property {Object} info The app_id and app_secret
 * @property {String} prodCode The product code
 *
 * @returns {String} The license key
 */
exports.generateLicenseKey = (licenseData) => {
  try {
    return createLicense(licenseData);
  } catch (err) {
    console.log("Error generating license key: ", err);
  }
};

/**
 * Verify license key
 * @param {Object} licenseData the license data
 * @param {String} licenseKey the license key
 * @returns {Object} The license key status
 * @property {number} errorCode The error code 0 for success, 1 for invalid license key
 * @property {String} message The message of the license key status "ok" for success, "Invalid license key" for invalid license key
 */

exports.verifyLicenseKey = (licenseData, licenseKey) => {
  try {
    return validateLicense(licenseData, licenseKey);
  } catch (err) {
    throw new Error("Error validating license key");
  }
};
