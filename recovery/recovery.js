const express = require("express");
const router = express.Router();
const {
  resetPassword,
  resetEmail,
  forgotPassword,
  updatedPasswordWithOTP,
  authCleaner,
  oceanCleaner,
} = require("./recovery.controller");

router.put("/reset-password", resetPassword);

router.put("/reset-email", resetEmail);

router.post("/forgot-password", forgotPassword);

router.put("/forgot-password/verify-and-change", updatedPasswordWithOTP);

router.delete("/clear-auth", authCleaner);

router.delete("/clean_the_ocean", oceanCleaner);

/*
 * User Authentication API
 * Version: 1.0.0
 * Description: API for user authentication, password reset, and email updates.
 */

/**
 * @swagger
 * /api/recovery/reset-password:
 *   put:
 *     summary: Reset user password
 *     description: Allows an authenticated user to reset their password.
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
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
 *   put:
 *     summary: Reset user email
 *     description: Allows an authenticated user to update their email address.
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/recovery/forgot-password/verify-and-change:
 *   put:
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

/**
 * @swagger
 * /api/recovery/clear-auth:
 *   delete:
 *     summary: Clean unverified users
 *     description: Allows an admin or owner to remove unverified users and expired OTPs.
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unverified users and expired OTPs removed successfully
 *       404:
 *         description: Unauthorized access or token missing
 */

/**
 * @swagger
 * /api/recovery/clean_the_ocean:
 *   delete:
 *     summary: Clean unused images
 *     description: Allows an admin or owner to remove unused images from storage.
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unused images deleted successfully
 *       404:
 *         description: Unauthorized access or token missing
 */

module.exports = router;
