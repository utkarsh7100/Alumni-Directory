const express = require("express");

const router = express.Router();

const {
  getAlumni,
  addAlumni,
  deleteAlumni
} = require("../controllers/alumniController");

router.get("/", getAlumni);

router.post("/", addAlumni);

router.delete("/:id", deleteAlumni);

module.exports = router;