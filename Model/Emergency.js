
const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq");

const Emergency = sequelize.define("emergency", {
  campaign_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  campaign_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  goal_amount: { type: DataTypes.INTEGER(11), allowNull: false },
  amount_raised: { type: DataTypes.INTEGER(11), defaultValue: 0 },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  orphanage_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: false,
  tableName: "emergency"
});

module.exports = Emergency;
