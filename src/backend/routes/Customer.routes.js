const router = require("express").Router();
const customerController = require("../controllers/Customer.controller");
const { protect } = require("../middlewares/authenMiddleware");

router.get("/", protect, customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.get("/:id/orders", customerController.getOrdersByCustomerId);
router.get("/rank/:rank", customerController.getCustomersByRank);
router.post("/", customerController.createCustomer);
router.put("/:id", protect, customerController.updateCustomer);
router.delete("/:id", protect, customerController.deleteCustomer);

module.exports = router;
