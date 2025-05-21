const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq');

const VolunteerApplication = sequelize.define('VolunteerApplication', {
    application_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    opportunity_id: { type: DataTypes.INTEGER, allowNull: false },
    application_status: { 
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    },
    application_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'volunteer_applications',
    timestamps: false
});

module.exports = VolunteerApplication;
