const express = require("express");
const router = express.Router();
const {
  resetPassword,
  resetEmail,
  forgotPassword,
  updatedPasswordWithOTP,
} = require("./recovery.controller");

router.put("/reset-password", resetPassword);

router.put("/reset-email", resetEmail);

router.post("/forgot-password", forgotPassword);

router.put("/forgot-password/verify-and-change", updatedPasswordWithOTP);

/*
 * User Authentication API
 * Version: 1.0.0
 * Description: API for user authentication, password reset, and email updates.
 */

/**
 * @swagger
 * /api/recovery/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Allows an authenticated user to reset their password.
 *     tags: [Recovery]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             old_password:
 *               type: string
 *             new_password:
 *               type: string
 *             confirm_new_password:
 *               type: string
 *     responses:
 *       200:
 *         description: Password successfully updated
 *       400:
 *         description: Invalid password input
 *       404:
 *         description: User not found or token missing
 */

/**
 * @swagger
 * /api/recovery/reset-email:
 *   post:
 *     summary: Reset user email
 *     description: Allows an authenticated user to update their email address.
 *     tags: [Recovery]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             old_password:
 *               type: string
 *             new_email:
 *               type: string
 *               format: email
 *     responses:
 *       200:
 *         description: Email successfully updated
 *       400:
 *         description: Email already in use or invalid password
 *       404:
 *         description: User not found or token missing
 */

/**
 * @swagger
 * /api/recovery/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Sends an OTP to the user's registered email for password reset.
 *     tags: [Recovery]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/recovery/update-password-with-otp:
 *   post:
 *     summary: Update password using OTP
 *     description: Allows a user to reset their password using an OTP.
 *     tags: [Recovery]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userid:
 *               type: string
 *             otp:
 *               type: string
 *             new_password:
 *               type: string
 *             confirm_new_password:
 *               type: string
 *     responses:
 *       200:
 *         description: Password successfully updated
 *       400:
 *         description: OTP expired or invalid input
 *       404:
 *         description: User not found or OTP incorrect
 */

module.exports = router;
