/**
 * @api {get} /admin/ Get all users
 * @apiName GetAdmins
 * @apiGroup Admin
 */
const AdminService = require("../services/Admin.service");

/**
 *
 * @api {post} /admin/ Create a new user
 * @apiName CreateAdmin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 */

exports.getAdmins = async (req, res) => {
  try {
    const admins = await AdminService.getAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {post} /admin/ Create a new user
 * @apiName CreateAdmin
 * @apiGroup Admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * */

exports.createAdmin = async (req, res) => {
  try {
    const admin = await AdminService.createAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {get} /admin/:id Get user by id
 * @apiName GetAdminById
 * @apiGroup Admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * */

exports.getAdminById = async (req, res) => {
  try {
    const admin = await AdminService.getAdminById(req.params.id);
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {put} /admin/:id Update user
 * @apiName UpdateAdmin
 * @apiGroup Admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * */

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await AdminService.updateAdmin(req.params.id, req.body);
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {delete} /admin/:id Delete user
 * @apiName DeleteAdmin
 * @apiGroup Admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * */
exports.deleteAdmin = async (req, res) => {
  try {
    await AdminService.deleteAdmin(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {post} /admin/check Check user
 * @apiName CheckAdmin
 * @apiGroup Admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * */
exports.checkAdmin = async (req, res) => {
  console.log("check admin", req.body);
  
  try {
    const { customer_id, app_id } = req.body;
    const admin = await AdminService.checkAdmin(customer_id, app_id);
    res.status(200).json(admin);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @api {post} /admin/refresh-token Refresh token
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const token = await AdminService.refreshToken(refresh_token);
    console.log("new token", token);

    res.status(200).json({ token });
  } catch (error) {
    console.error("error", error);

    res.status(500).json({ error: error.message });
  }
};

exports.checkLicenseKey = async (req, res) => {
  try {
    const { licenseKey } = req.body;
    const licenseStatus = await AdminService.checkLicense(licenseKey);
    res.status(200).json(licenseStatus);
  } catch (error) {
    console.error("error", error);

    res.status(500).json({ error: error.message });
  }
};

exports.generateLicenseKey = async (req, res) => {
  try {
    if (!req.body.date) {
      return res.status(400).json({ message: "Date is required" });
    }
    const { user } = req;
    if (user && !user.systemAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized, Only allow System Admin" });
    }
    const licenseKey = await AdminService.generateLicense(
      new Date(req.body.date)
    );
    res.status(200).json({ licenseKey });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.extendLicenseKey = async (req, res) => {
  try {
    const { licenseKey, date } = req.body;
    const licenseStatus = await AdminService.extendLicense(licenseKey, date);
    res.status(200).json(licenseStatus);
  } catch (error) {
    console.error("error", error);

    res.status(500).json({ error: error.message });
  }
};
