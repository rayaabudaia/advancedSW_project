// Controller/orphanageManagerController.js

//new
const sequelize = require('../config/seq');
const donations = require('../Model/donations')(sequelize);
const orphanages = require('../Model/orphanages');
const SponsorshipRequest = require('../Model/sponsorshipRequest');
const Sponsorship = require('../Model/sponsorship');
const impact_reports = require('../Model/impact_reports')(sequelize);

// جلب التبرعات المرتبطة بالمدير
const getDonationsForManager = async (req, res) => {
  try {
    const managerName = req.user.manager_name;

    const orphanage = await orphanages.findOne({ where: { manager_name: managerName } });

    if (!orphanage) {
      return res.status(403).json({ message: 'You are not authorized to view donations for this orphanage' });
    }

    const donationsList = await donations.findAll({
      where: { orphanage_id: orphanage.orphanage_id }
    });

    if (donationsList.length === 0) {
      return res.status(404).json({ message: 'No donations found for this orphanage' });
    }

    return res.status(200).json(donationsList);
  } catch (error) {
    console.error("Error in getDonationsForManager:", error);
    return res.status(500).json({ message: 'Error fetching donations for this orphanage', error: error.message });
  }
};

// اضافة تقرير لرقم التبرع يلي واصله جديد عشان تتحدث الحلة عند المتبرع 

const addImpactReport = async (req, res) => {
  try {
    const { donation_id, title, description } = req.body;
    const managerName = req.user.manager_name;

    const donation = await donations.findOne({ where: { donation_id } });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const orphanage = await orphanages.findOne({
      where: {
        orphanage_id: donation.orphanage_id,
        manager_name: managerName
      }
    });

    if (!orphanage) {
      return res.status(403).json({ message: 'You are not authorized to add a report to this donation' });
    }

    // تحديث tracking_url وحالة التبرع
    donation.tracking_url = description;
    donation.donation_status = 'Completed'; // تحديث الحالة
    await donation.save();

    const newReport = await impact_reports.create({
      orphanage_id: orphanage.orphanage_id,
      donation_id: donation.donation_id,
      title,
      description
    });

    return res.status(201).json({
      message: 'Report added and donation marked as complete',
      report: newReport
    });

  } catch (error) {
    console.error("Error in addImpactReport:", error);
    return res.status(500).json({ message: 'Error adding report', error: error.message });
  }
};


//قبول طلب سبونسر
const reviewRequest = async (req, res) => {
  try {
     if (!req.user || req.user.role !== "orphanage-manager") {
      return res.status(403).json({ message: "Unauthorized: orphanage manager only" });
    }
    const { request_id } = req.params;
    const { status, sponsorship_type, amount } = req.body;

    const request = await SponsorshipRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.request_status = status;
    await request.save();

    if (status === "Approved") {
      await Sponsorship.create({
        sponsor_id: request.sponsor_id,
        orphan_id: request.orphan_id,
        sponsorship_type,
        amount,
      });
    }

    res.status(200).json({ message: `Request ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ message: "Error reviewing request", error: err.message });
  }
};

module.exports = {
  getDonationsForManager,
  addImpactReport ,
  reviewRequest,
};