const { DataTypes } = require('sequelize');
const sequelize = require("../config/seq");
// جديد 
const PhysicalDonationDetails = sequelize.define('physical_donation_details', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  donation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'donations',
      key: 'donation_id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  pickup_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',    
      key: 'id',         
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  }
}, {
  tableName: 'physical_donation_details',
  timestamps: false,
});

module.exports = PhysicalDonationDetails;
