const express = require("express");
const {
  getUser,
  getUsers,
  addUser,
  editUser,
  deleteUser,
  verifyOTP,
  resendOTP,
} = require("../controllers/user.controller");
const router = express.Router();

// get all users
router.get("/", getUsers);

// get user by ID
router.get("/:id", getUser);

// create user
router.post("/", addUser);

// edit user by id
router.put("/:id", editUser);

// delete user by id
router.delete("/:id", deleteUser);

router.post("/verifyOTP", verifyOTP);

router.post("/resendOTP", resendOTP);

module.exports = router;