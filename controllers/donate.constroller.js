const Donate = require("../models/donate.model")
const Dbox = require("../models/donatebox.model")
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../routes/extra")

const commitDonate = async (req, res) => {
    try {
        const auth_headers = req.headers.authorization
        if (auth_headers && auth_headers.startsWith("Bearer ")) {
            const token = auth_headers.split("Bearer ")[1]

            jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
                if (err) {
                    throw err
                }

                try {
                    const box_id = req.params.id
                    const box = await Dbox.findById(box_id)
                    const { fund, anonim } = req.body
                    const donate = await Donate.findOne({user_id: user_doc.id})
                    if (donate) {
                        const new_donate = Donate.findByIdAndUpdate(donate._id, {
                            fund,
                            anonim
                        })
                        const new_fund = box.total_fund + fund
                        const dbox = await Dbox.findByIdAndUpdate(box._id, {
                            total_fund: new_fund
                        })
                        res.status(200).json({
                            your_donate: new_donate,
                            dbox: dbox.total_fund
                        })
                    } else {
                        const new_donate = Donate.create({
                            anonim,
                            fund,
                            user_id: user_doc.id,
                            box_id
                        })
                        const new_fund = box.total_fund + fund
                        const dbox = await Dbox.findByIdAndUpdate(box._id, {
                            total_fund: new_fund
                        })
                        res.status(200).json({
                            your_donate: new_donate,
                            dbox: dbox.total_fund
                        })
                    }
                    res.status(200).send(new_donate)
                } catch (err) {
                    console.log(err);
                    res.send(err)
                }
            })
        } else {
            res.status(404).send("no token provided")
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

const getDonate = async (req, res) => {
    try {
        const auth_headers = req.headers.authorization
        if (auth_headers && auth_headers.startsWith("Bearer ")) {
            const token = auth_headers.split("Bearer ")[1]

            jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
                if (err) {
                    throw err
                }

                try {
                    const donate = Donate.findOne({user_id: user_doc.id})
                    if (!donate) {
                        res.status(404).json({message: "sida ehsonlar yoq"})
                    }
                    res.status(200).send(donate)
                } catch (err) {
                    console.log(err);
                    res.send(err)
                }
            })
        } else {
            res.status(404).send("no token provided")
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

module.exports = {commitDonate, getDonate}