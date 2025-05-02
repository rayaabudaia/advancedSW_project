require('dotenv').config(); 

const express = require('express');
const sequelize = require('./config/seq');
const donationroute = require('./routes/donationroute');

sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed', err));

const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
  res.send("Hello World");  
});

app.use(express.json());
app.use('/hopeconnect/donations', donationroute);

sequelize.sync({ force: false }) 
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Sync error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
