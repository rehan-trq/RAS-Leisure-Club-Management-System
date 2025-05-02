
import mongoose from 'mongoose';
import { toast } from 'sonner';

// Use Vite's import.meta.env instead of process.env
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || "mongodb+srv://Saad:11223344@se-cluster.xvjqbnk.mongodb.net/?retryWrites=true&w=majority&appName=SE-Cluster";

// Global variable to track connection state
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState) {
      isConnected = true;
      console.log('Using existing MongoDB connection');
      return;
    }
    
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connection.readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
};

export default mongoose;
