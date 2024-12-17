const express = require("express");
const router = express.Router();
const {
  Activate,
  Disable,
  divorceDonate,
  getDbox,
} = require("../controllers/donatebox.controller");

router.get("/", getDbox);

router.post("/acivate", Activate);

router.post("/disable", Disable);

router.put("/divorse", divorceDonate);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Donate Box
 *     description: Operations related to the donation box (activation, deactivation, fund withdrawal, and viewing the active box).
 */

/**
 * @swagger
 * /api/dbox/activate:
 *   post:
 *     summary: Activate the donation box
 *     description: Activate a disabled donation box or create a new active one if none exists.
 *     tags: [Donate Box]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donation box activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quti aktivlashtirildi"
 *       201:
 *         description: Donation box created and activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quti yaratildi va aktivlashtirildi"
 *       404:
 *         description: Donation box already active
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/dbox/disable:
 *   post:
 *     summary: Disable the donation box
 *     description: Disable the currently active donation box or create a new disabled one if none exists.
 *     tags: [Donate Box]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donation box disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quti muzlatildi"
 *       201:
 *         description: Donation box created and disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quti yaratildi va muzlatildi"
 *       404:
 *         description: No active donation box to disable
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/dbox/divorce:
 *   put:
 *     summary: Withdraw funds from the donation box
 *     description: Withdraw a specified amount of funds from the active donation box.
 *     tags: [Donate Box]
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
 *                 description: The amount of money to withdraw from the active donation box
 *                 example: 50
 *     responses:
 *       200:
 *         description: Fund withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mablag' muaffaqiyat yechildi"
 *                 total_fund:
 *                   type: number
 *                   description: Remaining funds in the donation box
 *                   example: 150
 *       404:
 *         description: No active donation box or insufficient funds
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/dbox:
 *   get:
 *     summary: Get the active donation box
 *     description: Retrieve the details of the currently active donation box.
 *     tags: [Donate Box]
 *     responses:
 *       200:
 *         description: Active donation box details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ehson qutusi"
 *                 box:
 *                   type: object
 *                   properties:
 *                     is_active:
 *                       type: boolean
 *                       description: Whether the box is active or not
 *                       example: true
 *                     total_fund:
 *                       type: number
 *                       description: Total funds in the donation box
 *                       example: 200
 *       404:
 *         description: No active donation box found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
