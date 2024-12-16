const Comp = require("../models/comp.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");
const Order = require("../models/order.model");

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
          if (user_doc.status == "admin") {
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
            const new_comp = await Comp.create({
              product_id: id,
              title,
              desc,
              banner,
              min_length,
              places,
              start_date,
              finish_date,
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
    const orders = Order.find({
      oqim_id: { $ne: null },
      status: "success",
      product_id: comp.product_id,
    }).populate("user_id");
    res.status(200).json({
      message: "Compatition found",
      date: comp,
      avaible_orders: orders,
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
          if (user_doc.status == "admin") {
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
          if (user_doc.status == "admin") {
            const id = req.params.id;
            await Product.findByIdAndDelete(id).then((deleted) =>
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

module.exports = { createComp, getComps, getCompById, editComp, deleteComp };
