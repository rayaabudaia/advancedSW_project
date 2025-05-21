require('dotenv').config();

const express = require('express');
const sequelize = require('./config/seq');
const orphanRoutes = require('./Routes/orphanRou');
const adminRoutes = require('./Routes/adminRou');
const authRoutes = require('./Routes/authRou');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const sponsorshipRoutes = require("./Routes/sponsorshipRou");
const donationroute = require('./Routes/donationroute');
const emergencyRou = require('./Routes/emergencyRou');
const orphanageManagerRou = require('./Routes/orphanageManagerRou');
const orphanUpdateRou = require('./Routes/orphanUpdateRou');
const deliveriesRou = require('./Routes/deliveriesRou');

//جديد >>>>>>>>>>
const volunteerRoutes = require('./Routes/volunteerRou');
const volunteerOpportunityRoutes = require('./Routes/volunteerOpportunityRou');
const volunteerApplicationRouter = require('./Routes/volunteerApplicationRou');
const partnershipRoutes = require('./Routes/partnershipRoutes');



const app = express();


const PORT = 3001;

// Create server
const server = http.createServer(app);

// Attach socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io); // make io accessible in controllers

// Listen for client connections
io.on('connection', (socket) => {
  console.log(' Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log(' Client disconnected:', socket.id);
  });
});



// Start server
server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'webPages')));

// Routes

app.use("/hopeconnect/show", orphanRoutes);
app.use("/hopeconnect/admin", adminRoutes);
app.use("/hopeconnect/auth", authRoutes);
app.use("/hopeconnect/sponsorship", sponsorshipRoutes);
app.use('/hopeconnect/donations', donationroute);
app.use('/hopeconnect/emergency', emergencyRou);
app.use('/hopeconnect', orphanageManagerRou); 
app.use('/hopeconnect', orphanUpdateRou);
app.use('/hopeconnect/tracking', deliveriesRou);

//جديد>>>>>>>>>
app.use('/hopeconnect/volunteer', volunteerRoutes);
app.use('/hopeconnect/opportunities', volunteerOpportunityRoutes);
app.use('/hopeconnect/volunteer-application', volunteerApplicationRouter);
app.use('/hopeconnect/partnerships', partnershipRoutes);



// Database conn
sequelize.authenticate()
  .then(() => console.log(' Database connected successfully'))
  .catch((err) => console.error('Database connection failed', err));

sequelize.sync({ force: false })
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Sync error:", err));
