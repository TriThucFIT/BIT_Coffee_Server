// License middleware:
const adminService = require("../services/Admin.service");

const App_id = process.env.APP_ID;

/**
 * Check if it is the first time setup of the system, create license key with 3 months validity
 * @returns
 */
exports.theFirstTimeSetup = async (req, res, next) => {
  try {
      console.log(req.url);
    if (/\/customer/.test(req.url) && req.method === "POST") {
      return next();
    }
    if (/\/admin\/license(\/.*)?$/.test(req.url)) {
      return next();
    }
    if (/\/admin\/check/.test(req.url)) {
      const admin = await adminService.getAdminByAppId(App_id);
      if (admin.license_code) {
        return next();
      }
      date = new Date();
      date.setMonth(date.getMonth() + 3);
      const createLicense = await adminService.generateLicense(date);
      if (!createLicense) {
        return res.status(500).json({ error: "Error creating license key" });
      }
      // update header with the license key
      req.headers["x-license-key"] = createLicense.license;
      res.set("x-license-key", createLicense.license);

      return next();
    }
    return next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Middleware to verify the license key
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns
 */
exports.verifyLicense = async (req, res, next) => {
  try {
    if (/\/admin\/license(\/.*)?$/.test(req.url)) {
      return next();
    }
    if (/\/customer/.test(req.url) && req.method === "POST") {
      return next();
    }
    const licenseKey = req.headers["x-license-key"];
    console.log("license key", licenseKey);
    
    if (!licenseKey) {
      return res.status(401).json({ error: "License key is required" });
    }
    const checkLicense = await adminService.checkLicense(licenseKey, req?.body?.customer_id);

    if (!checkLicense.isValid) {
      return res.status(469).json({ ...checkLicense });
    }

    return next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error.message });
  }
};
