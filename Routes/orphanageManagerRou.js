//new


const express = require('express');
const router = express.Router(); 

const donations = require('../Model/donations');
const verifyToken = require('../Middleware/authMiddle');
const {
  getDonationsForManager,
  addImpactReport,
reviewRequest
} = require('../Controller/orphanageManagerController');

// Routes
router.get('/manager/donations', verifyToken, getDonationsForManager);
router.post('/manager/add-impact-report', verifyToken, addImpactReport);
router.put("/requests/:request_id", verifyToken,reviewRequest);

module.exports = router;
