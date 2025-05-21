const VolunteerOpportunity = require('../Model/VolunteerOpportunity');

// إنشاء فرصة تطوع جديدة (orphanage فقط)
exports.createOpportunity = async (req, res) => {
  try {
    if (req.user.role !== 'orphanage') {
      return res.status(403).json({ message: 'Only orphanages can create opportunities.' });
    }

    const { service_type, description, required_volunteers } = req.body;
    const orphanage_id = req.user.user_id; // من التوكن

    if (!service_type || !required_volunteers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const opportunity = await VolunteerOpportunity.create({ orphanage_id, service_type, description, required_volunteers });
    res.status(201).json({ message: 'Volunteer opportunity created', opportunity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// عرض جميع الإعلانات المفتوحة (عام)
exports.getOpenOpportunities = async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.findAll({
      where: { status: 'Open' },
      order: [['created_at', 'DESC']]
    });

    if (opportunities.length === 0) {
      return res.status(404).json({ message: 'No open opportunities found' });
    }

    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تعديل حالة الخدمة (Open / Close) (orphanage فقط)
exports.updateOpportunityStatus = async (req, res) => {
  try {
    if (req.user.role !== 'orphanage') {
      return res.status(403).json({ message: 'Only orphanages can update opportunity status.' });
    }

    const { opportunity_id } = req.params;
    const { status } = req.body;

    if (!['Open', 'Close'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'Open' or 'Close'." });
    }

    const opportunity = await VolunteerOpportunity.findByPk(opportunity_id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    if (opportunity.orphanage_id !== req.user.user_id) {
      return res.status(403).json({ message: "You can only update your own opportunities." });
    }

    opportunity.status = status;
    await opportunity.save();

    res.status(200).json({ message: "Opportunity status updated successfully.", opportunity });

  } catch (error) {
    res.status(500).json({ message: "Server error while updating opportunity status.", error: error.message });
  }
};

// حذف فرصة تطوع بواسطة دار الأيتام (orphanage فقط)
exports.deleteOpportunity = async (req, res) => {
  try {
    if (req.user.role !== 'orphanage') {
      return res.status(403).json({ message: 'Only orphanages can delete opportunities.' });
    }

    const { opportunity_id } = req.params;
    const opportunity = await VolunteerOpportunity.findByPk(opportunity_id);

    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    if (opportunity.orphanage_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only delete your own opportunities.' });
    }

    await opportunity.destroy();

    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting opportunity', error: error.message });
  }
};
