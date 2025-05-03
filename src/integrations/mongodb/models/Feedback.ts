
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

// Create a mock Feedback model
let Feedback;

// More reliable way to check if model exists before creating
try {
  // Try to get existing model or create a new one
  Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
} catch (error) {
  console.error('Error creating Feedback model:', error);
  // Create a minimal mock implementation if model creation fails
  Feedback = mongoose.model('Feedback', feedbackSchema);
}

// Add static methods for mocking queries
Feedback.find = function(query = {}) {
  console.log('Mock: Feedback.find', query);
  
  // Return mock implementation that matches the expected interface
  const mockData = [];
  
  return {
    sort: () => ({
      exec: async () => mockData
    }),
    exec: async () => mockData
  };
};

Feedback.findById = function(id) {
  console.log('Mock: Feedback.findById', id);
  return {
    exec: async () => null
  };
};

Feedback.findByIdAndUpdate = async function(id, update) {
  console.log('Mock: Feedback.findByIdAndUpdate', id, update);
  return null;
};

export default Feedback;
