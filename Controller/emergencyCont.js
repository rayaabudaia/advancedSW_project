const EmergencyCampaign = require('../Model/Emergency');


const contribute = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const { amount } = req.body;

    const campaign = await EmergencyCampaign.findByPk(campaign_id);

    if (!campaign || campaign.status !== 'active') {
      return res.status(400).json({ message: 'Invalid or inactive campaign' });
    }

    const contribution = parseInt(amount, 10);
    if (isNaN(contribution) || contribution <= 0) {
      return res.status(400).json({ message: 'Invalid contribution amount' });
    }

    const remaining = campaign.goal_amount - campaign.amount_raised;

    // Only take the remaining amount needed
    const acceptedAmount = Math.min(contribution, remaining);
    campaign.amount_raised += acceptedAmount;

    if (campaign.amount_raised >= campaign.goal_amount) {
      campaign.status = 'completed';
    }

    await campaign.save();

    res.status(200).json({
      message: 'Donation accepted',
      acceptedAmount,
      excessReturned: contribution - acceptedAmount,
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to donate', error: error.message });
  }
};

  
  
  const getAllCampaigns = async (req, res) => {
    try {
      const campaigns = await EmergencyCampaign.findAll();
      res.status(200).json(campaigns);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching campaigns', error: err.message });
    }
  };

  module.exports = {
    contribute,
    getAllCampaigns
  };