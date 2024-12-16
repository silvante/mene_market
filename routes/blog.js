const express = require("express")
const { getBlogs, getBlogById, createBlog, editBlog, deleteBlog } = require("../controllers/blog.controller")
const router = express.Router()

router.get("/", getBlogs)

router.get("/:id", getBlogById)

router.post("/", createBlog)

router.put("/:id", editBlog)

router.delete("/:id", deleteBlog)

module.exports = router