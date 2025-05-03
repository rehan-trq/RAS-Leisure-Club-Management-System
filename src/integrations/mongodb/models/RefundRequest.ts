
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Try to connect to the database
connectToDatabase().catch(console.error);

const refundRequestSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: null
  },
  requested_at: {
    type: Date,
    default: Date.now
  },
  processed_at: {
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
const RefundRequest = mongoose.models.RefundRequest || mongoose.model('RefundRequest', refundRequestSchema);

export default RefundRequest;
