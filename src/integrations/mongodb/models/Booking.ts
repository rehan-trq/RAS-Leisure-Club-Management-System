
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time_slot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'canceled', 'rescheduled'],
    default: 'confirmed'
  },
  notes: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// More reliable way to check if model exists before creating
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
