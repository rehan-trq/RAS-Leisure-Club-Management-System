
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// More reliable way to check if model exists before creating
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

export default Announcement;
