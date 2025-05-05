import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb+srv://saadmursaleen75:Q3WAwFmq6dOgwrQN@cluster0.9xjch3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function createStaffUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const staffUser = new User({
      name: 'Staff User',
      email: 'staff@example.com',
      password: 'password123',
      role: 'staff'
    });

    await staffUser.save();
    console.log('Staff user created successfully:', {
      id: staffUser._id,
      name: staffUser.name,
      email: staffUser.email,
      role: staffUser.role
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createStaffUser(); 