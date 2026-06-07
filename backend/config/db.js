const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('✅ MongoDB Connected');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
    setTimeout(connectDB, 3000);
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool — prevents hanging on concurrent requests
      maxPoolSize: 10,
      minPoolSize: 2,
      // Kill idle sockets after 45s to prevent stale connections
      socketTimeoutMS: 45000,
      // Timeout for initial connection
      connectTimeoutMS: 10000,
      // Keep-alive to prevent firewall from killing idle connections
      serverSelectionTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });
  } catch (error) {
    console.error('❌ Initial MongoDB connection failed:', error.message);
    // Retry instead of crashing
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;

// Ping MongoDB every 30s to keep the connection alive
// This prevents Atlas from dropping idle connections after ~60s
const keepAlive = () => {
  const mongoose = require('mongoose');
  setInterval(async () => {
    if (mongoose.connection.readyState === 1) {
      try {
        await mongoose.connection.db.admin().ping();
      } catch (err) {
        console.warn('⚠️  MongoDB keep-alive ping failed:', err.message);
      }
    }
  }, 30000);
};

keepAlive();
