
const express = require('express');
const router = express.Router();
const emergencyCont= require('../Controller/emergencyCont');

router.post('/campaigns/:campaign_id/contribute', emergencyCont.contribute);


router.get('/campaigns', emergencyCont.getAllCampaigns);
module.exports = router;
