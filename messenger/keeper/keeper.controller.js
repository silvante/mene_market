const TokenKeeper = require("./keeper.model");
const { jwtSecret } = require("../../routes/extra");
const jwt = require("jsonwebtoken");

const createKeeper = async (req, res) => {
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
            const keeper = await TokenKeeper.findOne();
            const { bot_token } = req.body;

            if (!bot_token) {
              return res.status(404).send("bot_token is required");
            }

            if (!keeper) {
              const new_keeper = await TokenKeeper.create({
                bot_token,
              });
              if (!new_keeper) return res.status(404).send("server error");
              return res
                .status(200)
                .json({ message: "activated", keeper: new_keeper });
            }

            if (keeper) {
              const updated_keeper = await TokenKeeper.findByIdAndUpdate(
                keeper._id,
                {
                  bot_token,
                }
              );
              if (!updated_keeper) return res.status(404).send("server error");
              return res.status(200).send({
                message: "activated & updated",
                keeper: updated_keeper,
              });
            }
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun owner bolishingiz kerak");
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

const getKeeper = async (req, res) => {
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
            const keeper = await TokenKeeper.findOne();
            if (!keeper) {
              return res
                .status(404)
                .json({ message: "Keeper hali active emas" });
            }
            return res.status(404).send(keeper);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun owner bolishingiz kerak");
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

module.exports = { createKeeper, getKeeper };
