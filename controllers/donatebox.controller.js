const Dbox = require("../models/donatebox.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");

const Activate = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "owner") {
          try {
            const disabled_box = await Dbox.findOne({ is_active: false });
            if (disabled_box) {
              await Dbox.findByIdAndUpdate(disabled_box, {
                is_active: true,
              });
              return res.status(200).json({ message: "Quti aktivlashtirildi" });
            }
            const active_box = await Dbox.findOne({ is_active: true });
            if (active_box) {
              return res.status(404).json({ message: "Quti allaqachon aktiv" });
            }

            if (!disabled_box && !active_box) {
              await Dbox.create({ is_active: true });
              return res
                .status(201)
                .json({ message: "Quti yaratildi va aktivlashtirildi" });
            }
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
    res.send(err);
  }
};

const Disable = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "owner") {
          try {
            const disabled_box = await Dbox.findOne({ is_active: false });
            if (disabled_box) {
              return res
                .status(404)
                .json({ message: "Quti allachaqon muzlagan" });
            }
            const active_box = await Dbox.findOne({ is_active: true });
            if (active_box) {
              await Dbox.findByIdAndUpdate(active_box, {
                is_active: false,
              });
              return res.status(200).json({ message: "Quti muzlatildi" });
            }

            if (!disabled_box && !active_box) {
              await Dbox.create({ is_active: false });
              return res
                .status(201)
                .json({ message: "Quti yaratildi va muzlatildi" });
            }
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
    res.send(err);
  }
};

const divorceDonate = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "owner") {
          try {
            const { fund } = req.body;
            const active_box = await Dbox.findOne({ is_active: true });
            if (active_box.total_fund < fund) {
              return res.status("fondda mablag yetarli emas");
            }
            if (active_box) {
              const new_fund = active_box.total_fund - fund;
              await Dbox.findByIdAndUpdate(active_box, {
                total_fund: new_fund,
              });
              return res
                .status(200)
                .json({
                  message: "Mablag' muaffaqiyat yechildi",
                  total_fund: new_fund,
                });
            } else {
              res.status(404).json({ message: "Quti active emas" });
            }
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
    res.send(err);
  }
};

const getDbox = async (req, res) => {
  try {
    const active_box = await Dbox.findOne({ is_active: true });
    if (!active_box) {
      res.status(404).json({ message: "quti aktiv emas" });
    } else {
      res.status(200).json({
        message: "ehson qutusi",
        box: active_box,
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = { Activate, Disable, divorceDonate, getDbox };
