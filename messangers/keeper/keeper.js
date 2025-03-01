const express = require("express");
const router = express.Router();
const { createKeeper, getKeeper } = require("./keeper.controller");

router.post("/", createKeeper);

router.get("/", getKeeper);

module.exports = router;

/**
 * @swagger
 * /api/keeper:
 *   post:
 *     summary: Create or update Token Keeper
 *     description: Create a new Token Keeper or update the existing one.
 *     tags: [TokenKeeper]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bot_token:
 *                 type: string
 *                 example: "your-bot-token"
 *     responses:
 *       200:
 *         description: Token Keeper created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "activated & updated"
 *                 keeper:
 *                   type: object
 *       404:
 *         description: Unauthorized or missing bot_token
 * 
 *   get:
 *     summary: Get the Token Keeper
 *     description: Retrieve the current Token Keeper details.
 *     tags: [TokenKeeper]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the Token Keeper details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Keeper not found or unauthorized
 */
