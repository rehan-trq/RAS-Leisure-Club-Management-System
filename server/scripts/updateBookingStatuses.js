import mongoose from 'mongoose';
import Booking from '../models/Booking.js';

const MONGODB_URI = 'mongodb+srv://saadmursaleen75:Q3WAwFmq6dOgwrQN@cluster0.9xjch3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function updateBookingStatuses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Booking.updateMany(
      { status: 'pending' },
      { $set: { status: 'confirmed' } }
    );

    console.log('Updated bookings:', result);

    const bookings = await Booking.find().populate('memberId', 'name email');
    console.log('Current bookings:', JSON.stringify(bookings, null, 2));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBookingStatuses(); 