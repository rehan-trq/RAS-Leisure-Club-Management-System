
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
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  reported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// More reliable way to check if model exists before creating
const MaintenanceRequest = mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

export default MaintenanceRequest;
