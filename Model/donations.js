const { DataTypes } = require('sequelize');

// معدل لانه ضفت عمودين جداد 
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
                service_fee: {   // <<<<<< جديد
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
            defaultValue: 0.0
        },
        net_amount: {    // <<<<<< جديد
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
            defaultValue: 0.0
        },
        donation_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        donation_type: {
            type: DataTypes.ENUM('Physical', 'Financial'),// update 
            allowNull: false
        },
        payment_method: {  // update 
            type: DataTypes.ENUM('Cash', 'PayPal', 'Card', 'BankTransfer'),
            allowNull: true,
            defaultValue: null
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

  

    return donation;
};

module.exports = donation;



