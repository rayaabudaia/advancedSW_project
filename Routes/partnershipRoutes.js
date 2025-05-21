// partnershipRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/authMiddle');
const partnership = require('../Controller/partnershipController');

// تقديم طلب شراكة
router.post('/request', verifyToken, partnership.requestPartnership);

// مراجعة طلب (دار الأيتام فقط)
router.put('/request/:request_id', verifyToken, partnership.reviewRequest);

// حذف طلب (صاحب الطلب فقط إذا كان Pending)
router.delete('/request/:request_id', verifyToken, partnership.deleteRequest);

// عرض طلبات المستخدم حسب الحالة (لـ ngo, charity)
router.get('/requests', verifyToken, partnership.getRequestsByStatus);

// عرض الطلبات الخاصة بدار الأيتام (admin فقط حسب orphanage_id)
router.get('/orphanage/:orphanage_id', verifyToken, partnership.getRequestsForOrphanage);

// عرض كل الطلبات (admin فقط)
router.get('/all', verifyToken, partnership.getAllRequests);

// طلبات المستخدم الحالي فقط
router.get('/my', verifyToken, partnership.getMyRequests);

module.exports = router;
