import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb+srv://saadmursaleen75:Q3WAwFmq6dOgwrQN@cluster0.9xjch3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function updateUserPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'arshman@email.com';
    const newPassword = 'password123';

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully for user:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUserPassword(); 