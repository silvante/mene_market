const express = require("express");
const router = express.Router();
const { linkUserToTelegram } = require("./messenger.controller");

router.put("/link_user", linkUserToTelegram);

module.exports = router;

/**
 * @swagger
 * /api/messenger/link_user:
 *   put:
 *     summary: Link a user to Telegram
 *     description: Associates a user's account with a Telegram chat ID.
 *     tags: [Messenger]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat_id:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: User successfully linked to Telegram
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "linked"
 *                 user:
 *                   type: object
 *       404:
 *         description: Missing chat_id, user not found, or server error
 */
