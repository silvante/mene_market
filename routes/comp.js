const express = require("express");
const {
  createComp,
  getComps,
  getCompById,
  editComp,
  deleteComp,
} = require("../controllers/comp.controller");
const router = express.Router();

router.post(":id", createComp);

router.get("/", getComps);

router.get("/:id", getCompById);

router.put("/:id", editComp);

router.delete("/:id", deleteComp);

module.exports = router;
