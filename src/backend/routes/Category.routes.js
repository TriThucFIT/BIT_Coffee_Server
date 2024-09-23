const router = require("express").Router();
const categoryController = require("../controllers/Category.controller");


router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;