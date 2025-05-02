const { DataTypes } = require('sequelize');

const donation = (sequelize) => {
    const donation = sequelize.define('donations', {
        donation_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        donor_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false
        },
        donation_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        donation_type: {
            type: DataTypes.STRING
        },
        donation_status: {
            type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        tracking_url: {
            type: DataTypes.STRING
        },
        orphanage_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        tableName: 'donations',  
        timestamps: false  
    });

    //  associations
   donation.associate = function (models) {
        donation.belongsTo(models.users, { foreignKey: 'donor_id' }); // with users table
       donation.belongsTo(models.orphanages, { foreignKey: 'orphanage_id' });  // with orphanages table
    };

    return donation;
};

module.exports = donation;
