const express = require("express");
const {
  createOrphan,
  updateOrphan,
  deleteOrphan,
  updateOrphanProfile, 
} = require("../Controller/adminCont");

const router = express.Router();

router.post("/orphans", createOrphan);
router.put("/orphans/:id", updateOrphan);
router.delete("/orphans/:id", deleteOrphan);

router.put("/orphans/:id/profile", updateOrphanProfile);

module.exports = router;
