const express = require('express');
const router = express.Router();
const volunteerController = require('../Controller/volunteerCont');
const verifyToken = require('../Middleware/authMiddle');

// ✅ volunteer يقدم طلب تطوع
router.post('/volunteer-request', verifyToken, volunteerController.createVolunteerRequest);

// ✅ دار الأيتام توافق/ترفض الطلب
router.post('/volunteer-request/approve/:request_id', verifyToken, volunteerController.approveVolunteerRequest);
router.post('/volunteer-request/reject/:request_id', verifyToken, volunteerController.rejectVolunteerRequest);

// ✅ عرض الطلبات حسب الحالة (دار الأيتام أو admin)
// مثال: /volunteer-requests/Pending?orphanage_id=5  (للأدمن)
router.get('/volunteer-requests/:status', verifyToken, volunteerController.getVolunteerRequestsByStatus);

// ✅ عرض كل الطلبات (admin فقط)
router.get('/volunteer-requests', verifyToken, volunteerController.getAllVolunteerRequests);

// ✅ تعديل طلب تطوع (المالك فقط - شرط الحالة Pending)
router.put('/volunteer-request/update/:request_id', verifyToken, volunteerController.updateVolunteerRequest);

// ✅ حذف طلب تطوع (المالك فقط - شرط الحالة Pending)
router.delete('/volunteer-request/delete/:request_id', verifyToken, volunteerController.deleteVolunteerRequest);
// ✅ المتطوع يعرض طلباته الخاصة فقط
router.get('/my-volunteer-requests', verifyToken, volunteerController.getMyVolunteerRequests);

module.exports = router;
