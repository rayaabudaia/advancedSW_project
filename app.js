require('dotenv').config();

const express = require('express');
const sequelize = require('./config/seq');
const orphanRoutes = require('./Routes/orphanRou');
const adminRoutes = require('./Routes/adminRou');
const authRoutes = require('./Routes/authRou');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const sponsorshipRoutes = require("./Routes/sponsorshipRou");


const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.send("Hello World");
});
app.use("/hopeconnect/show", orphanRoutes);
app.use("/hopeconnect/admin", adminRoutes);
app.use("/hopeconnect/auth", authRoutes);
app.use("/hopeconnect/sponsorship", sponsorshipRoutes);

// Database
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('Database connection failed', err));

sequelize.sync({ force: false })
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.log("Sync error:", err));

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
