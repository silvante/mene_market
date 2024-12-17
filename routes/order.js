const express = require("express");
const router = express.Router();
const {
  createOrder,
  sendOrder,
  successOrder,
  cancelOrder,
} = require("../controllers/order.controller");

// routes here

router.post("/:id", createOrder);

router.put("/:id/send", sendOrder);

router.put("/:id/success", successOrder);

router.put("/:id/cancel", cancelOrder);

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
 *                 type: string
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
 * /api/orders/{id}/send:
 *   put:
 *     summary: Change the status of an order to "sent"
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
 *         description: Order status updated to "sent"
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Change the status of an order to "canceled"
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
 *         description: Order status updated to "canceled" and user's balance adjusted
 *       404:
 *         description: Order not found or unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/success:
 *   put:
 *     summary: Change the status of an order to "success"
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
