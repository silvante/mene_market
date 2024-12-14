const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user.model");
// const Comment = require("../models/comments.model");
const jwtSecret = "mene_market_d34DJ058jsllass345dd";

// login part codes
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use `findOne` to find a single user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.verificated !== true) {
      return res.status(400).send("Your account is not verified");
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {});

    return res.send(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, userDoc) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }

        try {
          const user = await User.findById(userDoc.id);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          const {
            _id,
            email,
            username,
            name,
            bio,
            avatar,
            verificated,
            check,
            balance,
          } = user;
          res.json({
            _id,
            email,
            username,
            name,
            bio,
            avatar,
            verificated,
            check,
            balance,
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Server error" });
        }
      });
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// log out part codes
router.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

module.exports = { router, jwtSecret };