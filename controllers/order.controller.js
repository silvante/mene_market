const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit between 0 and 9
  }
  return otp;
}

const createOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).send("products is not defined");
    } else {
      total_price = product.price + product.for_seller;
    }
    const { client_name, client_mobile, client_address } = req.body;
    const new_order = await Order.create({
      total_price,
      product_id: product.id,
      client_name,
      client_mobile,
      client_address,
      order_code: generateOTP(),
      status: "pending",
    });
    if (!new_order) {
      res.status(404).send("try again!");
    }
    res.status(200).send(new_order);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const sendOrder = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin") {
          try {
            const id = req.params.id;
            const updated = await Order.findByIdAndUpdate(id, {
              status: "sent",
            });
            if (!updated) {
              res.status(404).send("something went wrong, try again");
            }
            res.status(200).json({ message: "status changed to sent" });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin") {
          try {
            const id = req.params.id;
            const updated = await Order.findByIdAndUpdate(
              id,
              {
                status: "canceled",
              },
              { new: true }
            ).populate("product_id");
            if (!updated) {
              res.status(404).send("something went wrong, try again");
            }
            if (updated.user_id) {
              const user = User.findById(updated.user_id);
              const new_balance = user.balance - updated.product_id.for_seller;
              await User.findByIdAndUpdate(updated.user_id, {
                balance: new_balance,
              });
            }
            res
              .status(200)
              .json({
                message:
                  "status changed to canceled # and user's balance is changed",
              });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const successOrder = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin") {
          try {
            const id = req.params.id;
            const updated = await Order.findByIdAndUpdate(
              id,
              {
                status: "success",
              },
              { new: true }
            ).populate("product_id");
            if (!updated) {
              res.status(404).send("something went wrong, try again");
            }
            if (updated.user_id) {
              const user = User.findById(updated.user_id);
              const new_balance = user.balance + updated.product_id.for_seller;
              await User.findByIdAndUpdate(updated.user_id, {
                balance: new_balance,
              });
            }
            res
              .status(200)
              .json({
                message:
                  "status changed to success # and user's balance is changed",
              });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

module.exports = { createOrder, sendOrder, cancelOrder, successOrder };
