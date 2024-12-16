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
