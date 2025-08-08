import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns Promise<void>
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_school';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB database
 * @returns Promise<void>
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
    throw error;
  }
};
