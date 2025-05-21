// Model/feedback_reviews.js
// new model for table feedback_reviews  in database


const { DataTypes } = require("sequelize");
const sequelize = require("../config/seq");

const FeedbackReview = sequelize.define("feedback_reviews", {
  feedback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: true // لأنه في حال حذف المستخدم يتحول إلى NULL
  },
  orphanage_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  feedback_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'feedback_reviews',
  timestamps: false
});

module.exports = FeedbackReview;
