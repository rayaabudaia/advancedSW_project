const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq.js');

const VolunteerOpportunity = sequelize.define('VolunteerOpportunity', {
  opportunity_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orphanage_id: { type: DataTypes.INTEGER, allowNull: false },
  service_type: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  required_volunteers: { type: DataTypes.INTEGER, allowNull: false }, // 👈 عدد المتطوعين المطلوبين
  status: { type: DataTypes.ENUM('Open', 'Close'), defaultValue: 'Open' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'volunteer_opportunities',
  timestamps: false
});

module.exports = VolunteerOpportunity;
