const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");
const bcryptjs = require("bcryptjs");

const cyfer = bcryptjs.genSaltSync(10);

const resetPassword = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const { old_password, new_password, confirm_new_password } = req.body;
          const the_user = await User.findById(user_doc.id);
          if (!the_user) {
            return res.status(404).json({ message: "user not fount" });
          }
          const isMatch = await bcryptjs.compare(
            old_password,
            the_user.password
          );
          if (!isMatch) {
            return res
              .status(400)
              .json({ message: "old password does not match" });
          }

          if (new_password !== confirm_new_password) {
            return res
              .status(400)
              .json({ message: "password confirm does not match" });
          }
          const updated_user = await User.findByIdAndUpdate(
            the_user._id,
            {
              password: bcryptjs.hashSync(password, cyfer),
            },
            { new: true }
          );
          if (!updated_user) {
            return res
              .status(404)
              .json({ message: "could not change password" });
          }
          return res.status(200).json({
            message: "password successfully updated",
            updated_user: updated_user,
          });
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).json({ message: "no token provided" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const resetEmail = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          const { old_password, new_email } = req.body;
          const the_user = await User.findById(user_doc.id);
          if (!the_user) {
            return res.status(404).json({ message: "user not fount" });
          }
          const isMatch = await bcryptjs.compare(
            old_password,
            the_user.password
          );
          if (!isMatch) {
            return res
              .status(400)
              .json({ message: "old password does not match" });
          }
          const checkEmail = await User.findOne({ email: new_email });
          if (checkEmail) {
            return res
              .status(400)
              .json({ message: "email has been used by other user" });
          }
          const updated_user = await User.findByIdAndUpdate(
            the_user._id,
            {
              email: new_email,
            },
            { new: true }
          );
          if (!updated_user) {
            return res
              .status(404)
              .json({ message: "could not change password" });
          }
          return res.status(200).json({
            message: "email successfully updated",
            updated_user: updated_user,
          });
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.status(404).json({ message: "no token provided" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = { resetPassword, resetEmail };
