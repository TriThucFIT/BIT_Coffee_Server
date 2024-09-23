/**
 * @swagger
 * /orders:
 *
 */
const router = require("express").Router();
const orderController = require("../controllers/Order.controller");
const { protect } = require("../middlewares/authenMiddleware");

router.get("/", protect, orderController.getAllOrders);
router.get("/status/:status", protect, orderController.getOrderByPaymentStatus);
router.get("/:id", protect, orderController.getOrderById);
router.get("/:id/detail", orderController.getOrderProductsByOrderId);
router.get("/user/:id", orderController.getOrdersByUserId);
router.post("/", orderController.createOrder);
router.put("/:id", protect, orderController.updateOrder);
router.put("/status/:id", protect, orderController.updatePaymentStatus);
router.delete("/:id", protect, orderController.deleteOrder);

module.exports = router;
