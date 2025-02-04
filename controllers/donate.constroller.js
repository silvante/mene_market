const Donate = require("../models/donate.model");
const Dbox = require("../models/donatebox.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");

const commitDonate = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const boxes = await Dbox.find();
          const box = boxes[0]
          if (boxes.length < 1) {
            return res.status(400).json({
              message: "there in no donate box active"
            })
          }
          const { fund, anonim } = req.body;
          const donate = await Donate.findOne({ user_id: user_doc.id });
          if (donate) {
            const user = await User.findById(user_doc.id);
            const new_balance = user.balance - fund;
            if (user.balance < fund) {
              return res.status(404).send("sizda yetarlicha pul yoq");
            }
            await User.findByIdAndUpdate(user.id, {
              balance: new_balance,
            });
            const new_donate_fund = donate.fund + fund;
            const new_donate = await Donate.findByIdAndUpdate(donate._id, {
              fund: new_donate_fund,
              anonim,
            });
            const new_fund = box.total_fund + fund;
            const dbox = await Dbox.findByIdAndUpdate(box._id, {
              total_fund: new_fund,
            });

            res.status(200).json({
              your_donate: new_donate,
              dbox: dbox.total_fund,
              your_balance: new_balance,
            });
          } else {
            const user = await User.findById(user_doc.id);
            const new_balance = user.balance - fund;
            if (user.balance < fund) {
              return res.status(404).send("sizda yetarlicha pul yoq");
            }
            await User.findByIdAndUpdate(user.id, {
              balance: new_balance,
            });
            const new_donate = await Donate.create({
              anonim,
              fund,
              user_id: user_doc.id,
              box_id: box._id,
            });
            const new_fund = box.total_fund + fund;
            const dbox = await Dbox.findByIdAndUpdate(box._id, {
              total_fund: new_fund,
            });
            res.status(200).json({
              your_donate: new_donate,
              dbox: dbox.total_fund,
              your_balance: new_balance,
            });
          }
          res.status(200).send(new_donate);
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

const getDonate = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const donate = Donate.findOne({ user_id: user_doc.id });
          if (!donate) {
            res.status(404).json({ message: "sida ehsonlar yoq" });
          }
          res.status(200).send(donate);
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

const getAllDonates = async (req, res) => {
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
            const donates = Donate.findOne();
            if (donates.length < 1) {
              res.status(404).json({ message: "Hozircha ehsonlar yoq" });
            }
            res.status(200).send(donates);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res.status(400).json({message: "You should be admin to use this endpoint"})
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

module.exports = { commitDonate, getDonate, getAllDonates };
