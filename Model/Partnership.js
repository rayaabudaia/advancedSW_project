const { DataTypes } = require('sequelize');
const sequelize = require('../config/seq');

const Partnership = sequelize.define('Partnership', {
  partnership_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orphanage_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'partnerships', // اسم الجدول في قاعدة البيانات
  timestamps: false
});

module.exports = Partnership;