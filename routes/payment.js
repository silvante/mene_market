const express = require("express")
const router = express.Router()
const { getMyPayments, getPaymantsAdmin, successPayment, RejectPayment, createPayment } = require("../controllers/payment.control")

router.get("/", getMyPayments)

router.post("/", createPayment)

router.get("/admin", getPaymantsAdmin)

router.put("/:id/success", successPayment)

router.put("/:id/reject", RejectPayment)

module.exports = router