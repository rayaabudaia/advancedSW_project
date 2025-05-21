const NGOPartnershipRequest = require('../Model/NgoPartnershipRequest');
const Partnership = require('../Model/Partnership');
const User = require('../Model/user');

// ✅ تقديم طلب شراكة
const requestPartnership = async (req, res) => {
  try {
    const { orphanage_id, verification_proof } = req.body;
    const user_id = req.user.user_id;

    const user = await User.findByPk(user_id);
    if (!['ngo', 'charity', 'humanitarian organization'].includes(user.role)) {
      return res.status(403).json({ message: 'Only NGOs ,charities or humanitarian organization can request partnerships' });
    }

    const existing = await NGOPartnershipRequest.findOne({
      where: { user_id, orphanage_id, request_status: 'Pending' }
    });

    if (existing) {
      return res.status(409).json({ message: 'You already have a pending request for this orphanage' });
    }

    const request = await NGOPartnershipRequest.create({
      user_id,
      orphanage_id,
      verification_proof
    });

    res.status(201).json({ message: 'Partnership request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create partnership request', error: error.message });
  }
};

// ✅ مراجعة طلب (موافقة أو رفض) - دار الأيتام فقط
const reviewRequest = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { status } = req.body;

    const request = await NGOPartnershipRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    request.request_status = status;
    await request.save();

    if (status === 'Approved') {
      const existing = await Partnership.findOne({
        where: {
          user_id: request.user_id,
          orphanage_id: request.orphanage_id
        }
      });

      if (!existing) {
        await Partnership.create({
          user_id: request.user_id,
          orphanage_id: request.orphanage_id
        });
      }
    }

    res.status(200).json({ message: `Request ${status.toLowerCase()} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing partnership request', error: error.message });
  }
};

// ✅ عرض كل الطلبات (admin فقط)
const getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await NGOPartnershipRequest.findAll();
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all partnership requests', error: error.message });
  }
};

// ✅ عرض الطلبات الخاصة بالمستخدم (NGO / charity فقط)
const getMyRequests = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const role = req.user.role;

    if (!['ngo', 'charity', 'humanitarian organization'].includes(role)) {
      return res.status(403).json({ message: 'Only NGOs وcharities or humanitarian organization can access their requests' });
    }

    const requests = await NGOPartnershipRequest.findAll({ where: { user_id } });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user requests', error: error.message });
  }
};

// ✅ عرض الطلبات الموجهة لدار الأيتام (orphanage فقط)
const getRequestsForOrphanage = async (req, res) => {
  try {
    const orphanage_id = parseInt(req.params.orphanage_id);
    const role = req.user.role;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view these requests' });
    }

    const requests = await NGOPartnershipRequest.findAll({ where: { orphanage_id } });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests for orphanage', error: error.message });
  }
};


const deleteRequest = async (req, res) => {
  try {
    const { request_id } = req.params;
    const user_id = req.user.user_id;
    const role = req.user.role;

    const request = await NGOPartnershipRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.request_status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be deleted' });
    }

    if (role === 'admin' || request.user_id === user_id) {
      await request.destroy();
      return res.status(200).json({ message: 'Request deleted successfully' });
    }

    return res.status(403).json({ message: 'Not authorized to delete this request' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
};
const getRequestsByStatus = async (req, res) => {
  try {
    const status = req.query.status || 'Pending';
    const user_id = req.user.user_id;
    const role = req.user.role;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    let where = { request_status: status };

    if (role === 'orphanage') {
      where.orphanage_id = user_id;
    } else if (['ngo', 'charity', 'humanitarian'].includes(role)) {
      where.user_id = user_id;
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await NGOPartnershipRequest.findAll({ where });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests by status', error: error.message });
  }
};

// ✅ التصدير
module.exports = {
  requestPartnership,
  reviewRequest,
  getAllRequests,
  getMyRequests,
  getRequestsForOrphanage,
  deleteRequest,
  getRequestsByStatus
};
