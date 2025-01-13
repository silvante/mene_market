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
    },
    status: {
        type: String,
        default: "pending",
    },
    sending: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
})

const Payment = mongoose.model("payment", paymentSchema)
module.exports = Payment