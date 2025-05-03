
// Mock MongoDB client for frontend-only version
import { toast } from 'sonner';

// Mock mongoose connection state
let isConnected = false;

// Mock connectToDatabase function - returns a successful promise
export const connectToDatabase = async () => {
  // Just pretend to connect without actually doing anything
  console.log('Mock: Connecting to database...');
  isConnected = true;
  return { readyState: 1 };
};

// Create a mock mongoose object with commonly used properties
const mongoose = {
  connection: {
    readyState: 1
  },
  Schema: class Schema {
    constructor(definition: any) {
      return definition;
    }
  },
  model: function(name: string, schema: any) {
    // Return a mock model constructor function
    return function MockModel(data: any) {
      this._id = data._id || Math.random().toString(36).substr(2, 9);
      Object.assign(this, data);
      
      // Mock save method
      this.save = async function() {
        console.log(`Mock: Saving ${name} model`);
        return this;
      };
    };
  },
  models: {},
  Types: {
    ObjectId: String
  }
};

export default mongoose;
