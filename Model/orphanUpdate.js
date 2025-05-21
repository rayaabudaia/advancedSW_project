// models/OrphanUpdate.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq");
const Orphan = require("./orphan");

const OrphanUpdate = sequelize.define("OrphanUpdate", {
  update_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orphan_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // e.g., "Medical", "Progress", "Photo"
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "orphan_updates", 
  timestamps: true,
});


Orphan.hasMany(OrphanUpdate, { foreignKey: "orphan_id" });
OrphanUpdate.belongsTo(Orphan, { foreignKey: "orphan_id" });

module.exports = OrphanUpdate;
