const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq");

const Sponsorship = sequelize.define("sponsorships", {
  sponsorship_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sponsor_id: { type: DataTypes.INTEGER, allowNull: false },
  orphan_id: { type: DataTypes.INTEGER, allowNull: false },
  sponsorship_type: { type: DataTypes.STRING(50) },
  amount: { type: DataTypes.DECIMAL(10, 3) },
}, {
  timestamps: false,
});

module.exports = Sponsorship;
