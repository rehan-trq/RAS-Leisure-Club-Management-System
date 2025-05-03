
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const refundRequestSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: null
  },
  requested_at: {
    type: Date,
    default: Date.now
  },
  processed_at: {
    type: Date,
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

// Create a mock RefundRequest model
let RefundRequest;

// More reliable way to check if model exists before creating
try {
  // Try to get existing model or create a new one
  RefundRequest = mongoose.models.RefundRequest || mongoose.model('RefundRequest', refundRequestSchema);
} catch (error) {
  console.error('Error creating RefundRequest model:', error);
  // Create a minimal mock implementation if model creation fails
  RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);
}

// Add static methods for mocking queries
RefundRequest.find = function(query = {}) {
  console.log('Mock: RefundRequest.find', query);
  
  // Return mock implementation that matches the expected interface
  const mockData = [];
  
  return {
    sort: () => mockData,
    exec: async () => mockData
  };
};

RefundRequest.findById = function(id) {
  console.log('Mock: RefundRequest.findById', id);
  return {
    exec: async () => null
  };
};

RefundRequest.findByIdAndUpdate = async function(id, update) {
  console.log('Mock: RefundRequest.findByIdAndUpdate', id, update);
  return null;
};

export default RefundRequest;
