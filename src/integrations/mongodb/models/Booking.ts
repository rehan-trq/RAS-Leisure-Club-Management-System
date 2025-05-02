
import mongoose from 'mongoose';

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

// Check if the model exists before creating it to prevent the "Cannot overwrite model" error
// Also use a more reliable way of checking model existence
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
