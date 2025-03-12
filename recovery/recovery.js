const express = require("express");
const router = express.Router();
const { resetPassword, resetEmail } = require("./recovery.controller");

router.put("/reset-password", resetPassword);

router.put("/reset-email", resetEmail);

module.exports = router;
