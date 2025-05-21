const VolunteerApplication = require('../Model/volunteerApplication');
const User = require('../Model/user');
const VolunteerOpportunity = require('../Model/VolunteerOpportunity');
const Volunteer = require('../Model/volunteer');

// تقديم طلب تطوع
exports.applyForOpportunity = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        if (req.user.role !== 'volunteer') {
            return res.status(403).json({ message: 'Only volunteers can apply' });
        }

        const { opportunity_id } = req.body;

        const opportunity = await VolunteerOpportunity.findByPk(opportunity_id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        if (opportunity.status !== 'Open') {
            return res.status(400).json({ message: 'This opportunity is not open for applications' });
        }

        const existingApplication = await VolunteerApplication.findOne({
            where: { user_id, opportunity_id }
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this opportunity' });
        }

        const application = await VolunteerApplication.create({
            user_id,
            opportunity_id
        });

        res.status(201).json({ message: 'Application submitted successfully', application });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while applying for opportunity' });
    }
};

// قبول طلب تطوع
exports.approveApplication = async (req, res) => {
    try {
        if (req.user.role !== 'orphanage') {
            return res.status(403).json({ message: 'Only orphanages can approve applications' });
        }

        const { application_id } = req.params;
        const application = await VolunteerApplication.findByPk(application_id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (application.application_status.toLowerCase() !== 'pending') {
            return res.status(400).json({ message: 'Only pending applications can be approved' });
        }

        application.application_status = 'Approved';
        await application.save();

        const opportunity = await VolunteerOpportunity.findByPk(application.opportunity_id);
        if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

        if (opportunity.needed_volunteers > 0) {
            opportunity.needed_volunteers -= 1;
        }

        if (opportunity.needed_volunteers === 0) {
            opportunity.status = 'Closed';
        }

        await opportunity.save();

        const existingVolunteer = await Volunteer.findOne({
            where: {
                user_id: application.user_id,
                orphanage_id: opportunity.orphanage_id,
                service_type: opportunity.service_type
            }
        });

        if (!existingVolunteer) {
            await Volunteer.create({
                user_id: application.user_id,
                orphanage_id: opportunity.orphanage_id,
                service_type: opportunity.service_type,
                availability: 'available',
                rating: null
            });
        }

        res.status(200).json({ message: 'Application approved successfully, and volunteer handled', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while approving application' });
    }
};

// رفض طلب تطوع
exports.rejectApplication = async (req, res) => {
    try {
        if (req.user.role !== 'orphanage') {
            return res.status(403).json({ message: 'Only orphanages can reject applications' });
        }

        const { application_id } = req.params;
        const application = await VolunteerApplication.findByPk(application_id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.application_status = 'Rejected';
        await application.save();

        res.status(200).json({ message: 'Application rejected successfully', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while rejecting application' });
    }
};

// حذف طلب تطوع (سحب التقديم)
exports.deleteApplication = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const { application_id } = req.params;
        const application = await VolunteerApplication.findByPk(application_id);

        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (application.user_id !== user_id) {
            return res.status(403).json({ message: 'You can only delete your own application' });
        }

        if (application.application_status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending applications can be deleted' });
        }

        await application.destroy();

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting application' });
    }
};

// عرض طلبات المتطوعين لفرصة تطوع معينة (orphanage فقط)
exports.getApplicationsForOpportunity = async (req, res) => {
  try {
    const orphanage_id = req.user.user_id;
    const { opportunity_id } = req.params;

    // تحقق من أن المستخدم هو orphanage
    if (req.user.role !== 'orphanage') {
      return res.status(403).json({ message: 'Only orphanages can view applications for opportunities' });
    }

    // تحقق أن الفرصة موجودة وتابعة لدار الأيتام الحالي
    const opportunity = await VolunteerOpportunity.findByPk(opportunity_id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.orphanage_id !== orphanage_id) {
      return res.status(403).json({ message: 'You can only view applications for your own opportunities' });
    }

    // جلب الطلبات المرتبطة بهذه الفرصة
    const applications = await VolunteerApplication.findAll({
      where: { opportunity_id }
    });

    res.status(200).json({ message: 'Applications retrieved successfully', applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching applications', error: error.message });
  }
};
