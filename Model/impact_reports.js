const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('impact_reports', {
    report_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orphanage_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    donation_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'impact_reports',
    timestamps: false
  });
};
