/**
 * Controller for Order
 * @module controllers/Order.controller
 *
 */

const sequelize = require("../models").sequelize;
const orderService = require("../services/Order.service");
const OrderProductService = require("../services/OrderProduct.service");
const ProductService = require("../services/Product.service");
const CustomerService = require("../services/Customer.service");
const paymentService = require("../services/Payment.service");
const discountService = require("../services/Discount.service");
const variantOptionService = require("../services/VariantOption.service");

/**
 * Get all orders
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

/**
 * Get an order by id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orderService.getOrderById(id);
    return res.status(200).json(order);
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create an order
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.createOrder = async (req, res) => {
  const order = req.body;
  const transaction = await sequelize.transaction();
  try {
    let customer = await CustomerService.getCustomerById(order.customer_id, {
      transaction,
    });
    if (!customer) {
      throw new Error(`Customer ${order.customer_id} not found`);
    }

    const newOrder = {
      ...order,
      total_amount: order.discount_value,
    };

    const createOrder = await orderService.createOrder(newOrder, {
      transaction,
    });

    const orderProducts = await Promise.all(
      order?.products.map(async (orderProduct) => {
        const product = await ProductService.getProductById(
          orderProduct.product_id
        );

        if (!product) {
          throw new Error(`Product ${orderProduct.product_id} not found`);
        }

        if (orderProduct.options) {
          if (orderProduct.options.hasOwnProperty("topping")) {
            const topping = await variantOptionService.getVariantOptionByIds(
              orderProduct.options.topping
            );
            if (!topping) {
              throw new Error(
                `Topping ${orderProduct.options.topping} not found`
              );
            }

            orderProduct.options.topping = topping.map((t) => {
              return { label: t.label, priceChange: t.priceChange };
            });
          }
          if (orderProduct.options.hasOwnProperty("size")) {
            const size = await variantOptionService.getVariantOptionById(
              orderProduct.options.size
            );
            if (!size) {
              throw new Error(`Size ${orderProduct.options.size} not found`);
            }

            orderProduct.options.size = {
              label: size.label,
              priceChange: size.priceChange,
            };
          }
          return await OrderProductService.createOrderProduct(
            {
              order_id: createOrder.id,
              product_id: orderProduct.product_id,
              quantity: orderProduct.quantity,
              price: orderProduct.price * orderProduct.quantity,
              options: orderProduct.options,
            },
            { transaction }
          );
        }
      })
    );

    const applyDiscount = await Promise.all(
      order?.discounts?.map(async (discount) => {
        return await discountService.createOrderDiscount(order, discount.id, {
          transaction,
        });
      })
    );

    const invalidDiscount = applyDiscount.some((discount) => discount.error);
    if (invalidDiscount) {
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid discount" });
    }

    // Tính điểm và cập nhật khách hàng
    const pointsEarned = Math.floor(order.total_amount / 1000); // 1000 VND = 1 điểm
    customer.points = customer.points + pointsEarned;

    // Xác định và cập nhật rank
    const rank = getRankBasedOnPoints(customer.points);
    customer.rank = rank;

    await customer.save({ transaction });

    await transaction.commit();
    const responseOrder = {
      ...createOrder.toJSON(),

      products: orderProducts.map((orderProduct) => {
        return {
          product_id: orderProduct.product_id,
          quantity: orderProduct.quantity,
          price: orderProduct.price,
        };
      }),
    };

    return res.status(201).json({ order: responseOrder });
  } catch (error) {
    console.log("Error", error);
    await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Duplicate on Order ID" });
    }
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Determine rank based on points
 * @param {number} points - The total points
 * @returns {string} - The rank
 */
function getRankBasedOnPoints(points) {
  if (points >= 10000) return 'Platinum';  
  if (points >= 5000) return 'Gold';      
  if (points >= 1000)  return 'Silver';    
  return 'Bronze';
}


/**
 * Get Order by payment status
 */

exports.getOrderByPaymentStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const orders = await orderService.getOrdersByPaymentStatus(status);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error get order by status :  ", error);

    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const order_id = req?.params.id;
  const { status } = req.body;
  try {
    const transaction = await sequelize.transaction();
    const order = await orderService.getOrderById(order_id, { transaction });

    if (!order) {
      return res.status(404).json({
        error: `Order ${order_id} not found`,
      });
    }
    
    if (order?.payment?.status === status) {
      return res.status(400).json({
        error: `Order ${order_id} already has payment status ${status}`,
      });
    }
    const updatedOrder = await orderService.updateOrderPaymentStatus(
      order_id,
      status,
      { transaction }
    );
    return res.status(200).json({
      message: `Order ${order_id} payment status updated to ${status}`,
      status_update: updatedOrder ? "success" : "failed",
    });
  } catch (error) {
    console.error("Error update payment status :  ", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update an order
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const order = req.body;
  try {
    const updatedOrder = await orderService.updateOrder(id, order);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an order
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const order = await orderService.getOrderById(id, { transaction });

    if (!order) {
      return res.status(404).json({
        error: `Order ${id} not found`,
      });
    }

    await OrderProductService.deleteOrderProductsByOrderId(id, { transaction });
    await paymentService.deletePaymentByOrderId(id, { transaction });
    await orderService.deleteOrder(id, { transaction });
    transaction.commit();

    return res.status(200).json({
      message: `Order ${id} deleted successfully`,
    });
  } catch (error) {
    console.log("Error", error);
    transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get all orders by user id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getOrdersByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await orderService.getOrdersByUserId(id);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all order products by order id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getOrderProductsByOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const orderProducts = await OrderProductService.getOrderProductsByOrderId(
      id
    );
    res.status(200).json(orderProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
