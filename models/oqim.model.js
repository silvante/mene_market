const mongoose = require("mongoose")

const oqimSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }
})

const Oqim = mongoose.model("oqim", oqimSchema)
module.exports = Oqim