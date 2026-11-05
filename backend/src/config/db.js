const mongoose = require('mongoose');

let retryTimer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_booking';
  const maskedUri = uri.includes('@') ? uri.replace(/:([^:@]+)@/, ':****@') : uri;

  try {
    console.log(`🌸 Connecting to MongoDB at ${maskedUri}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`🌸 MongoDB Connected successfully: ${conn.connection.host}:${conn.connection.port || '27017'}/${conn.connection.name}`);
    global.lastDbError = null;
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    return conn;
  } catch (error) {
    global.lastDbError = error.message;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!retryTimer) {
      retryTimer = setInterval(async () => {
        if (mongoose.connection.readyState === 0) {
          console.log('🔄 Retrying MongoDB connection in background...');
          try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
            console.log('🌸 MongoDB Connected successfully on retry!');
            global.lastDbError = null;
            clearInterval(retryTimer);
            retryTimer = null;
          } catch (err) {
            global.lastDbError = err.message;
          }
        }
      }, 10000);
    }
    console.warn(`
⚠️  TIP: If using local MongoDB (Compass):
    1. Ensure your local MongoDB service is running on port 27017.
    2. Check your backend/.env connection string:
       MONGODB_URI=mongodb://127.0.0.1:27017/hospital_booking
    3. You can verify and view collections in MongoDB Compass at:
       mongodb://127.0.0.1:27017
    `);
    return null;
  }
};

module.exports = connectDB;
