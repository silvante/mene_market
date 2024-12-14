const express = require("express")
const router = express.Router()
const { getOqims, getOqim, addOqim, deleteOqim } = require("../controllers/oqim.controller")

router.get("/", getOqims)

router.get("/:id", getOqim)

router.post("/", addOqim)

router.delete("/:id", deleteOqim)

module.exports = router