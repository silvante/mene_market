const User = require("../models/user.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");

const linkUserToTelegram = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const user = await User.findById(user_doc.id);
          const { chat_id } = req.body;
          if (!chat_id) {
            return res.status(404).send("chat_id is required");
          }
          const linked_user = await User.findByIdAndUpdate(
            user._id,
            {
              telegram_id: chat_id,
            },
            { new: true }
          );
          if (!linked_user) {
            return res.status(404).send("user is not defined or server error");
          }
          return res.status(200).json({
            message: "linked",
            user: linked_user,
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

module.exports = { linkUserToTelegram };
