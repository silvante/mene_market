const Comp = require("../models/comp.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const createComp = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "owner") {
            const {
              title,
              desc,
              banner,
              min_length,
              places,
              start_date,
              finish_date,
              price,
            } = req.body;
            const id = req.params.id;
            const new_comp = await Comp.create({
              product_id: id,
              title,
              desc,
              banner,
              min_length,
              places,
              start_date,
              finish_date,
              price,
            });
            if (!new_comp) {
              res.status(404).json({ message: "server error" });
            }
            res.status(200).json(new_comp);
          } else {
            res
              .status(404)
              .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
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
    res.send(err);
  }
};

const getComps = async (req, res) => {
  try {
    const comps = await Comp.find();
    if (!comps) {
      res.status(404).json({ message: "server error" });
    }
    res.status(200).json(comps);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getCompById = async (req, res) => {
  try {
    const id = req.params.id;
    const comp = Comp.findById(id);
    if (!comp) {
      res.status(404).json({ message: "competition not found" });
    }
    const orders = await Order.find({
      oqim_id: { $ne: null },
      status: "success",
      product_id: comp.product_id,
    }).populate("user_id");
    const groupedOrders = orders.reduce((acc, order) => {
      // Find if the user already exists in the accumulator
      const existingUser = acc.find(
        (item) => item.user.user_id.toString() === order.user_id._id.toString()
      );

      if (existingUser) {
        // If found, increase the order count
        existingUser.orderCount += 1;
      } else {
        // If not found, create a new entry with the full user object
        acc.push({
          user: order.user_id, // Store the whole user object
          orderCount: 1,
        });
      }

      return acc; // Return updated accumulator for next iteration
    }, []);
    res.status(200).json({
      message: "Compatition found",
      date: comp,
      avaible_users: groupedOrders,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const editComp = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "owner") {
            const {
              title,
              desc,
              banner,
              min_length,
              places,
              start_date,
              finish_date,
            } = req.body;
            const id = req.params.id;
            const edited_comp = await Comp.findByIdAndUpdate({
              product_id: id,
              title,
              desc,
              banner,
              min_length,
              places,
              start_date,
              finish_date,
            });
            if (!edited_comp) {
              res.status(404).json({ message: "server error" });
            }
            res
              .status(200)
              .json({ message: "edited", before_editing: edited_comp });
          } else {
            res
              .status(404)
              .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
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
    res.send(err);
  }
};

const deleteComp = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "owner") {
            const id = req.params.id;
            await Comp.findByIdAndDelete(id).then((deleted) =>
              deleted
                ? res.status(200).json({ message: "deleted!" })
                : res.status(404).json({ message: "something went wrong!" })
            );
          } else {
            res
              .status(404)
              .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
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
    res.send(err);
  }
};

const endComp = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "owner") {
            const id = req.params.id;
            const comp = await Comp.findById(id);
            const orders = await Order.find({
              oqim_id: { $ne: null },
              status: "success",
              product_id: comp.product_id,
            }).populate("user_id");
            const groupedOrders = orders.reduce((acc, order) => {
              // Find if the user already exists in the accumulator
              const existingUser = acc.find(
                (item) =>
                  item.user.user_id.toString() === order.user_id._id.toString()
              );

              if (existingUser) {
                // If found, increase the order count
                existingUser.orderCount += 1;
              } else {
                // If not found, create a new entry with the full user object
                acc.push({
                  user: order.user_id, // Store the whole user object
                  orderCount: 1,
                });
              }

              return acc; // Return updated accumulator for next iteration
            }, []);
            const highestOrderUser = groupedOrders.reduce((max, user) => {
              return user.orderCount > max.orderCount ? user : max;
            }, { orderCount: 0 });
            const winner = await User.findById(highestOrderUser.user._id)
            const new_balance = winner.balance + comp.price
            await Comp.findByIdAndDelete(comp._id)
            await User.findByIdAndUpdate(winner.id, {
              balance: new_balance
            }),
            res.status(200).json({
              message: "konkurs ochirildi",
              winner: winner.id,
              winner_balance: new_balance,
            })
          } else {
            res
              .status(404)
              .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
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
    res.send(err);
  }
};

module.exports = {
  createComp,
  getComps,
  getCompById,
  editComp,
  deleteComp,
  endComp,
};
