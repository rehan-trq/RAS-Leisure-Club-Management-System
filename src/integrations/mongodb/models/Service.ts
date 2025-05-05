
// Mock Service model using mock data instead of MongoDB
import mongoose from '../client';
import { mockServices } from '@/mocks/mockData';
import { connectToDatabase } from '../client';

// Try to connect to the database (mock connection)
connectToDatabase().catch(console.error);

// Define the schema structure for reference, but don't actually use it
const serviceSchema = {
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  image_url: {
    type: String,
    default: null
  },
  capacity: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
};

// Create a mock Service model
const Service = {
  // Find method returns all mock data
  find: function() {
    console.log('Mock: Finding services');
    // Return the data and allow sort to be chained
    return {
      sort: function() {
        return mockServices;
      },
      // Allow exec to be called directly after find
      exec: async function() {
        return mockServices;
      }
    };
  }
};

export default Service;
