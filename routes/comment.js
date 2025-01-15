const express = require("express");
const router = express.Router();
const {
  getComment,
  getComments,
  sendComment,
  editComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.get("/", getComments);
router.get("/:id", getComment);
router.post("/", sendComment);
router.put("/:id", editComment);
router.delete("/:id", deleteComment);

module.exports = router;