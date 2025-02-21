const express = require("express");
const router = express.Router();
const {
  getMyPayments,
  getPaymantsAdmin,
  successPayment,
  RejectPayment,
  createPayment,
} = require("../controllers/payment.controller");

router.get("/", getMyPayments);

router.post("/", createPayment);

router.get("/admin", getPaymantsAdmin);

router.put("/:id/success", successPayment);

router.put("/:id/reject", RejectPayment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management API
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment request
 *     description: Allows a user to create a payment request. Requires authentication.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               card_number:
 *                 type: string
 *                 example: "1234-5678-9101-1121"
 *               card_owner:
 *                 type: string
 *                 example: "John Doe"
 *               payment:
 *                 type: number
 *                 example: 150.50
 *               comment:
 *                 type: string
 *                 example: "Payment for services"
 *     responses:
 *       200:
 *         description: Payment request created successfully
 *       400:
 *         description: Insufficient balance or server error
 *       401:
 *         description: Unauthorized (token required)
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get user payment history
 *     description: Retrieve the authenticated user's payment history. Requires authentication.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user payments
 *       401:
 *         description: Unauthorized (token required)
 */

/**
 * @swagger
 * /api/payments/admin:
 *   get:
 *     summary: Get all payments (Admin only)
 *     description: Retrieve all payments. Requires admin or owner authentication.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *       401:
 *         description: Unauthorized (admin privileges required)
 */

/**
 * @swagger
 * /api/payments/{id}/success:
 *   put:
 *     summary: Mark payment as successful (Admin only)
 *     description: Marks a payment as successful. Requires admin or owner authentication.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID to mark as successful
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment marked as successful
 *       400:
 *         description: Payment not found or server error
 *       401:
 *         description: Unauthorized (admin privileges required)
 */

/**
 * @swagger
 * /api/payments/{id}/reject:
 *   put:
 *     summary: Reject a payment (Admin only)
 *     description: Rejects a payment and refunds the amount. Requires admin or owner authentication.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID to reject
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment rejected and amount refunded
 *       400:
 *         description: Payment not found or server error
 *       401:
 *         description: Unauthorized (admin privileges required)
 */
