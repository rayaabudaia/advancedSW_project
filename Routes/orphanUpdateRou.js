const express = require('express');

const { createUpdate } = require('../Controller/orphanUpdateCont');
const router = express.Router();

router.post('/wellbeing/:id', createUpdate); 

module.exports = router;
