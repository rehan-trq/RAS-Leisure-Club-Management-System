
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const paymentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
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

// Create a mock Payment model
let Payment;

try {
  // Try to get existing model or create a new one
  Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
} catch (error) {
  console.error('Error creating Payment model:', error);
  // Create a minimal mock implementation if model creation fails
  Payment = mongoose.model('Payment', paymentSchema);
}

// Add static methods for mocking queries
Payment.find = function(query = {}) {
  console.log('Mock: Payment.find', query);
  
  // Return mock implementation that matches the expected interface
  const mockData = [];
  
  return {
    sort: () => mockData,
    exec: async () => mockData
  };
};

Payment.findById = function(id) {
  console.log('Mock: Payment.findById', id);
  return {
    exec: async () => null
  };
};

Payment.findByIdAndUpdate = async function(id, update) {
  console.log('Mock: Payment.findByIdAndUpdate', id, update);
  return null;
};

export default Payment;
