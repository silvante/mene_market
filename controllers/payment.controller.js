const Payment = require("../models/paymant.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");
const SendMessage = require("../messenger/send_message");

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
          const the_user = await User.findById(user_doc.id);
          if (!the_user) {
            return res.status(404).send("user in not defined");
          }
          const { card_number, card_owner, payment, comment } = req.body;
          if (the_user.balance >= payment) {
            const new_balance = the_user.balance - payment;
            await User.findByIdAndUpdate(the_user._id, {
              balance: new_balance,
            });
            const new_paymment = await Payment.create({
              card_number,
              card_owner,
              payment,
              comment,
              sending: the_user._id,
            });
            if (!new_paymment) {
              return res.status(400).send("server error");
            }
            const data = {
              title: "To'lov uchun so'rov yuborish 🆕",
              message: `Siz *${card_owner}ning* *${card_number}* karta raqamiga *${payment}* so'm miqdorda to'lov uchun so'rov yubordingiz.`,
              balance: new_balance,
            };
            await SendMessage(the_user.telegram_id, data);
            res.status(200).json({
              message: "tolov uchun sorov jonatildi",
              payment_data: new_paymment.populate("sending", "-password"),
              your_balance: new_balance,
            });
          } else {
            return res
              .status(400)
              .json({ message: "Sizni balansingizda yetaricha mablag yoq" });
          }
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getMyPayments = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];
      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const payments = await Payment.find({ sending: user_doc.id });
          if (!payments) {
            return res.status(400).send("server error");
          }
          res.status(200).send(payments);
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getPaymantsAdmin = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];
      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin" || user_doc.status == "owner") {
            const payments = await Payment.find().populate(
              "sending",
              "-password"
            );
            if (!payments) {
              return res.status(400).send("server error");
            }
            res.status(200).send(payments);
          }
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const successPayment = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];
      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const id = req.params.id;
          if (user_doc.status == "admin" || user_doc.status == "owner") {
            const the_payment = await Payment.findByIdAndUpdate(id, {
              status: "success",
            }).populate("sending", "-password");
            if (!the_payment) {
              return res.status(400).send("Payment not found of server error");
            }
            const data = {
              title: "To'lov muvaffaqiyatli yakunlandi ✅",
              message: `Siz *${the_payment.card_owner}ning* *${the_payment.card_number}* karta raqamiga *${the_payment.payment}* so'm miqdorda to'lov uchun yuborgan so'rovingiz muvaffaqiyatli yakunlandi!`,
              balance: the_payment.sending.balance,
            };
            await SendMessage(the_payment.sending.telegram_id, data);
            res.status(200).json({
              success: true,
              message: "Tolov muaffaqiyatli yopildi",
              payment_data: the_payment,
            });
          }
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const RejectPayment = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];
      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const id = req.params.id;
          if (user_doc.status == "admin" || user_doc.status == "owner") {
            const the_payment = await Payment.findByIdAndUpdate(id, {
              status: "rejected",
            });
            const the_user = await User.findById(the_payment.sending);
            const new_balance = the_user.balance + the_payment.payment;
            await User.findByIdAndUpdate(the_user._id, {
              balance: new_balance,
            });
            const data = {
              title: "To'lov uchun so'rov bekor qilindi ❌",
              message: `Siz *${the_payment.card_owner}ning* *${the_payment.card_number}* karta raqamiga *${the_payment.payment}* so'm miqdorda to'lov uchun yuborgan so'rovingiz bekor qilindi!`,
              balance: new_balance,
            };
            await SendMessage(the_user.telegram_id, data);
            if (!the_payment) {
              return res.status(400).send("Payment not found of server error");
            }
            res.status(200).json({
              success: true,
              message: "Tolov rad etildi",
              payment_data: the_payment,
              the_users_balance: new_balance,
            });
          }
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getPaymantsAdmin,
  successPayment,
  RejectPayment,
};
