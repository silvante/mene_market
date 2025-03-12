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

module.exports = router;
