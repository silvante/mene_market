const express = require("express");
const {
  getDonate,
  commitDonate,
} = require("../controllers/donate.constroller");
const router = express.Router();

router.get("/", getDonate);

router.post("/:id", commitDonate);

module.exports = router;
