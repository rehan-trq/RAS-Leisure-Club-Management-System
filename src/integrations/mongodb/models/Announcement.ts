
// Mock Announcement model using mock data instead of MongoDB
import mongoose from '../client';
import { mockAnnouncements } from '@/mocks/mockData';
import { connectToDatabase } from '../client';

// Try to connect to the database (mock connection)
connectToDatabase().catch(console.error);

// Define the schema structure for reference, but don't actually use it
const announcementSchema = {
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
};

// Create a mock Announcement model
const Announcement = {
  // Find method returns all mock data
  find: function() {
    console.log('Mock: Finding announcements');
    // Return the data and allow sort to be chained
    return {
      sort: function() {
        return mockAnnouncements;
      },
      // Allow exec to be called directly after find
      exec: async function() {
        return mockAnnouncements;
      }
    };
  },
  
  // Create method
  new: function(data: any) {
    return {
      save: async function() {
        const newAnnouncement = {
          _id: Math.random().toString(36).substr(2, 9),
          ...data,
          created_at: new Date(),
          updated_at: new Date()
        };
        mockAnnouncements.push(newAnnouncement);
        return newAnnouncement;
      }
    };
  }
};

export default Announcement;
