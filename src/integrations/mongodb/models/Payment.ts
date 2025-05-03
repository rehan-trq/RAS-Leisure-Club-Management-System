
// Mock Payment model using mock data instead of MongoDB
import mongoose from '../client';
import { mockPayments } from '@/mocks/mockData';
import { connectToDatabase } from '../client';

// Try to connect to the database (mock connection)
connectToDatabase().catch(console.error);

// Define the schema structure for reference, but don't actually use it
const paymentSchema = {
  user_id: {
    type: String,
    required: true
  },
  plan_name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    required: true
  },
  payment_date: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
};

// Create a mock Payment model
const Payment = {
  // Find method returns all mock data
  find: async function(query = {}) {
    console.log('Mock: Finding payments with query:', query);
    
    // Filter by user_id if provided
    let filteredPayments = [...mockPayments];
    if (query.user_id) {
      filteredPayments = filteredPayments.filter(payment => payment.user_id === query.user_id);
    }
    
    // Return the data and allow sort to be chained
    return {
      sort: function() {
        return filteredPayments;
      },
      // Allow exec to be called directly after find
      exec: async function() {
        return filteredPayments;
      }
    };
  }
};

export default Payment;
