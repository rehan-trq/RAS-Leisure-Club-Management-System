
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// More reliable way to check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
