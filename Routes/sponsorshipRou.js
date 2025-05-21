const express = require("express");
const { createRequest } = require("../Controller/sponsorshipCont");


const router = express.Router();

// Sponsor: Submit request
router.post("/requests",  createRequest);

module.exports = router;