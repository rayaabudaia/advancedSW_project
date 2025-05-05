const express = require("express");
const { createRequest, reviewRequest } = require("../Controller/sponsorshipCont");


const router = express.Router();

// Sponsor: Submit request
router.post("/requests",  createRequest);

// Admin: Approve/Reject
router.put("/requests/:request_id", reviewRequest);

module.exports = router;