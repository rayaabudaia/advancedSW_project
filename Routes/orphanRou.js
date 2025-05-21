const express = require("express");
const { getAllOrphans, getOrphanById,getOrphansByOrphanage } = require("../Controller/orphanCont.js");

const router = express.Router();

// GET /public/orphans
router.get("/orphans", getAllOrphans);

// GET /public/orphans/:id
router.get("/orphans/:id", getOrphanById);

router.get('/orphanage/:orphanage_id', getOrphansByOrphanage);

module.exports = router;
