const express = require('express');
const router = express.Router();
const volunteerApplicationController = require('../Controller/volunteerApplicationCont');
const verifyToken = require('../Middleware/authMiddle');

// تقديم طلب (volunteer فقط)
router.post('/apply', verifyToken, volunteerApplicationController.applyForOpportunity);

// قبول طلب (orphanage فقط)
router.post('/approve/:application_id', verifyToken, volunteerApplicationController.approveApplication);

// رفض طلب (orphanage فقط)
router.post('/reject/:application_id', verifyToken, volunteerApplicationController.rejectApplication);

// حذف طلب (volunteer يسحب طلبه إذا كان Pending)
router.delete('/delete/:application_id', verifyToken, volunteerApplicationController.deleteApplication);

// حذف فرصة تطوع (orphanage فقط)
//router.delete('/opportunity/delete/:opportunity_id', verifyToken, volunteerApplicationController.deleteOpportunity);

// عرض طلبات المتطوعين لفرصة معينة (orphanage فقط)
router.get('/opportunity/:opportunity_id/all', verifyToken, volunteerApplicationController.getApplicationsForOpportunity);

module.exports = router;
