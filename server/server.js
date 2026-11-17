const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const veterinaryRoutes = require('./routes/veterinaryRoutes');
const engineeringRoutes = require('./routes/engineeringRoutes');
const agricultureRoutes = require('./routes/agricultureRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

app.set('socketio', io);

// Global Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/simulate', simulationRoutes);
app.use('/api/elephants', veterinaryRoutes);
app.use('/api/nodes', engineeringRoutes);
app.use('/api/agro-zones', agricultureRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'TRIDENT Tactical HEC Core Backend',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection telemetry
io.on('connection', (socket) => {
  console.log(`[TRIDENT SOCKET] Tactical client connected: ${socket.id}`);

  socket.on('subscribe:sector', (sectorId) => {
    socket.join(`sector:${sectorId}`);
    console.log(`[TRIDENT SOCKET] Client ${socket.id} joined sector:${sectorId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[TRIDENT SOCKET] Tactical client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[TRIDENT SERVER ERROR]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Tactical Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server and seed if empty
const startServer = async () => {
  await connectDB();

  // Auto-seed check if connected to MongoDB
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const ElephantProfile = require('./models/ElephantProfile');
      const count = await ElephantProfile.countDocuments();
      if (count === 0) {
        console.log('[TRIDENT SEED] Empty database detected. Auto-populating initial tactical seed data...');
        const { seedTacticalData } = require('./seed/seed');
        await seedTacticalData();
      }
    }
  } catch (seedErr) {
    console.warn('[TRIDENT SEED] Auto-seed check note:', seedErr.message);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` [TRIDENT] HEC Tactical Command & Simulation Server   `);
    console.log(` Active Port: http://127.0.0.1:${PORT}             `);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}       `);
    console.log(`=======================================================`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, server };
