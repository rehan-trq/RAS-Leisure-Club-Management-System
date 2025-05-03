
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const feedbackSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service_type: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'flagged', 'responded', 'archived'],
    default: 'new'
  },
  staff_response: {
    type: String,
    default: null
  },
  submitted_at: {
    type: Date,
    default: Date.now
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
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
