const express = require("express")
const router = express.Router()
const  { createOrder, sendOrder, successOrder, cancelOrder } = require("../controllers/order.controller")

// routes here

router.post("/:id", createOrder)

router.put("/:id/send", sendOrder)

router.put("/:id/success", successOrder)

router.put("/:id/cancel", cancelOrder)

module.exports = router