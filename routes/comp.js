const express = require("express");
const {
  createComp,
  getComps,
  getCompById,
  editComp,
  deleteComp,
  endComp,
} = require("../controllers/comp.controller");
const router = express.Router();

router.post("/:id", createComp);

router.get("/", getComps);

router.get("/:id", getCompById);

router.put("/:id", editComp);

router.delete("/:id", deleteComp);

router.delete("/:id/end", endComp)

module.exports = router;
/**
 * @swagger
 * /api/competitions/{product_id}:
 *   post:
 *     summary: Create a competition
 *     description: Create a new competition for a product.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id  # Fixed parameter name
 *         required: true
 *         description: The product ID the competition is associated with.
 *         schema:
 *           type: string
 *     requestBody:  # Corrected body format
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Winter Sale"
 *               desc:
 *                 type: string
 *                 example: "Join our winter sale competition!"
 *               banner:
 *                 type: string
 *                 example: "https://example.com/banner.jpg"
 *               min_length:
 *                 type: number
 *                 example: 10
 *               places:
 *                 type: number
 *                 example: 3
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               finish_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *               price:
 *                 type: number  # Fixed incorrect type
 *                 example: 1000000
 *     responses:
 *       201:
 *         description: Competition created successfully
 *       401:
 *         description: Unauthorized (admin privileges required)
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/competitions:
 *   get:
 *     summary: Get all competitions
 *     description: Retrieve a list of all competitions.
 *     tags: [Competitions]
 *     responses:
 *       200:
 *         description: List of competitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   desc:
 *                     type: string
 *                   banner:
 *                     type: string
 *                   min_length:
 *                     type: number
 *                   places:
 *                     type: number
 *                   start_date:
 *                     type: string
 *                   finish_date:
 *                     type: string
 *       404:
 *         description: No competitions found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/competitions/{id}:
 *   get:
 *     summary: Get competition by ID
 *     description: Retrieve details of a competition by its ID.
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The competition ID to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Competition found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 competition:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     desc:
 *                       type: string
 *                     banner:
 *                       type: string
 *                     min_length:
 *                       type: number
 *                     places:
 *                       type: number
 *                     start_date:
 *                       type: string
 *                     finish_date:
 *                       type: string
 *                     price:
 *                       type: Number
 *                 available_orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *       404:
 *         description: Competition not found
 */
/**
 * @swagger
 * /api/competitions/{id}:
 *   put:
 *     summary: Edit competition
 *     description: Edit an existing competition by its ID.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The competition ID to edit.
 *         schema:
 *           type: string
 *       - in: body
 *         name: competition
 *         description: Updated competition details.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "Summer Sale"
 *                 desc:
 *                   type: string
 *                   example: "Join our summer sale competition!"
 *                 banner:
 *                   type: string
 *                   example: "https://example.com/new-banner.jpg"
 *                 min_length:
 *                   type: number
 *                   example: 15
 *                 places:
 *                   type: number
 *                   example: 5
 *                 start_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-06-01"
 *                 finish_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-06-30"
 *                 price:
 *                  type: Number
 *     responses:
 *       200:
 *         description: Competition updated successfully
 *       404:
 *         description: Competition not found
 *       401:
 *         description: Unauthorized (admin privileges required)
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/competitions/{id}:
 *   delete:
 *     summary: Delete competition
 *     description: Delete an existing competition by its ID.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The competition ID to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Competition deleted successfully
 *       404:
 *         description: Competition not found
 *       401:
 *         description: Unauthorized (admin privileges required)
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/competitions/{id}/end:
 *   delete:
 *     summary: End a competition and award the winner
 *     description: Deletes a competition by ID, finds the user with the highest number of successful orders, updates their balance, and returns competition details.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the competition to end
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Competition successfully ended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "konkurs ochirildi"
 *                 winner:
 *                   type: string
 *                   example: "userId1"
 *                 winner_balance:
 *                   type: number
 *                   example: 5000
 *       404:
 *         description: Unauthorized or no token provided
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "no token provided"      
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred"
 */