const express = require("express");
const router = express.Router();
const {
  getOqims,
  getOqim,
  addOqim,
  deleteOqim,
  createOrder,
} = require("../controllers/oqim.controller");

router.get("/", getOqims);

router.get("/:id", getOqim);

router.post("/", addOqim);

router.delete("/:id", deleteOqim);

router.post("/:id/order", createOrder);

module.exports = router;
