const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq'); // مكان اتصالك بالداتا بيز

const Volunteer = sequelize.define('volunteer', {
    volunteer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    orphanage_id: { type: DataTypes.INTEGER, allowNull: false },
    service_type: { type: DataTypes.STRING(100), allowNull: false },
    availability: { type: DataTypes.TEXT },
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 },defaultValue: null }
    
}, {
    tableName: 'volunteers',
    timestamps: false
});

module.exports = Volunteer;
