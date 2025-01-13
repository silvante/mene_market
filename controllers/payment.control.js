const Payment = require("../models/paymant.model")
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../routes/extra")

const createPayment = async (req, res) => {
    try {
        const auth_headers = req.headers.authorization;
        if (auth_headers && auth_headers.startsWith("Bearer ")) {
            const token = auth_headers.split("Bearer ")[1];
            jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
                if (err) {
                    throw err;
                }

                try {
                    const the_user = await User.findById(user_doc.id)
                    if (!the_user) {
                        res.status(404).send("user in not defined")
                    }
                    const { card_number, card_owner, payment, comment } = req.body
                    if (the_user.balance > payment) {
                        const new_balance = the_user.balance - payment
                        await User.findByIdAndUpdate(the_user._id, {
                            balance: new_balance
                        })
                        const new_paymment = await Payment.create({
                            card_number,
                            card_owner,
                            payment,
                            comment,
                            sending: the_user._id,
                        }).populate("sending")
                        if (!new_paymment) {
                            res.status(400).send("server error")
                        }
                        res.status(200).json({
                            message: "tolov uchun sorov jonatildi",
                            payment_data: new_paymment,
                            your_balance: new_balance
                        })
                    } else {
                        res.status(400).json({ message: "Sizni balansingizda yetaricha mablag yoq" })
                    }
                } catch (err) {
                    console.log(err);
                    res.send(err);
                }
            });
        } else {
            res.status(404).send("no token provided");
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

module.exports = {}