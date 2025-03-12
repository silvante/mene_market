const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");
const bcryptjs = require("bcryptjs");
const { sendOTPverification } = require("../controllers/user.controller");
const clean_the_ocean = require("../middleware/ocean_cleaner");

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
              password: bcryptjs.hashSync(new_password, cyfer),
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const the_user = await User.findOne({ email: email });
    if (the_user) {
      return res.status(404).json({ message: "user not fount" });
    }
    await sendOTPverification(the_user, res);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const updatedPasswordWithOTP = async (req, res) => {
  try {
    let { userid, otp, new_password, confirm_new_password } = req.body;
    if (!userid || !otp || !new_password || !confirm_new_password) {
      return res
        .status(404)
        .json({ message: "Bo'sh maydonlarga ruxsat berilmaydi" });
    } else {
      const userOTP = await OTP.find({ userid });
      if (userOTP.length <= 0) {
        return res.status(404).json({
          message:
            "Hisob qaydlari mavjud emas yoki hisob allaqachon tasdiqlangan",
        });
      } else {
        const { expiresAT } = userOTP[0];
        const hashedOTP = userOTP[0].otp;

        if (expiresAT < Date.now()) {
          await OTP.deleteMany({ userid });
          return res.status(404).json({
            message: "Kod muddati o'tgan. Iltimos, qayta so'rang",
          });
        } else {
          const validOTP = await bcryptjs.compare(otp, hashedOTP); // `await` qo'shildi

          if (!validOTP) {
            return res.status(404).json({
              message: "Noto'g'ri kod, pochta qutingizni tekshiring",
            });
          } else {
            if (new_password !== confirm_new_password) {
              return res
                .status(400)
                .json({ message: "1 va 2-parol birhil bolishi shart" });
            }
            const hashedPassword = bcryptjs.hashSync(new_password, cyfer);

            const user = await User.updateOne(
              { _id: userid },
              { password: hashedPassword, verificated: true },
              { new: true }
            );
            await OTP.deleteMany({ userid });
            const token = jwt.sign(
              {
                id: user._id,
                email: user.email,
                status: user.status,
                telegram_id: user.telegram_id,
                name: user.name,
              },
              jwtSecret,
              {}
            );
            res.json({
              status: "YANGILANDI",
              message:
                "Sizning paro'lingiz muvaffaqiyatli o'zgartirildi va email tekshirildi",
              token: token,
              updated_user: user,
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "QABUL QILINMADI",
      message: error.message,
    });
  }
};

const authCleaner = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status === "admin" || user_doc.status === "owner") {
          try {
            await User.deleteMany({ verificated: false });
            const currentTime = new Date();
            await OTP.deleteMany({ expiresAT: { $gt: currentTime } });
            return res.status(200).json({ message: "cleaned" });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send(
              "bu metoddan foidalanish uchun admin yoki owner bolishingiz kerak"
            );
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

const oceanCleaner = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status === "admin" || user_doc.status === "owner") {
          try {
            await clean_the_ocean();
            res
              .status(200)
              .josn({ message: "keraksiz rasmlar ochirib yuborildi!" });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send(
              "bu metoddan foidalanish uchun admin yoki owner bolishingiz kerak"
            );
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

module.exports = {
  resetPassword,
  resetEmail,
  forgotPassword,
  updatedPasswordWithOTP,
  authCleaner,
  oceanCleaner,
};
