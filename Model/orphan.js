// orphan.js باستخدام CommonJS
const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq.js");

const Orphan = sequelize.define("Orphan", {
  orphan_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  education_status: { type: DataTypes.STRING },
  health_condition: { type: DataTypes.STRING },
  profile_picture: { type: DataTypes.STRING },
  progress_report: { type: DataTypes.TEXT },
  medical_update: { type: DataTypes.TEXT },
},{
  tableName: 'orphans',
  timestamps: false
});

module.exports = Orphan;

