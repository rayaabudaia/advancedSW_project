const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq');

const Orphanage = sequelize.define('orphanages', {
  orphanage_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manager_name: {
    type: DataTypes.STRING
  },
  ads: {
    type: DataTypes.TEXT
  },
  ads_category: {
    type: DataTypes.STRING
  },
  verification_proof: {
    type: DataTypes.STRING 
  }
}, {
  tableName: 'orphanages',
  timestamps: false
});

module.exports = Orphanage;
