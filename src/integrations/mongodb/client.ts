
import mongoose from 'mongoose';
import { toast } from 'sonner';

const MONGODB_URI = "mongodb+srv://Saad:11223344@se-cluster.xvjqbnk.mongodb.net/?retryWrites=true&w=majority&appName=SE-Cluster";

// Global variable to track connection state
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
};

export default mongoose;
