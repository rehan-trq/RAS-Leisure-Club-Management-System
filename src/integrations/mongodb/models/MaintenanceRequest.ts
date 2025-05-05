
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const maintenanceRequestSchema = new mongoose.Schema({
  facility: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  reported_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String,
    default: null
  },
  resolved_at: {
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

// Create a mock MaintenanceRequest model
let MaintenanceRequest;

try {
  // Try to get existing model or create a new one
  MaintenanceRequest = mongoose.models.MaintenanceRequest || 
                      mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
} catch (error) {
  console.error('Error creating MaintenanceRequest model:', error);
  // Create a minimal mock implementation if model creation fails
  MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
}

// Add static methods for mocking queries
MaintenanceRequest.find = function(query = {}) {
  console.log('Mock: MaintenanceRequest.find', query);
  
  // Return mock implementation that matches the expected interface
  const mockData = [];
  
  return {
    sort: () => ({
      limit: (limit) => mockData,
      exec: async () => mockData
    }),
    exec: async () => mockData
  };
};

MaintenanceRequest.findById = function(id) {
  console.log('Mock: MaintenanceRequest.findById', id);
  return {
    exec: async () => null
  };
};

MaintenanceRequest.findByIdAndUpdate = async function(id, update) {
  console.log('Mock: MaintenanceRequest.findByIdAndUpdate', id, update);
  if (update.status) {
    console.log(`Mock: Updating maintenance request ${id} status to ${update.status}`);
  }
  return null;
};

export default MaintenanceRequest;
