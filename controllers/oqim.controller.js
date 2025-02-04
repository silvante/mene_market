const Oqim = require("../models/oqim.model");
const Product = require("../models/product.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");
const Order = require("../models/order.model");

const getOqims = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const user_id = user_doc.id;

          const oqims = await Oqim.find({ user: user_id }).populate("product").populate("user");
          if (!oqims) {
            return res.status(404).json({message: "server error"});
          }
          res.status(200).send(oqims);
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

const getOqim = async (req, res) => {
  const id = req.params.id;
  try {
    const oqim = await Oqim.findById(id).populate("product").populate("user");
    if (!oqim) {
      return res.status(404).json({message: "steam not found"});
    }
    const related_orders = await Order.find({oqim_id: oqim._id})
    res.status(200).json({
      stream: oqim,
      related_orders: related_orders
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const addOqim = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const product_id = req.params.product_id;
          const product = await Product.findById(product_id);
          const { name } = req.body;
          const new_oqim = await Oqim.create({
            user: user_doc.id,
            product: product_id,
            name: name,
          });
          if (!new_oqim) {
            return res.status(404).send("server error");
          }
          res.status(200).json({
            message: "oqim yaratildi",
            id: new_oqim.id,
            product: product,
            name,
          });
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

const deleteOqim = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const oqim_id = req.params.id;
          const oqim = await Oqim.findById(oqim_id);
          if (oqim.user == user_doc.id || user_doc.status == "admin" || user_doc.status == "owner") {
            await Oqim.findByIdAndDelete(oqim_id);
            res.status(200).json({message: "deleted"});
          } else {
            return res.status(404).json({message: "bad request!"});
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

// generating Order_code

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
    const { client_mobile, client_name, client_address } = req.body;
    const oqim = await Oqim.findById(id).populate("product");

    const total_price = oqim.product.price + oqim.product.for_seller;

    if (!oqim) {
      res.json({message: "oqim topilmadi"});
    } else {
      const new_order = await Order.create({
        client_mobile,
        client_name,
        client_address,
        user_id: oqim.user_id,
        product_id: oqim.product,
        oqim_id: id,
        status: "pending",
        order_code: generateOTP(),
        total_price,
      });
      if (!new_order) {
        return res.status(404).json({message: "server error!"});
      }
      res.status(201).send(new_order);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = {
  getOqim,
  getOqims,
  addOqim,
  deleteOqim,
  createOrder,
};
