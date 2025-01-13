const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    card_number: {
        required: true,
        type: String,
    },
    card_owner: {
        required: true,
        type: String,
    },
    comment: {
        required: true,
        type: String,
    },
    payment: {
        required: true,
        type: Number
    }
})

const Payment = mongoose.model("payment", paymentSchema)
module.exports = Payment