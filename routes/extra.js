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

    const token = jwt.sign({ id: user._id, email: user.email, status: user.status }, jwtSecret, {});

    return res.status(200).json({success: true, token: token});
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
            status,
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
            status,
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

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication, login, logout, and profile-related routes.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login to the application with email and password. Returns a JWT token if credentials are correct.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials or account not verified
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Get the profile details of the authenticated user. Requires a valid JWT token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User's unique ID
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                 username:
 *                   type: string
 *                   description: User's username
 *                 name:
 *                   type: string
 *                   description: User's full name
 *                 bio:
 *                   type: string
 *                   description: User's bio
 *                 avatar:
 *                   type: string
 *                   description: URL to user's avatar
 *                 verificated:
 *                   type: boolean
 *                   description: Account verification status
 *                 check:
 *                   type: boolean
 *                   description: Additional check status
 *                 balance:
 *                   type: number
 *                   description: User's current balance
 *       401:
 *         description: Invalid token or not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out the user
 *     description: Logs out the user by clearing the JWT token from the cookie.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
