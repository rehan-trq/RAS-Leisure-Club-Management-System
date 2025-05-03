
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/types/database';

// Ensure we connect to the database before using the model
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['member', 'staff', 'admin'],
    default: 'member'
  },
  avatar_url: {
    type: String,
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

// Mock password hashing in browser environment
userSchema.pre = function(event, callback) {
  if (event === 'save') {
    const mockNext = () => {};
    callback.call(this, mockNext);
  }
};

// Create a mock User model
let User;

// More reliable way to check if model exists before creating
// In browser environment, we need to handle this differently
try {
  // Try to get existing model or create a new one
  User = mongoose.models.User || mongoose.model('User', userSchema);
} catch (error) {
  console.error('Error creating User model:', error);
  // Create a minimal mock implementation if model creation fails
  User = mongoose.model('User', userSchema);
}

export default User;
