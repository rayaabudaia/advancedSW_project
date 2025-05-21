
const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq");

const deliveries  = sequelize.define("deliveries", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donation_id: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending","delivered"),
    defaultValue: "pending",
  },
  Latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  Longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
}, {
  tableName: "deliveries",
  timestamps: true,
});

module.exports = deliveries ;
