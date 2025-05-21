const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq.js');

const VolunteerRequest = sequelize.define('VolunteerRequest', {
  request_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orphanage_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: true }, // volunteer user id
  service_type: { type: DataTypes.STRING(100), allowNull: false },
  request_status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
  portfolio: { type: DataTypes.TEXT },
  request_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'volunteer_requests',
  timestamps: false
});

module.exports = VolunteerRequest;