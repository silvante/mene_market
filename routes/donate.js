const express = require("express");
const {
  getDonate,
  commitDonate,
  getAllDonates,
} = require("../controllers/donate.controller");
const router = express.Router();

router.get("/", getDonate);

router.post("/", commitDonate);

router.get("/all", getAllDonates);

module.exports = router;
/**
 * @swagger
 * /api/donate/:
 *   post:
 *     summary: Commit a donation to a box
 *     description: Donate an amount of money to a specific donation box.
 *     tags: [Donate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fund:
 *                 type: number
 *                 description: The amount of money being donated.
 *                 example: 50
 *               anonim:
 *                 type: boolean
 *                 description: Whether the donation is anonymous.
 *                 example: true
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
 *                   properties:
 *                     fund:
 *                       type: number
 *                       description: Amount donated.
 *                       example: 50
 *                     anonim:
 *                       type: boolean
 *                       description: Donation anonymity status.
 *                       example: true
 *                 dbox:
 *                   type: number
 *                   description: Total funds in the donation box after donation.
 *                   example: 5000
 *                 your_balance:
 *                   type: number
 *                   description: User's remaining balance after donation.
 *                   example: 950
 *       404:
 *         description: Insufficient funds or donation box not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/donate:
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
 *                 total_fund:
 *                   type: number
 *                   description: The total funds donated by the user.
 *                   example: 100
 *                 donations:
 *                   type: array
 *                   description: List of user's donations.
 *                   items:
 *                     type: object
 *                     properties:
 *                       fund:
 *                         type: number
 *                         description: Donation amount.
 *                         example: 50
 *                       anonim:
 *                         type: boolean
 *                         description: Whether the donation was anonymous.
 *                         example: true
 *                       box_id:
 *                         type: string
 *                         description: ID of the donation box.
 *                         example: "645c77eaf28a2b1a7c8e1234"
 *       404:
 *         description: No donations found for the user
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/donate/all:
 *   get:
 *     summary: Get all donation information
 *     description: Works only for admins or owners and retrieves all donation information.
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
 *                 total_fund:
 *                   type: number
 *                   description: The total funds donated by users.
 *                   example: 100
 *                 donations:
 *                   type: array
 *                   description: List of all donations.
 *                   items:
 *                     type: object
 *                     properties:
 *                       fund:
 *                         type: number
 *                         description: Donation amount.
 *                         example: 50
 *                       anonim:
 *                         type: boolean
 *                         description: Whether the donation was anonymous.
 *                         example: true
 *                       box_id:
 *                         type: string
 *                         description: ID of the donation box.
 *                         example: "645c77eaf28a2b1a7c8e1234"
 *       404:
 *         description: No donations found
 *       500:
 *         description: Server error
 */
