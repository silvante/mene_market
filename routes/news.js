const express = require("express");
const {
  getNews,
  getNewsById,
  createNews,
  editNews,
  deleteNews,
} = require("../controllers/news.controller");
const router = express.Router();

router.get("", getNews);

router.get("/:id", getNewsById);

router.post("/", createNews);

router.put("/:id", editNews);

router.delete("/:id", deleteNews);

module.exports = router;
