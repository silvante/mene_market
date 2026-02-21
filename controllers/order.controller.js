const read_address = require("../messenger/address_reader");
const SendMessage = require("../messenger/send_message");
const SendOrderMessage = require("../messenger/send_order_message");
const readable_time = require("../messenger/time_reader");
// const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Stock = require("../models/stock.model");
const User = require("../models/user.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");

// Helper token
function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
}

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit between 0 and 9
  }
  return otp;
}

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate("user_id", "-password")
      .populate("product_id")
      .populate("oqim_id")
      .populate("type");
    if (!order) {
      return res.status(404).json({ message: "order does not exsist" });
    }
    return res.status(200).send(order);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const createOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("products is not defined");
    } else {
      total_price = product.price + product.for_seller;
    }
    await Product.findByIdAndUpdate(product._id, {
      sold: product.sold + 1,
    });
    const { client_name, client_mobile, client_address, type_id } = req.body;
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
      total_price,
      product_id: product._id,
      client_name,
      client_mobile,
      client_address,
      order_code: generateOTP(),
      status: "pending",
      type: type_id,
    });
    if (!new_order) {
      return res.status(404).send("try again!");
    }
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
    res.status(200).send(new_order);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const checkOrder = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "operator" || user_doc.status == "owner") {
          try {
            const id = req.params.id;
            const order = await Order.findById(id);
            if (
              order.status !== "checking" ||
              order.operator_id === user_doc.id
            ) {
              return res.status(404).json({
                message:
                  "order hali roihatdan orkazilmagan yoki ushbu order sizga tesgishli emas",
              });
            }

            const { full_address } = req.body;
            const updated = await Order.findByIdAndUpdate(id, {
              status: "recall",
              full_address,
            })
              .populate("product_id")
              .populate("oqim_id")
              .populate("type");
            if (!updated) {
              return res.status(404).send("something went wrong, try again");
            }
            if (updated.user_id) {
              const user = await User.findById(updated.user_id);
              if (user.telegram_id) {
                const data = {
                  title: "Buyurtma tekshiruvi haqida xabar ✍️",
                  message: `Sizning ${updated.oqim_id.name} oqimingiz orqali ${updated.client_name} ismli shaxs tomonidan berilgan buyurtma operator tomonidan tekshirildi va tasdiqlandi. ✅`,
                  order_code: updated.order_code,
                };
                await SendMessage(user.telegram_id, data);
              }
            }
            res.status(200).json({ message: "status changed to checked" });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun operator bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const RecallOrder = async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({
        message: "Token topilmadi. Iltimos, qayta login qiling.",
      });
    }

    let userDoc;
    try {
      userDoc = jwt.verify(token, jwtSecret);
    } catch (e) {
      return res.status(401).json({
        message: "Token yaroqsiz yoki muddati tugagan.",
      });
    }

    const role = userDoc?.status;
    const isAllowed = role === "operator" || role === "owner";
    if (!isAllowed) {
      return res.status(403).json({
        message: "Ruxsat yo‘q. Bu amal faqat operator yoki ega uchun.",
      });
    }

    const { id } = req.params;
    const { desc } = req.body;

    if (!desc) {
      return res.status(404).json({
        message: "Ba'tafsil ma'lumotni toldirish shart",
      });
    };

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Buyurtma topilmadi.",
      });
    }

    const isChecking = order.status === "checking";
    const isMine = String(order.operator_id) === String(userDoc.id);

    if (!isChecking) {
      return res.status(409).json({
        message:
          "Bu buyurtma 'checking' holatida emas. Qayta bog‘lanishga o‘tkazib bo‘lmaydi.",
      });
    }

    if (!isMine && role !== "owner") {
      return res.status(403).json({
        message:
          "Bu buyurtma sizga biriktirilmagan. Faqat owner o‘zgartira oladi.",
      });
    };

    const updated = await Order.findByIdAndUpdate(id, {
      status: "recall"
    }).populate("product_id").populate("oqim_id").populate("type");

    if (!updated) {
      return res.status(500).json({
        message:
          "Buyurtmani yangilashda xatolik. Iltimos, qayta urinib ko‘ring.",
      });
    }

    return res.status(200).json({
      message: "Buyurtma holati 'Qayta bog‘lanish'ga o‘zgartirildi.",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Serverda xatolik yuz berdi.",
    });
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

        if (user_doc.status == "admin" || user_doc.status == "owner") {
          try {
            const id = req.params.id;
            const { courier_id } = req.body;
            if (!courier_id) {
              return res.send("courier_id kirilitilishi shart");
            }
            const updated = await Order.findByIdAndUpdate(id, {
              status: "sent",
              courier_id,
            });
            if (!updated) {
              return res.status(404).send("something went wrong, try again");
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
      return res.status(404).send("no token provided");
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

        if (
          user_doc.status == "admin" ||
          user_doc.status == "owner" ||
          user_doc.status == "operator" ||
          user_doc.status == "courier"
        ) {
          try {
            const id = req.params.id;

            const updated = await Order.findByIdAndUpdate(
              id,
              {
                status: "canceled",
              },
              { new: true },
            )
              .populate("product_id")
              .populate("oqim_id")
              .populate("type");

            if (!updated) {
              return res.status(500).json({
                message:
                  "Buyurtmani yangilashda xatolik. Iltimos, qayta urinib ko‘ring.",
              });
            }

            if (updated.type) {
              await Stock.findByIdAndUpdate(updated.type._id, {
                quantity: updated.type.quantity + 1,
              });
            }
            // if (updated.user_id) {
            //   const user = await User.findById(updated.user_id);
            //   // const new_balance = user.balance - updated.product_id.for_seller;
            //   // await User.findByIdAndUpdate(updated.user_id, {
            //   // balance: new_balance,
            //   // });
            //   if (user.telegram_id) {
            //     const data = {
            //       title: "Buyurtma holati haqida xabar ✍️",
            //       message: `Sizning *${updated.oqim_id.name}* nomli oqimingiz orqali *${updated.client_name}* ismli shaxs tomonidan qabul qilingan buyurtma bekor qilindi. ❌`,
            //       desc: desc,
            //       order_code: updated.order_code,
            //     };
            //     await SendMessage(user.telegram_id, data);
            //   }
            // }
            res.status(200).json({
              message: "status changed to canceled",
            });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res.status(404).send("sizning statusingiz ushbu metod uchun nomalum");
        }
      });
    } else {
      return res.status(404).send("no token provided");
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

        if (user_doc.status == "courier" || user_doc.status == "owner") {
          try {
            const id = req.params.id;
            const updated = await Order.findByIdAndUpdate(
              id,
              {
                status: "success",
              },
              { new: true },
            )
              .populate("product_id")
              .populate("oqim_id");
            if (!updated) {
              return res.status(404).send("something went wrong, try again");
            }
            if (updated.user_id) {
              const user = await User.findById(updated.user_id);
              const new_balance = user.balance + updated.product_id.for_seller;
              await User.findByIdAndUpdate(updated.user_id, {
                balance: new_balance,
              });
              if (user.telegram_id) {
                const data = {
                  title: "Buyurtma holati haqida xabar ✍️",
                  message: `Sizning *${updated.oqim_id.name}* nomli oqimingiz orqali *${updated.client_name}* ismli shaxs tomonidan qabul qilingan buyurtma muvaffaqiyatli yetkazildi. ✅`,
                  warning: `Shuningdek sizning hisobingizga *${updated.product_id.for_seller}* so'm otkazildi!`,
                  order_code: updated.order_code,
                  balance: new_balance,
                };
                await SendMessage(user.telegram_id, data);
              }
            }
            res.status(200).json({
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
            .send("bu metoddan foidalanish uchun courier bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const getOrders = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "operator") {
          try {
            const orders = await Order.find({ status: "pending" })
              .populate("product_id")
              .populate("type");
            if (!orders) {
              return res.status(404).send("server error");
            }
            res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else if (user_doc.status == "admin") {
          try {
            const orders = await Order.find({ status: "checked" })
              .populate("product_id")
              .populate("type");
            if (!orders) {
              return res.status(404).send("server error");
            }
            res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else if (user_doc.status == "courier") {
          try {
            const orders = await Order.find({
              status: "sent",
              courier_id: user_doc.id,
            })
              .populate("product_id")
              .populate("type");
            if (!orders) {
              return res.status(404).send("server error");
            }
            res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else if (user_doc.status == "owner") {
          try {
            const orders = await Order.find()
              .populate("product_id")
              .populate("type");
            if (!orders) {
              return res.status(404).send("server error");
            }
            res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res.status(404).send("sizning statusingiz ushbu metod uchun nomalum");
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

// new gen

const returnOrder = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "courier" || user_doc.status == "owner") {
          try {
            const id = req.params.id;
            const { desc } = req.body;
            if (!desc) return res.status(404).send("desc is required");
            const updated = await Order.findByIdAndUpdate(
              id,
              {
                status: "returned",
                desc,
              },
              { new: true },
            )
              .populate("product_id")
              .populate("oqim_id")
              .populate("type");
            if (!updated) {
              return res.status(404).send("something went wrong, try again");
            }
            if (updated.type) {
              await Stock.findByIdAndUpdate(updated.type._id, {
                quantity: updated.type.quantity + 1,
              });
            }
            if (updated.user_id) {
              const user = await User.findById(updated.user_id);
              // const new_balance = user.balance - updated.product_id.for_seller;
              // await User.findByIdAndUpdate(updated.user_id, {
              //   balance: new_balance,
              // });
              if (user.telegram_id) {
                const data = {
                  title: "Buyurtma holati haqida xabar ✍️",
                  message: `Sizning *${updated.oqim_id.name}* nomli oqimingiz orqali *${updated.client_name}* ismli shaxs tomonidan qabul qilingan buyurtma qaytarildi. ❌`,
                  // warning: `Shuningdek jarima sifatida sizning hisobingizdan *${updated.product_id.for_seller}* so'm yechib olindi!`,
                  desc: desc,
                  order_code: updated.order_code,
                  // balance: new_balance,
                };
                await SendMessage(user.telegram_id, data);
              }
            }
            res.status(200).json({
              message:
                "status changed to returned # and user's balance is changed",
            });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun courier bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const signOrderToOperator = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (!auth_headers || !auth_headers.startsWith("Bearer ")) {
      return res.status(401).send("No token provided");
    }

    const token = auth_headers.split("Bearer ")[1];

    jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      if (user_doc.status !== "operator") {
        return res
          .status(403)
          .send("Bu metoddan foydalanish uchun operator bo'lishingiz kerak");
      }

      try {
        const { address } = req.body;

        const available_orders = await Order.find({
          status: "pending",
          client_address: address,
        }).limit(10);

        if (!available_orders.length) {
          return res
            .status(404)
            .json({ message: "Hech qanday mavjud buyurtma topilmadi" });
        }

        const random_order =
          available_orders[Math.floor(Math.random() * available_orders.length)];

        const signed_order = await Order.findByIdAndUpdate(
          random_order._id,
          {
            status: "checking",
            operator_id: user_doc.id,
          },
          { new: true },
        )
          .populate("product_id")
          .populate("oqim_id")
          .populate("user_id", "-password -balance")
          .populate("type");

        if (!signed_order) {
          return res.status(500).json({
            message: "Serverda xatolik yuz berdi yoki order topilmadi",
          });
        }

        return res.status(200).json({
          message: "signed",
          signed_order,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const getOrdersOfOperator = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "operator") {
          try {
            const orders = await Order.find({
              operator_id: user_doc.id,
              status: "checking",
            })
              .populate("product_id")
              .populate("oqim_id")
              .populate("user_id", "-password -balance")
              .populate("type");

            if (!orders) {
              return res
                .status(404)
                .json({ message: "orders are not avaible" });
            }

            return res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun operator bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const getRecallOrdersOfOperator = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "operator") {
          try {
            const orders = await Order.find({
              operator_id: user_doc.id,
              status: "recall",
            })
              .populate("product_id")
              .populate("oqim_id")
              .populate("user_id", "-password -balance")
              .populate("type");

            if (!orders) {
              return res.status(404).json({ message: "Zakazlar mavjud emas!" });
            }

            return res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun operator bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const getAllOrdersOfOperator = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "operator") {
          try {
            const orders = await Order.find({
              operator_id: user_doc.id,
            })
              .populate("product_id")
              .populate("oqim_id")
              .populate("user_id", "-password -balance")
              .populate("type");

            if (!orders) {
              return res
                .status(404)
                .json({ message: "orders are not avaible" });
            }

            return res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun operator bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const getAllOrdersOfSeller = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "seller") {
          try {
            const orders = await Order.find({ user_id: user_doc.id })
              .populate("product_id")
              .populate("oqim_id")
              .populate("user_id", "-password")
              .populate("type");

            if (!orders) {
              return res
                .status(404)
                .json({ message: "orders are not avaible" });
            }

            return res.status(200).send(orders);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun seller bolishingiz kerak");
        }
      });
    } else {
      return res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.status(err);
  }
};

const SearchOrders = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        let { q } = req.query;
        let SearchOptions = {};

        if (user_doc.status == "operator") {
          SearchOptions.order_code = {
            $regex: q,
            $options: "i",
          };
          SearchOptions.client_mobile = {
            $regex: q,
            $options: "i",
          };
          SearchOptions.status = "checking";
          SearchOptions.operator_id = user_doc.id;
        } else if (user_doc.status == "courier_id") {
          SearchOptions.order_code = {
            $regex: q,
            $options: "i",
          };
          SearchOptions.client_mobile = {
            $regex: q,
            $options: "i",
          };
          SearchOptions.status = "sent";
          SearchOptions.courier_id = user_doc.id;
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun operator yoki kuryer bo'lishingiz kerak");
        }
        try {
          const orders = await Order.find(SearchOptions)
            .populate("product_id")
            .populate("oqim_id")
            .populate("user_id", "-password")
            .populate("type");

          if (!orders) {
            return res.status(404).json({ message: "orders are not avaible" });
          }

          return res.status(200).send(orders);
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
    res.status(err);
  }
};

module.exports = {
  getOrderById,
  createOrder,
  sendOrder,
  cancelOrder,
  successOrder,
  checkOrder,
  getOrders,
  returnOrder,
  signOrderToOperator,
  getOrdersOfOperator,
  getAllOrdersOfOperator,
  getAllOrdersOfSeller,
  RecallOrder,
  getRecallOrdersOfOperator,
  SearchOrders,
};
