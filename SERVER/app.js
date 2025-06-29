const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();


// Test route
app.get('/', (req, res) => {
  res.send('Welcome to REST API 🚀');
});

// TODO: Add routes here
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

module.exports = app;
