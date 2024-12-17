const express = require("express");
const {
  getDonate,
  commitDonate,
} = require("../controllers/donate.constroller");
const router = express.Router();

router.get("/", getDonate);

router.post("/:id", commitDonate);

module.exports = router;

/**
 * @swagger
 * /api/donate/{id}:
 *   post:
 *     summary: Commit a donation to a box
 *     description: Donate an amount of money to a specific donation box.
 *     tags: [Donate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the donation box.
 *         schema:
 *           type: string
 *       - in: body
 *         name: donation
 *         description: Donation details.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fund:
 *                   type: number
 *                   description: The amount of money being donated.
 *                   example: 50
 *                 anonim:
 *                   type: boolean
 *                   description: Whether the donation is anonymous.
 *                   example: false
 *     responses:
 *       200:
 *         description: Donation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 your_donate:
 *                   type: object
 *                   description: Details of the user's donation.
 *                 dbox:
 *                   type: number
 *                   description: Total funds in the donation box after donation.
 *                 your_balance:
 *                   type: number
 *                   description: User's remaining balance after donation.
 *       404:
 *         description: Insufficient funds or donation box not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * api/donate:
 *   get:
 *     summary: Get user's donation information
 *     description: Retrieve the donation details for the logged-in user.
 *     tags: [Donate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donation details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fund:
 *                   type: number
 *                   description: The total funds donated by the user.
 *                   example: 100
 *       404:
 *         description: No donations found for the user
 *       500:
 *         description: Server error
 */
