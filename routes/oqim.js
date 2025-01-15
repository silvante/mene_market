const express = require("express");
const router = express.Router();
const {
  getOqims,
  getOqim,
  addOqim,
  deleteOqim,
  createOrder,
} = require("../controllers/oqim.controller");

router.get("/", getOqims);

router.get("/:id", getOqim);

router.post("/:product_id", addOqim);

router.delete("/:id", deleteOqim);

router.post("/:id/order", createOrder);

module.exports = router;
// Swagger documentation for Oqim routes
/**
 * @swagger
 * /api/oqim:
 *   get:
 *     summary: Get all "oqims" for the authenticated user
 *     tags: [Oqims]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of "oqims" for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Oqim'
 *       404:
 *         description: "No oqims found or server error"
 */

/**
 * @swagger
 * /api/oqim/{id}:
 *   get:
 *     summary: Get a specific "oqim" by its ID
 *     tags: [Oqims]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the "oqim" to retrieve
 *     responses:
 *       200:
 *         description: "The oqim object"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oqim'
 *       404:
 *         description: "Oqim not found"
 */

/**
 * @swagger
 * /api/oqim/{product_id}:
 *   post:
 *     summary: Add a new "oqim" for the authenticated user
 *     tags: [Oqims]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to add to "oqim"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Oqim added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: "No token provided or product not found"
 */

/**
 * @swagger
 * /api/oqim/{id}:
 *   delete:
 *     summary: Delete a specific "oqim"
 *     tags: [Oqims]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the "oqim" to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Oqim deleted successfully"
 *       404:
 *         description: "Oqim not found or not authorized"
 */

/**
 * @swagger
 * /api/oqim/{id}/order:
 *   post:
 *     summary: Create an order for a specific "oqim"
 *     tags: [Oqims]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the "oqim" to create an order for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_mobile:
 *                 type: string
 *               client_name:
 *                 type: string
 *               client_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Order created successfully for the oqim"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: "Oqim not found or server error"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Oqim:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         product_id:
 *           type: string
 *       required:
 *         - user_id
 *         - product_id
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         for_seller:
 *           type: number
 *       required:
 *         - name
 *         - price
 *         - for_seller
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         client_mobile:
 *           type: string
 *         client_name:
 *           type: string
 *         client_address:
 *           type: string
 *         user_id:
 *           type: string
 *         product_id:
 *           type: string
 *         status:
 *           type: string
 *         order_code:
 *           type: string
 *         total_price:
 *           type: number
 *       required:
 *         - client_mobile
 *         - client_name
 *         - client_address
 *         - user_id
 *         - product_id
 *         - status
 *         - order_code
 *         - total_price
 */
