const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_booking';
    const maskedUri = uri.includes('@') ? uri.replace(/:([^:@]+)@/, ':****@') : uri;
    console.log(`🌸 Connecting to MongoDB at ${maskedUri}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`🌸 MongoDB Connected successfully: ${conn.connection.host}:${conn.connection.port || '27017'}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
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
