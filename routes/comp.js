const express = require("express");
const { createComp } = require("../controllers/comp.controller");
const router = express.Router();

router.post(":id", createComp);

module.exports = router;
