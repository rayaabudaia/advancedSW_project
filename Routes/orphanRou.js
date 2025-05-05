const express = require("express");
const { getAllOrphans, getOrphanById } = require("../Controller/orphanCont.js");

const router = express.Router();

// GET /public/orphans
router.get("/orphans", getAllOrphans);

// GET /public/orphans/:id
router.get("/orphans/:id", getOrphanById);

module.exports = router;
