
// models/orphanages.js
const { DataTypes } = require('sequelize');

const orphanage = (sequelize) => {
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
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        manager_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ads: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ads_category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        verification_proof: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'orphanages',
        timestamps: false
    });

    return Orphanage;
};

module.exports = orphanage;
