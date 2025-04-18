const express = require("express");
const router = express.Router();
const {
  createOrder,
  sendOrder,
  successOrder,
  cancelOrder,
  getOrders,
  checkOrder,
  returnOrder,
  signOrderToOperator,
  getOrdersOfOperator,
  getAllOrdersOfOperator,
  getOrderById,
  getAllOrdersOfSeller,
} = require("../controllers/order.controller");

// routes here

router.post("/:id", createOrder);

router.get("/:id", getOrderById);

router.put("/:id/check", checkOrder);

router.put("/:id/send", sendOrder);

router.put("/:id/success", successOrder);

router.put("/:id/cancel", cancelOrder);

router.put("/:id/return", returnOrder);

router.get("/", getOrders);

router.put("/sign_order_to_operator", signOrderToOperator);

router.get("/operator/uo", getOrdersOfOperator);

router.get("/seller/all", getAllOrdersOfSeller);

router.get("/operator/all", getAllOrdersOfOperator);

module.exports = router;

// Swagger documentation for Order routes
/**
 * @swagger
 * /api/orders/{id}:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID to create an order for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_name:
 *                 type: string
 *               client_mobile:
 *                 type: string
 *               client_address:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Product not found or failed to create the order
 */

/**
 * @swagger
 * /api/orders/{id}/check:
 *   put:
 *     summary: Change the status of an order to "checked", statuses [operator]
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_address
 *             properties:
 *               full_address:
 *                 type: string
 *                 description: Full and correct id of client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "sent"
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/send:
 *   put:
 *     summary: Change the status of an order to "sent", statuses [admin], {courier_id} required
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courier_id
 *             properties:
 *               courier_id:
 *                 type: string
 *                 description: The courier's ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "sent"
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Change the status of an order to "canceled", statuses [admin, operator, courier]
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - desc
 *             properties:
 *               desc:
 *                 type: string
 *                 description: reason to fail
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "canceled" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/return:
 *   put:
 *     summary: Change the status of an order to "returned", statuses [owner, courier]
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - desc
 *             properties:
 *               desc:
 *                 type: string
 *                 description: reason to fail
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "canceled" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/success:
 *   put:
 *     summary: Change the status of an order to "success", statuses [courier]
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "success" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/:
 *   get:
 *     summary: gets and filters orders by your status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "success" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: gets order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Order ID
 *     responses:
 *       200:
 *         description: Order status updated to "success" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/sign_order_to_operator:
 *   put:
 *     summary: sign an order to logged operator
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Product not found or failed to create the order
 */

/**
 * @swagger
 * /api/orders/operator/uo:
 *   get:
 *     summary: gets operators orders which still not checked
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "success" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/operator/all:
 *   get:
 *     summary: gets all operators orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "success" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/seller/all:
 *   get:
 *     summary: gets all seller's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated to "success" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         total_price:
 *           type: number
 *         product_id:
 *           type: string
 *         client_name:
 *           type: string
 *         client_mobile:
 *           type: string
 *         client_address:
 *           type: string
 *         order_code:
 *           type: string
 *         status:
 *           type: string
 *       required:
 *         - total_price
 *         - product_id
 *         - client_name
 *         - client_mobile
 *         - client_address
 *         - order_code
 *         - status
 */
