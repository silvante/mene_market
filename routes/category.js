const express = require("express")
const router = express.Router()
const { getCategorys, getCategory, addCategory, editCategory, deleteCategory } = require("../controllers/category.controller")

router.get("/", getCategorys)

router.get("/:id", getCategory)

router.post("/", addCategory)

router.put("/:id", editCategory)

router.delete("/:id", deleteCategory)

module.exports = router