const express = require('express');
const router = express.Router();
const donationcontroller = require('../controllers/donationcontroller');

router.post('/add', donationcontroller.add_donation);


router.get('/all', donationcontroller.get_all_donations);


router.get('/:donation_id', donationcontroller.get_donation_by_id);


router.put('/:donation_id', donationcontroller.update_donation);


router.delete('/:donation_id', donationcontroller.delete_donation);


router.get('/users/:user_id', donationcontroller.get_donations_by_user);


router.get('/orphanages/:orphanage_id', donationcontroller.get_donations_by_orphanage);

module.exports = router;
