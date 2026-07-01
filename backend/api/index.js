const app = require('../src/app');
const mongoose = require('mongoose');

let isConnected = false;

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    if (!process.env.MONGO_URI) {
      return res.status(500).json({
        success: false,
        message: 'Database connection string (MONGO_URI) is missing in Vercel environment variables.'
      });
    }

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    next();
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed.',
      error: error.message
    });
  }
});

module.exports = app;
