//  باستخدام CommonJS
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
  orphanage_id: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orphanages',
      key: 'orphanage_id'
    }
  }
}, {
  tableName: 'orphans',
  timestamps: false
});

module.exports = Orphan;

