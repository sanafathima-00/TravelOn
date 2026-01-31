/**
 * TravelOn Backend Server
 * Main entry point
 */

require('dotenv').config();
require('express-async-errors'); // Handle async errors automatically

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/database');
const { errorHandler } = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const hotelRoutes = require('./src/routes/hotelRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const localPostRoutes = require('./src/routes/localPostRoutes');

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect to Database
connectDB();

// API Routes
const apiVersion = '/api/v1';

app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/hotels`, hotelRoutes);
app.use(`${apiVersion}/bookings`, bookingRoutes);
app.use(`${apiVersion}/restaurants`, restaurantRoutes);
app.use(`${apiVersion}/orders`, orderRoutes);
app.use(`${apiVersion}/reviews`, reviewRoutes);
app.use(`${apiVersion}/local-posts`, localPostRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handling Middleware (Must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       🌍 TravelOn Backend Server       ║
╠════════════════════════════════════════╣
║ Environment: ${process.env.NODE_ENV || 'development'.padEnd(26)}║
║ Port: ${PORT.toString().padEnd(32)}║
║ API: ${`http://localhost:${PORT}`.padEnd(30)}║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
