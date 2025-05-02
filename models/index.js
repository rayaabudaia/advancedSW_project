const Sequelize = require('sequelize');
const sequelize = require('../config/seq');
sequelize.authenticate()
  .then(() => console.log('Database Connected Successfully'))
  .catch((err) => console.error('Database Connection Failed', err));

const user = require('./users')(sequelize); // user mode
const orphanage = require('./orphanages')(sequelize); // orghange model
const donation = require('./donations')(sequelize);  // donation model

donation.belongsTo(user, { foreignKey: 'donor_id' });  // associantion with donation and user
donation.belongsTo(orphanage, { foreignKey: 'orphanage_id' });  // associantion with donation and orphange

user.hasMany(donation, { foreignKey: 'donor_id' });
orphanage.hasMany(donation, { foreignKey: 'orphanage_id' });

const db = {
  Sequelize,
  sequelize,
  users: user,
  orphanages: orphanage,
  donations: donation,
};

module.exports = db;
