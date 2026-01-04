const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host || 'Cluster'}`);
    return true;
  } catch (error) {
    console.error('================================================');
    console.error('CRITICAL: MONGODB CONNECTION FAILED');
    console.error(`Error: ${error.message}`);
    console.error('------------------------------------------------');
    console.error('The server will stay online, but API calls will fail.');
    console.error('Please whitelist this IP in MongoDB Atlas:');
    console.error('Current IP: 112.134.192.124');
    console.error('================================================');
    return false;
  }
};

module.exports = connectDB;
