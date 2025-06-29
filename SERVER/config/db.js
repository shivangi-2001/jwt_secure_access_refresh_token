const mongoose = require('mongoose');
const { mongoUri } = require('.');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Database onAir connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;
