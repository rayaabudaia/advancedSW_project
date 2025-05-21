const SponsorshipRequest = require("../Model/sponsorshipRequest");
const Sponsorship = require("../Model/sponsorship");
const User = require("../Model/user");
const Orphan = require("../Model/orphan");


const createRequest = async (req, res) => {
  try {
    const { sponsor_id, orphan_id, job, proof_of_income, marital_status } = req.body;

    // تحقق من الحقول المطلوبة
    if (!sponsor_id || !orphan_id) {
      return res.status(400).json({ message: "sponsor_id and orphan_id are required" });
    }

    // تحقق من وجود الكفيل
    const sponsor = await User.findByPk(sponsor_id);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    if (sponsor.role !== 'sponsor') {
      return res.status(403).json({ message: "User is not a sponsor" });
    }

    // تحقق من وجود اليتيم
    const orphan = await Orphan.findByPk(orphan_id);
    if (!orphan) {
      return res.status(404).json({ message: "Orphan not found" });
    }

    // تحقق من أن اليتيم غير مكفول مسبقًا
    const existingSponsorship = await Sponsorship.findOne({ where: { orphan_id } });
    if (existingSponsorship) {
      return res.status(409).json({ message: "This orphan is already sponsored" });
    }

    // إنشاء الطلب
    const request = await SponsorshipRequest.create({
      sponsor_id,
      orphan_id,
      job,
      proof_of_income,
      marital_status,
    });

    res.status(201).json({ message: "Sponsorship request submitted", request });

  } catch (err) {
    console.error("Error creating sponsorship request:", err);
    res.status(500).json({ message: "Error creating request", error: err.message });
  }
};

module.exports = {
  createRequest,
};
