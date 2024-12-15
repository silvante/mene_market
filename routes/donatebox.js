const express = require("express")
const router = express.Router()
const { Activate, Disable, divorceDonate } = require("../controllers/donatebox.controller")

router.post("/acivate", Activate)

router.post("/disable", Disable)

router.put("/divorse", divorceDonate)

module.exports = router