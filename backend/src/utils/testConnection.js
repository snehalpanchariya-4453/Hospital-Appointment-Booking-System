const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const testConnection = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in backend/.env');
    process.exit(1);
  }

  if (uri.includes('<db_password>') || uri.includes('<YOUR_PASSWORD>') || uri.includes('<password>')) {
    console.warn('⚠️  Password placeholder detected in backend/.env!');
    console.warn('👉 Please replace the placeholder with your actual MongoDB Atlas database password.');
    process.exit(2);
  }

  const maskedUri = uri.includes('@') ? uri.replace(/:([^:@]+)@/, ':****@') : uri;
  console.log(`🔍 Testing database connection to: ${maskedUri}...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log('🌸 MongoDB connection SUCCESSFUL!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database Name: ${conn.connection.name}`);
    console.log(`   Connection Ready State: ${conn.connection.readyState === 1 ? 'Connected' : conn.connection.readyState}`);

    await mongoose.disconnect();
    console.log('🔒 Test complete. Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`   Error Message: ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.warn('👉 Check your database username and password in backend/.env.');
    } else if (error.message.includes('querySrv ETIMEOUT') || error.message.includes('ETIMEDOUT') || error.message.includes('Server selection timed out')) {
      console.warn('👉 Check your Network Access in MongoDB Atlas (ensure IP Address 0.0.0.0/0 is active).');
    }
    process.exit(1);
  }
};

testConnection();
