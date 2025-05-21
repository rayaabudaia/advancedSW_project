const Volunteer = require('../Model/volunteer'); 
const VolunteerRequest = require('../Model/volunteerRequest');

// تقديم طلب تطوع (volunteer فقط)
exports.createVolunteerRequest = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can submit requests.' });
    }

    const { orphanage_id, service_type, portfolio } = req.body;
    const user_id = req.user.user_id;

    const request = await VolunteerRequest.create({ orphanage_id, user_id, service_type, portfolio });
    res.status(201).json({ message: 'Volunteer request submitted', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// قبول طلب تطوع (orphanage فقط)
exports.approveVolunteerRequest = async (req, res) => {
  try {
    if (req.user.role !== 'orphanage') {
      return res.status(403).json({ message: 'Only orphanages can approve requests.' });
    }

    const { request_id } = req.params;
    const request = await VolunteerRequest.findByPk(request_id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.request_status = 'Approved';
    await request.save();

    await Volunteer.create({
      user_id: request.user_id,
      orphanage_id: request.orphanage_id,
      service_type: request.service_type,
      availability: "available",
      rating: null
    });

    res.status(200).json({ message: 'Volunteer approved and added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// رفض طلب تطوع (orphanage فقط)
exports.rejectVolunteerRequest = async (req, res) => {
  try {
    if (req.user.role !== 'orphanage') {
      return res.status(403).json({ message: 'Only orphanages can reject requests.' });
    }

    const { request_id } = req.params;
    const request = await VolunteerRequest.findByPk(request_id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.request_status = 'Rejected';
    await request.save();

    res.status(200).json({ message: 'Volunteer request rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// عرض الطلبات حسب الحالة (orphange/admin فقط)
exports.getVolunteerRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const role = req.user.role;
    const user_id = req.user.user_id;

    // تحقق من القيمة
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid request status' });
    }

    let whereClause = { request_status: status };

    // 🟩 إذا المستخدم دار أيتام، فقط عرض الطلبات الموجهة إليه
    if (role === 'orphanage') {
      whereClause.orphanage_id = user_id;

    // 🟦 إذا admin وكان معه orphanage_id في الرابط:
    } else if (role === 'admin' && req.query.orphanage_id) {
      whereClause.orphanage_id = parseInt(req.query.orphanage_id);

    // 🟥 غير ذلك، فقط admin يشوف الكل
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await VolunteerRequest.findAll({ where: whereClause });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// عرض كل الطلبات (admin فقط)
exports.getAllVolunteerRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view all requests.' });
    }

    const requests = await VolunteerRequest.findAll();
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تعديل طلب (فقط إذا كنت صاحبه والحالة Pending)
exports.updateVolunteerRequest = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { service_type, portfolio } = req.body;
    const user_id = req.user.user_id;

    const request = await VolunteerRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.user_id !== user_id) {
      return res.status(403).json({ message: 'You can only update your own request' });
    }

    if (request.request_status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot update request. Status is not Pending.' });
    }

    request.service_type = service_type || request.service_type;
    request.portfolio = portfolio || request.portfolio;
    await request.save();

    res.status(200).json({ message: 'Volunteer request updated successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف طلب (فقط إذا كنت صاحبه والحالة Pending)
exports.deleteVolunteerRequest = async (req, res) => {
  try {
    const { request_id } = req.params;
    const user_id = req.user.user_id;

    const request = await VolunteerRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.user_id !== user_id) {
      return res.status(403).json({ message: 'You can only delete your own request' });
    }

    if (request.request_status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete request. Status is not Pending.' });
    }

    await request.destroy();
    res.status(200).json({ message: 'Volunteer request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ عرض الطلبات الخاصة بالمتطوع الحالي (من التوكن)
exports.getMyVolunteerRequests = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can view their own requests.' });
    }

    const user_id = req.user.user_id;

    const requests = await VolunteerRequest.findAll({ where: { user_id } });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your volunteer requests', error: error.message });
  }
};
