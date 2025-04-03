const express = require("express");
const router = express.Router();
const { createStock, deleteStock } = require("../controllers/stock.controller");

router.post("/", createStock);

router.delete("/:id", deleteStock);s

module.exports = router;
