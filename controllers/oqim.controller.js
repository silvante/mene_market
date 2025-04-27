const Oqim = require("../models/oqim.model");
const Product = require("../models/product.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");
const Order = require("../models/order.model");
const SendMessage = require("../messenger/send_message");
const read_address = require("../messenger/address_reader");
const readable_time = require("../messenger/time_reader");
const SendOrderMessage = require("../messenger/send_order_message");
const Stock = require("../models/stock.model");

const getAllstreams = async (req, res) => {
  try {
    const all_streams = await Oqim.find()
      .populate("product")
      .populate("user", "-password")
      .populate({
        path: "product",
        populate: { path: "types", model: "stock" },
      });
    if (!all_streams) {
      return res.status(404).json({ message: "server error" });
    }
    return res.status(200).send(all_streams);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

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

          const oqims = await Oqim.find({ user: user_id })
            .populate("product")
            .populate("user", "-password")
            .populate({
              path: "product",
              populate: { path: "types", model: "stock" },
            });
          if (!oqims) {
            return res.status(404).json({ message: "server error" });
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
    const oqim = await Oqim.findById(id)
      .populate("product")
      .populate("user", "-password -balance")
      .populate({
        path: "product",
        populate: { path: "types", model: "stock" },
      });
    if (!oqim) {
      return res.status(404).json({ message: "steam not found" });
    }
    const related_products = await Product.find({
      $or: [
        { tags: oqim.product.type }, // Products where category title is in tags array
        { type: oqim.product.type }, // Products where type matches category title
      ],
    });
    res.status(200).json({
      stream: oqim,
      related_products: related_products,
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
          if (user_doc.t_id) {
            const data = {
              title: "Yangi Oqim 🆕",
              message: `Assalomu alaykum *${user_doc.name}*, siz mene market saytidan *${product.title}* nomli mahsulotga yangi oqim yaratdingiz oqimni Boshqalar bilan ulashish uchun Shaxsiy telegram Grippalar va Auditoriyangizdan foidalanishingiz mumkin. ✅`,
            };
            await SendMessage(user_doc.t_id, data);
          }
          res.status(200).json({
            message: "oqim yaratildi",
            id: new_oqim.id,
            oqim: new_oqim,
            product: product,
            name: name,
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
          if (
            oqim.user == user_doc.id ||
            user_doc.status == "admin" ||
            user_doc.status == "owner"
          ) {
            await Oqim.findByIdAndDelete(oqim_id);
            res.status(200).json({ message: "deleted" });
          } else {
            return res.status(404).json({ message: "bad request!" });
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
    const { client_mobile, client_name, client_address, type_id } = req.body;
    const oqim = await Oqim.findById(id)
      .populate("product")
      .populate("user", "-password");

    const total_price = oqim.product.price + oqim.product.for_seller;

    if (!oqim) {
      res.json({ message: "oqim topilmadi" });
    } else {
      await Product.findByIdAndUpdate(oqim.product._id, {
        sold: oqim.product.sold + 1,
      });
      const stock = await Stock.findById(type_id);
      if (stock) {
        if (stock.quantity <= 0) {
          return res.status(404).json({
            message: `Mahsulot "${stock.title}" turida qolmagan!`,
          });
        }
        await Stock.findByIdAndUpdate(stock._id, {
          quantity: stock.quantity - 1,
        });
      }
      const new_order = await Order.create({
        client_mobile,
        client_name,
        client_address,
        user_id: oqim.user._id,
        product_id: oqim.product._id,
        oqim_id: id,
        status: "pending",
        order_code: generateOTP(),
        total_price,
        type: type_id,
      });
      if (!new_order) {
        return res.status(404).json({ message: "server error!" });
      }
      // if (oqim.user.telegram_id) {
      //   const data = {
      //     title: "Yangi buyurtma 🆕",
      //     message: `Sizning *${oqim.name}* nomli oqimingiz orqali *${client_name}* ismli shaxs tomonidan buyurtma qabul qilindi. ✅`,
      //     order_code: new_order.order_code,
      //   };
      //   await SendMessage(oqim.user.telegram_id, data);
      // }
      data = {
        title: "📦 Yangi buyurtma",
        name: client_name,
        address: read_address(client_address),
        phone_number: client_mobile,
        order_id: new_order._id,
        order_code: new_order.order_code,
        time: readable_time(new_order.created_at),
      };
      await SendOrderMessage(data);
      res.status(201).send(new_order);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getRelatedOrders = async (req, res) => {
  try {
    const id = req.params.id;
    const related_orders = await Order.find({ oqim_id: id })
      .populate("product_id")
      .populate("oqim_id")
      .populate("user_id", "-password -balance");
    if (!related_products) {
      return res.status(404).send("server error");
    }
    res.status(200).send(related_orders);
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
  getAllstreams,
  getRelatedOrders,
};
