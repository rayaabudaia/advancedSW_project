const SponsorshipRequest = require("../Model/sponsorshipRequest");
const Sponsorship = require("../Model/sponsorship");
const User = require("../Model/user");
const Orphan = require("../Model/orphan");

const createRequest = async (req, res) => {
  try {
    const { sponsor_id, orphan_id, job, proof_of_income, marital_status } = req.body;

    // Validate presence
    if (!sponsor_id || !orphan_id) {
      return res.status(400).json({ message: "sponsor_id and orphan_id are required" });
    }

    // Check user exists and role is 'sponsor'
    const sponsor = await User.findByPk(sponsor_id);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    if (sponsor.role !== 'sponsor') {
      return res.status(403).json({ message: "User is not a sponsor" });
    }

    // Check if orphan is already sponsored
    const existingSponsorship = await Sponsorship.findOne({ where: { orphan_id } });
    if (existingSponsorship) {
      return res.status(409).json({ message: "This orphan is already sponsored" });
    }

    // Create request
    const request = await SponsorshipRequest.create({
      sponsor_id,
      orphan_id,
      job,
      proof_of_income,
      marital_status,
    });

    res.status(201).json({ message: "Sponsorship request submitted", request });

  } catch (err) {
    res.status(500).json({ message: "Error creating request", error: err.message });
  }
};

module.exports = { createRequest };




//Admin Approves or Rejects Request
const reviewRequest = async (req, res) => {
  try {
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
  createRequest,
  reviewRequest,
};
