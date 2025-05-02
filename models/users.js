
// models/users.js
const { DataTypes } = require('sequelize');

const user = (sequelize) => {
    const User = sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NPMNOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    return User;
};

module.exports = user;
