const User = require("../models/user.model");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const OTP = require("../models/otp.model");
const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../routes/extra");

const cyfer = bcryptjs.genSaltSync(10);

// mothod: get
// get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).send("we have no users yet...");
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
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

// unique username generator

const generateUniqueUsername = async (name) => {
  let baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = baseUsername;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await User.findOne({ username }).select("-password");
    if (!existingUser) {
      isUnique = true;
    } else {
      const randomSuffix = crypto.randomInt(1000, 9999);
      username = `${baseUsername}${randomSuffix}`;
    }
  }
  return username;
};

// mothod: post
// add new user
const addUser = async (req, res) => {
  try {
    const { name, email, bio, password, avatar } = req.body;

    const existingEmail = await User.find({ email });

    const username = await generateUniqueUsername(name);
    if (existingEmail.length >= 1) {
      return res.status(404).json({
        isVerificated: existingEmail.verificated,
        message:
          "ushbu email ga hisob ochilgan, hisobni - Qayta tiklash - tugmasini bosib qayta tiklash mumkin",
      });
    } else {
      const newUser = await new User({
        name,
        email,
        bio,
        password: bcryptjs.hashSync(password, cyfer),
        avatar,
        username,
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
  try {
    const auth_headers = req.headers.authorization;
    if (!auth_headers || !auth_headers.startsWith("Bearer ")) {
      return res.status(404).send("No token provided");
    }

    // Extract token
    const token = auth_headers.split("Bearer ")[1];

    // Verify token
    const user_doc = await jwt.verify(token, jwtSecret);

    // Check if user has permission to edit (either self, admin, or owner)
    const id = req.params.id;
    if (
      id !== user_doc.id &&
      user_doc.status !== "admin" &&
      user_doc.status !== "owner"
    ) {
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this user" });
    }

    // Destructure request body
    const { name, password, verificated, username, avatar, bio, email, check } =
      req.body;

    // Optional: Check if password exists and hash it
    let updatedFields = {
      name,
      verificated,
      username,
      avatar,
      bio,
      email,
      check,
    };

    if (password) {
      // Only hash if password is provided
      updatedFields.password = bcryptjs.hashSync(password, cyfer);
    }

    // Update user
    const editedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    }).select("-password");

    // Check if user was found and updated
    if (!editedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with updated user data
    return res.status(202).json(editedUser);
  } catch (err) {
    console.error(err); // Log error details for debugging
    return res.status(500).json({ message: "Server error" }); // Send generic error message
  }
};

// mothod: delete
// delete user by id
const deleteUser = async (req, res) => {
  const removingUserId = req.params.id;
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin" || user_doc.status == "owner") {
            const the_user = await User.findById(removingUserId);
            // owner can not delete himself
            if (the_user.status == "owner" && user_doc.id == the_user._id) {
              return res
                .status(401)
                .json({ message: "owner can not delete himself" });
            }
            // any other admins can not delete owner
            if (the_user.status == "owner") {
              return res.status(402).json({
                message: "deleting user is owner, owner can not be deleted",
              });
            }
            // admin can not delete himself but owner can
            if (the_user.status == "admin" && the_user._id == user_doc.id) {
              return res
                .status(401)
                .json({ message: "admin can not delete himself" });
            }
            const deletedUser = await User.findByIdAndDelete(the_user._id);
            if (!deletedUser) {
              return res.status(404).send("user is not defined...");
            }
            return res.status(203).send("deleted successfully");
          } else {
            return res
              .status(404)
              .json({ message: "you made a mistake here sir" });
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

// transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  sourse: false,
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
      subject: "Emailni tekshirib oling - Mene market",
      html: `<p>Sizning kodingiz -- <b>${otp}</b> -- uni saytga kirgizing va emailni verificatsiya qilib oling va uni hech kimga aytmang </p>`,
    };

    const saltRounds = 10;

    const hashedOTP = await bcryptjs.hash(otp, saltRounds);

    const newOTP = await new OTP({
      userid: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAT: Date.now() + 3600000,
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
        const { expiresAT } = userOTP[0];
        const hashedOTP = userOTP[0].otp;

        if (expiresAT < Date.now()) {
          await OTP.deleteMany({ userid });
          throw new Error("Kod muddati o'tgan. Iltimos, qayta so'rang");
        } else {
          const validOTP = await bcryptjs.compare(otp, hashedOTP); // `await` qo'shildi

          if (!validOTP) {
            throw new Error("Noto'g'ri kod, pochta qutingizni tekshiring");
          } else {
            const user = await User.findByIdAndUpdate(
              { _id: userid },
              { verificated: true }
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
              status: "TEKSHIRILDI",
              message: "Sizning emailingiz muvaffaqiyatli tekshirildi",
              token: token,
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

const createWorkerAccount = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "owner") {
            const { name, password, avatar, bio, email, check, status } =
              req.body;
            const username = await generateUniqueUsername(name);
            const new_worker = await User.create({
              name,
              password: bcryptjs.hashSync(password, cyfer),
              username,
              avatar,
              bio,
              email,
              check,
              verificated: true,
              status,
            });
            return res.status(202).send(new_worker);
          } else {
            return res
              .status(404)
              .json({ message: "you made a mistake here sir" });
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

const getAllWorkers = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin" || user_doc.status === "owner") {
            const workers = await User.find({
              status: { $in: ["admin", "operator", "courier"] },
            });
            if (!workers) {
              return res.status(404).json({ message: "server error" });
            }
            return res.status(200).send(workers);
          } else {
            return res
              .status(404)
              .json({ message: "you made a mistake here sir" });
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

const getAllAdmins = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin" || user_doc.status === "owner") {
            const admins = await User.find({
              status: "admin",
            });
            if (!admins) {
              return res.status(404).json({ message: "server error" });
            }
            return res.status(200).send(admins);
          } else {
            return res
              .status(404)
              .json({ message: "you made a mistake here sir" });
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

const getAllOperators = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin" || user_doc.status === "owner") {
            const operators = await User.find({
              status: "operator",
            });
            if (!operators) {
              return res.status(404).json({ message: "server error" });
            }
            return res.status(200).send(operators);
          } else {
            return res
              .status(404)
              .json({ message: "you made a mistake here sir" });
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

const getAllCourier = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin" || user_doc.status === "owner") {
            const courier = await User.find({
              status: "courier",
            });
            if (!courier) {
              return res.status(404).json({ message: "server error" });
            }
            return res.status(200).send(courier);
          } else {
            return res
              .status(404)
              .json({ message: "you made a mistake here sir" });
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

module.exports = {
  getUser,
  getUsers,
  addUser,
  editUser,
  deleteUser,
  sendOTPverification,
  verifyOTP,
  resendOTP,
  createWorkerAccount,
  getAllWorkers,
  getAllAdmins,
  getAllCourier,
  getAllOperators,
};
