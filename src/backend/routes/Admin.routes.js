const router = require("express").Router();
const AdminController = require("../controllers/Admin.controller");
const { systemAdmin } = require("../middlewares/authenMiddleware");

router.get("/", systemAdmin, AdminController.getAdmins);
router.post("/", systemAdmin, AdminController.createAdmin);
router.post("/check", AdminController.checkAdmin);
router.post("/license/check", AdminController.checkLicenseKey);
router.get("/license/create", systemAdmin, AdminController.generateLicenseKey);
router.post("/license/extend", systemAdmin, AdminController.extendLicenseKey);

router.post("/refresh", AdminController.refreshToken);
router.get("/:id", AdminController.getAdminById);
router.put("/:id", systemAdmin, AdminController.updateAdmin);
router.delete("/:id", systemAdmin, AdminController.deleteAdmin);

module.exports = router;
