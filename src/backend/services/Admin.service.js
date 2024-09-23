/**
 * Admin service
 * @module services/Admin
 * @requires sequelize
 *
 */
const { Admin, Customer, CustomerAdmin } = require("../models");
const { generateLicenseKey, verifyLicenseKey } = require("../utils/license");
const {
  generateAccessToken,
  generateRefreshToken,
  checkAdmin,
  getAppIdFromToken,
} = require("../utils/jwt");
const sequelize = require("../models").sequelize;

/**
 * Create a new admin
 * @param {Object} admin - The admin object
 * @returns {Promise<Object>} The newly created admin
 */
exports.createAdmin = async (admin) => {
  //   console.log(admin);
  if (!admin.customer_id || !admin.app_id) {
    throw new Error("Customer id and app id are required");
  }

  const transaction = await sequelize.transaction();
  try {
    const customer = await Customer.findOne(
      {
        where: { id: admin.customer_id },
      },
      { transaction }
    );
    if (!customer) {
      throw new Error("Customer not found");
    }

    const createAdmin = await Admin.create(admin, { transaction });

    await CustomerAdmin.create(
      {
        admin_id: createAdmin.id,
        customer_id: admin.customer_id,
      },
      { transaction }
    );
    await transaction.commit();

    return createAdmin;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

/**
 * Get all admins
 * @returns {Promise<Array<Object>>} All admins
 */
exports.getAdmins = async () => {
  return await Admin.findAll({
    attributes: { exclude: ["token", "id"] },
    include: [
      {
        model: Customer,
        as: "customers",
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "admin_id", "customer_id"],
          },
        },
      },
    ],
  });
};

exports.getAdminByAppId = async (id) => {
  return await Admin.findOne({
    where: { app_id: id },
    attributes: ["license_code", "license_expiry"],
  });
};

/**
 * check user is admin or not
 * @param {string} customer_id - The customer id
 * @param {string} app_id - The app id
 * @returns {Promise<Object>} The admin object
 */

exports.checkAdmin = async (customer_id, app_id) => {
  const isAdmin = await Admin.findOne({
    where: { customer_id, app_id },
  });
  let token;
  let refresh_token;
  if (isAdmin) {
    token = generateAccessToken(customer_id, app_id, true);
    refresh_token = generateRefreshToken(customer_id, app_id, true);
    await Customer.update({ refresh_token }, { where: { id: customer_id } });
    return {
      isAdmin: true,
      token,
      refresh_token,
    };
  } else {
    token = generateAccessToken(customer_id, app_id, false);
    refresh_token = generateRefreshToken(customer_id, app_id, false);
    return {
      isAdmin: false,
      token,
      refresh_token,
    };
  }
};

/**
 *
 * @param {String} refresh_token the refresh token to be refreshed
 * @returns {String} The new access token
 */

exports.refreshToken = async (refresh_token) => {
  const user = await Customer.findOne({
    where: { refresh_token },
  });
  if (!user) {
    throw new Error("Invalid refresh token");
  }
  const isAdmin = checkAdmin(refresh_token);
  const app_id = getAppIdFromToken(refresh_token);
  const new_token = generateAccessToken(user.id, app_id, isAdmin);
  return new_token;
};

/**
 * Check the license key
 * @param {String} licenseKey the license key to be checked
 * @returns Promise<Object> The license key status
 */
exports.checkLicense = async (licenseKey, user_id) => {
  const licenseData = {
    info: {
      app_id: process.env.APP_ID,
      app_secret: process.env.APP_SECRET_KEY,
    },
    prodCode: process.env.PROD_CODE,
  };
  const verify = verifyLicenseKey(licenseData, licenseKey);

  if (verify?.message !== "ok") {
    throw new Error("Invalid license key");
  }

  const app_license = await Admin.findOne({
    where: { license_code: licenseKey },
    attributes: ["app_id", "customer_id", "license_expiry"],
  });

  if (!app_license) {
    throw new Error("License key not found");
  }

  if (app_license.app_id !== process.env.APP_ID) {
    throw new Error("Invalid license key");
  }

  const expiryDate = new Date(app_license.license_expiry);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();

  const diffDays = Math.ceil(Math.abs(diffTime / (1000 * 60 * 60 * 24)));

  if (diffTime < 0) {
    return {
      isValid: false,
      isAdmin: app_license.customer_id === user_id,
      message: `License key expired ${diffDays} days ago`,
      days: -diffDays,
    };
  }

  if (diffDays <= 7) {
    return {
      isValid: true,
      isAdmin: app_license.customer_id === user_id,
      message: `License key will expire in ${diffDays} days`,
      days: diffDays,
    };
  }

  return {
    isValid: true,
    isAdmin: app_license.customer_id === user_id,
    message: `License key is valid for ${diffDays} days`,
    days: diffDays,
  };
};

/**
 * Refresh the license key
 * @param {String} licenseKey the license key to be refreshed
 * @param {Date} date the new expiry date
 * @returns Promise<Object> The license key status
 */
exports.extendLicense = async (licenseKey, date) => {
  if (!licenseKey || !date) {
    throw new Error("License key and expiry date are required");
  }
  date = new Date(date);
  if (date <= new Date()) {
    throw new Error("Invalid expiry date, must be greater than today");
  }
  const licenseData = {
    info: {
      app_id: process.env.APP_ID,
      app_secret: process.env.APP_SECRET_KEY,
    },
    prodCode: process.env.PROD_CODE,
  };
  const verify = verifyLicenseKey(licenseData, licenseKey);
  if (verify.message !== "ok") {
    throw new Error("Invalid license key");
  }

  const update_license = await Admin.update(
    { license_expiry: date },
    {
      where: { license_code: licenseKey },
    }
  );
  if (!update_license) {
    throw new Error("Error updating license key");
  }

  return {
    status: update_license[0],
    message: `License key ${licenseKey} updated successfully to ${date.toLocaleDateString(
      "vi-VN"
    )}`,
  };
};

/**
 * Generate a new license key, based on the license data
 * @param {Object} licenseData the license data
 * @returns Promise<String> The license key
 */

exports.generateLicense = async (date) => {
  if (!date) {
    throw new Error("Expiry date is required");
  }
  const licenseData = {
    info: {
      app_id: process.env.APP_ID,
      app_secret: process.env.APP_SECRET_KEY,
    },
    prodCode: process.env.PROD_CODE,
  };
  const licenseKey = generateLicenseKey(licenseData);
  const new_license = await Admin.update(
    { license_code: licenseKey.license, license_expiry: date },
    {
      where: { app_id: process.env.APP_ID },
    },
    { returning: true }
  );

  return new_license[0] ? licenseKey : "Error generating license key";
};
