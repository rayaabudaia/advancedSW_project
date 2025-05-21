const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq');

const NGOPartnershipRequest = sequelize.define('ngo_partnership_requests', {
request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
user_id: { type: DataTypes.INTEGER, allowNull: false }, // كان ngo_user_id
orphanage_id: { type: DataTypes.INTEGER, allowNull: false },
request_status: {
type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
defaultValue: 'Pending'
},
verification_proof: { type: DataTypes.STRING },
request_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
timestamps: false
});

module.exports = NGOPartnershipRequest;
