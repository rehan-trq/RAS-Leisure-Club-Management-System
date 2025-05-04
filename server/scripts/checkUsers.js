import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb+srv://saadmursaleen75:Q3WAwFmq6dOgwrQN@cluster0.9xjch3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find();
    console.log('Found users:', users.length);
    console.log('Users:', JSON.stringify(users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })), null, 2));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers(); 