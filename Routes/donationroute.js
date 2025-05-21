const express = require('express');
const router = express.Router();
const donationController = require('../Controller/donationcontroller');

const verifyToken = require('../Middleware/authMiddle');


//new
// Route for getting verified orphanages (استرجاع دور الايتام الموثوقة عشان يتم التبرع الها )
router.get('/verified_orphanages', donationController.get_verified_orphanages_for_donations);


// Feedback routes (new)
router.post('/feedback', verifyToken, donationController.add_feedback); // اضافة فيد باك من قبل المتبرع لدار الايتام يلي تبرع الها
router.delete('/feedback/:id', verifyToken, donationController.delete_feedback);  //  // حذف فيد باك من قبل المتبرع لدار الايتام يلي تبرع الها

router.post('/add', donationController.add_donation);
router.put('/:donation_id', donationController.update_donation);
router.delete('/:donation_id', donationController.delete_donation);

// جديد>>>>>>>>>>>>
// رسوم خصم من مبلغ التبرع 
router.get('/total-service-fees', donationController.get_total_service_fees);
router.get('/:donation_id/details', donationController.get_donation_details);

module.exports = router;