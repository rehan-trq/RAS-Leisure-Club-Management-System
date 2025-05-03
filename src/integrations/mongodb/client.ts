
import mongoose from 'mongoose';
import { toast } from 'sonner';

// Use the provided MongoDB URI with Vite's import.meta.env
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || "mongodb+srv://saadmursaleen75:Q3WAwFmq6dOgwrQN@cluster0.9xjch3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Global variable to track connection state
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState >= 1) {
      isConnected = true;
      console.log('Using existing MongoDB connection');
      return mongoose.connection;
    }
    
    console.log('Connecting to MongoDB...');
    const db = await mongoose.connect(MONGODB_URI, {
      // Add any connection options here if needed
    });
    
    isConnected = db.connection.readyState === 1;
    console.log('MongoDB connected successfully');
    return db.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
};

export default mongoose;
