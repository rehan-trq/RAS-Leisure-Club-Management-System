
// Mock MaintenanceRequest model for frontend-only app
import { mockMaintenanceRequests } from '@/mocks/mockData';
import { connectToDatabase } from '../client';

// Connect to the database (mock connection)
connectToDatabase().catch(console.error);

// Define the MaintenanceRequest model with mock implementation
const MaintenanceRequest = {
  // Find method returns all mock data
  find: function() {
    console.log('Mock: Finding maintenance requests');
    return {
      sort: function() {
        return {
          limit: function(limit: number) {
            return mockMaintenanceRequests.slice(0, limit);
          },
          exec: function() {
            return Promise.resolve(mockMaintenanceRequests);
          }
        };
      },
      exec: function() {
        return Promise.resolve(mockMaintenanceRequests);
      }
    };
  },
  
  // FindById method for finding a specific maintenance request
  findById: function(id: string) {
    const request = mockMaintenanceRequests.find(req => req._id === id);
    return Promise.resolve(request);
  },

  // FindByIdAndUpdate for updating a maintenance request
  findByIdAndUpdate: function(id: string, updateData: any) {
    const index = mockMaintenanceRequests.findIndex(req => req._id === id);
    
    if (index !== -1) {
      mockMaintenanceRequests[index] = {
        ...mockMaintenanceRequests[index],
        ...updateData,
        _id: mockMaintenanceRequests[index]._id // Preserve the ID
      };
      return Promise.resolve(mockMaintenanceRequests[index]);
    }
    
    return Promise.resolve(null);
  }
};

export default MaintenanceRequest;
