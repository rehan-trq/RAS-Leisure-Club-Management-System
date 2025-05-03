
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    enum: ['all', 'members', 'staff'],
    default: 'all'
  },
  created_by: {
    type: String,
    required: true
  },
  expires_at: {
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

// Create a mock Announcement model
let Announcement;

try {
  // Try to get existing model or create a new one
  Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
} catch (error) {
  console.error('Error creating Announcement model:', error);
  // Create a minimal mock implementation if model creation fails
  Announcement = mongoose.model('Announcement', announcementSchema);
}

// Add static methods for mocking queries
Announcement.find = function(query = {}) {
  console.log('Mock: Announcement.find', query);
  
  // Return mock implementation that matches the expected interface
  const mockData = [];
  
  return {
    sort: () => mockData,
    exec: async () => mockData
  };
};

Announcement.findById = function(id) {
  console.log('Mock: Announcement.findById', id);
  return {
    exec: async () => null
  };
};

Announcement.findByIdAndUpdate = async function(id, update) {
  console.log('Mock: Announcement.findByIdAndUpdate', id, update);
  return null;
};

export default Announcement;
