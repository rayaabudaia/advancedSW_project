const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq");

const SponsorshipRequest = sequelize.define("sponsorship_requests", {
  request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sponsor_id: { type: DataTypes.INTEGER, allowNull: false },
  orphan_id: { type: DataTypes.INTEGER, allowNull: false },
  request_status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    allowNull: false,
    defaultValue: "Pending",
  },
  job: { type: DataTypes.STRING(100) },
  proof_of_income: { type: DataTypes.STRING(255) },
  marital_status: { type: DataTypes.STRING(25) },
}, {
  timestamps: false,
});

module.exports = SponsorshipRequest;
