
import mongoose from 'mongoose';
import { connectToDatabase } from '../client';

// Make sure we connect to the database before using models
connectToDatabase();

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  image_url: {
    type: String,
    default: null
  },
  capacity: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
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

// Check if model already exists to avoid overwriting
let Service;
try {
  Service = mongoose.model('Service');
} catch (error) {
  Service = mongoose.model('Service', serviceSchema);
}

export default Service;
