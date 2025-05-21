
const express = require('express');
const router = express.Router();
const { update_Location } = require("../Controller/deliveriesCont");

router.post('/update-location', update_Location);

module.exports = router;

