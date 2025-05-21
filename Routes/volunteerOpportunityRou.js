const express = require('express');
const router = express.Router();
const volunteerOpportunityController = require('../Controller/volunteerOpportunityCont');
const verifyToken = require('../Middleware/authMiddle');

// إنشاء فرصة تطوع (orphanage فقط)
router.post('/create', verifyToken, volunteerOpportunityController.createOpportunity);

// عرض كل الفرص المفتوحة (عام)
router.get('/open', volunteerOpportunityController.getOpenOpportunities);

// تعديل حالة الفرصة (orphanage فقط)
router.put('/update-status/:opportunity_id', verifyToken, volunteerOpportunityController.updateOpportunityStatus);

// حذف فرصة تطوع (orphanage فقط)
router.delete('/opportunity/delete/:opportunity_id', verifyToken, volunteerOpportunityController.deleteOpportunity);

module.exports = router;
