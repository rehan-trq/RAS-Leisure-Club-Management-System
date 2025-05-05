import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb+srv://saadmursaleen75:Q3WAwFmq6dOgwrQN@cluster0.9xjch3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkBookings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const bookings = await Booking.find().populate('memberId', 'name email');
    console.log('Found bookings:', bookings.length);
    console.log('Bookings:', JSON.stringify(bookings, null, 2));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBookings(); 