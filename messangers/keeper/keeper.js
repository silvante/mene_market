const express = require("express");
const router = express.Router();
const { createKeeper } = require("./keeper.controller");

router.post("/", createKeeper);

module.exports = router;
