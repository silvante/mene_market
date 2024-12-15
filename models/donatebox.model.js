const mongoose = require("mongoose")

const boxSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Ehson qutisi"
    },
    desc: {
        type: String,
        default: "Hayriya qilish uchun quti, Barcha hayriyalar ratingda korinadi yoki anonim sifatida berishingiz mumkin",
    },
    total_fund: {
        type: Number,
        default: 0,
    },
    is_active: {
        type: Boolean,
        default: true,
    }
});

const Dbox = mongoose.model("donate_box", boxSchema);
module.exports = Dbox