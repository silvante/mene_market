const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const OTP = require("../models/otp.model");

const cyfer = bcryptjs.genSaltSync(8);

// mothod: get
// get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).send("we have no users yet...");
    }
    return res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// mothod: get
// get a user
const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

// mothod: post
// add new user
const addUser = async (req, res) => {
  try {
    const { name, username, email, bio, password, avatar } = req.body;

    const existingEmail = await User.find({ email });
    const existingUsername = await User.find({ username });

    if (existingEmail.length >= 1) {
      res.status(404).send("email is already used");
      return;
    }
    if (existingUsername.length >= 1) {
      res.send("username is already taken");
      return;
    } else {
      const newUser = await new User({
        name,
        username,
        email,
        bio,
        password: bcryptjs.hashSync(password, cyfer),
        avatar,
      });
      newUser.save().then((result) => {
        sendOTPverification(result, res);
      });
      // return res.status(201).send(newUser);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// mothod: put
// edit user by id
const editUser = async (req, res) => {
  const id = res.body.id;
  try {
    const {
      name,
      password,
      verificated,
      username,
      avatar,
      bio,
      email,
      check,
      balance,
    } = req.body;
    const editedUser = await User.findByIdAndUpdate(id, {
      name,
      password: bcryptjs.hashSync(password, cyfer),
      verificated,
      username,
      avatar,
      bio,
      email,
      check,
      balance,
    });
    return res.status(202).send(editedUser);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// mothod: delete
// delete user by id
const deleteUser = async (req, res) => {
  const removingUserId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(removingUserId);
    if (!deletedUser) {
      res.status(404).send("user is not defined...");
    }
    return res.status(203).send(deleteUser);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("ready for OTP verifications");
    console.log(success);
  }
});

// One Time Password

const sendOTPverification = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Emailni tekshirib oling - Dily",
      html: `<p>Sizning kodingiz -- <b>${otp}</b> -- uni saytga kirgizing va emailni verificatsiya qilib oling va uni hech kimga aytmang </p>`,
    };

    const saltRounds = 10;

    const hashedOTP = await bcryptjs.hash(otp, saltRounds);

    const newOTP = await new OTP({
      userid: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await newOTP.save();

    transporter.sendMail(mailOptions);

    res.json({
      status: "KUTILMOQDA",
      message: "Verificatsiya code email ga jonatildi",
      data: {
        userid: _id,
        email,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { userid, otp } = req.body;
    if (!userid || !otp) {
      throw new Error("Bo'sh maydonlarga ruxsat berilmaydi");
    } else {
      const userOTP = await OTP.find({ userid });
      if (userOTP.length <= 0) {
        throw new Error(
          "Hisob qaydlari mavjud emas yoki hisob allaqachon tasdiqlangan"
        );
      } else {
        const { expiresAt } = userOTP[0];
        const hashedOTP = userOTP[0].otp;

        if (expiresAt < Date.now()) {
          await OTP.deleteMany({ userid });
          throw new Error("Kod muddati o'tgan. Iltimos, qayta so'rang");
        } else {
          const validOTP = await bcryptjs.compare(otp, hashedOTP); // `await` qo'shildi

          if (!validOTP) {
            throw new Error("Noto'g'ri kod, pochta qutingizni tekshiring");
          } else {
            await User.updateOne({ _id: userid }, { verificated: true });
            await OTP.deleteMany({ userid });
            res.json({
              status: "TEKSHIRILDI",
              message: "Sizning emailingiz muvaffaqiyatli tekshirildi",
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

const resendOTP = async (req, res) => {
  try {
    let { userid, email } = req.body;

    if (!userid || !email) {
      throw Error("empty fileds are not allowed");
    } else {
      await OTP.deleteMany({ userid });
      sendOTPverification({ _id: userid, email }, res);
    }
  } catch (err) {
    res.json({
      status: "QABUL QILINMADI",
      message: err.message,
    });
  }
};

module.exports = {
  getUser,
  getUsers,
  addUser,
  editUser,
  deleteUser,
  sendOTPverification,
  verifyOTP,
  resendOTP,
};
