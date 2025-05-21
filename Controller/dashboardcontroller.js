
// new controller for donations dashboard
//للفيتشر الرابعة 

const sequelize = require('../config/seq');
const donations = require('../Model/donations')(sequelize);
const users = require('../Model/user');
const orphanages = require('../Model/orphanages');
const impactReports = require('../Model/impact_reports')(sequelize);


const { Op, fn, col } = require('sequelize');

const get_dashboard_data = async (req, res) => {   
  try {
    // فحص انه ادمن 
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can access dashboard data.' });
    }

    const totalDonations = await donations.count();
    const totalAmount = await donations.sum('amount');
    const totalDonors = await donations.count();
    const totalOrphanages = await orphanages.count();

    const statusCounts = await donations.findAll({
      attributes: ['donation_type', [fn('COUNT', col('donation_type')), 'count'] ],
      group: ['donation_type']
    });

    const statusStats = {};
    statusCounts.forEach(item => {
      statusStats[item.donation_type] = parseInt(item.dataValues.count);
    });

    return res.status(200).json({
      totalDonors,
      totalDonations,
      totalAmount,
      totalOrphanages,
      statusStats
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load dashboard data",
      error: error.message
    });
  }
};


module.exports = {
  get_dashboard_data
};
