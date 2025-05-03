
// Mock MaintenanceRequest model using mock data instead of MongoDB
import mongoose from '../client';
import { mockMaintenanceRequests } from '@/mocks/mockData';
import { connectToDatabase } from '../client';

// Try to connect to the database (mock connection)
connectToDatabase().catch(console.error);

// Define the schema structure for reference, but don't actually use it with MongoDB
const maintenanceRequestSchema = {
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
    required: true
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
};

// Create a mock MaintenanceRequest model
const MaintenanceRequest = {
  // Find method returns all mock data
  find: async function(query = {}) {
    console.log('Mock: Finding maintenance requests with query:', query);
    
    // Filter the mock data based on the query
    let filteredRequests = [...mockMaintenanceRequests];
    
    // Filter by status if provided
    if (query.status) {
      filteredRequests = filteredRequests.filter(req => req.status === query.status);
    }
    
    // Sort method to be chainable
    return {
      sort: function() {
        // Return the data and allow limit to be chained
        return {
          limit: function(limit: number) {
            return filteredRequests.slice(0, limit);
          },
          // If no limit, return all data
          exec: async function() {
            return filteredRequests;
          }
        };
      },
      // Allow exec to be called directly after find
      exec: async function() {
        return filteredRequests;
      }
    };
  },
  
  // FindById method
  findById: async function(id: string) {
    console.log('Mock: Finding maintenance request by ID:', id);
    return mockMaintenanceRequests.find(req => req._id === id) || null;
  },
  
  // FindByIdAndUpdate method
  findByIdAndUpdate: async function(id: string, updateData: any) {
    console.log('Mock: Updating maintenance request:', id, updateData);
    
    const requestIndex = mockMaintenanceRequests.findIndex(req => req._id === id);
    if (requestIndex !== -1) {
      // Update the request
      mockMaintenanceRequests[requestIndex] = {
        ...mockMaintenanceRequests[requestIndex],
        ...updateData,
        updated_at: new Date()
      };
      return mockMaintenanceRequests[requestIndex];
    }
    return null;
  }
};

export default MaintenanceRequest;
