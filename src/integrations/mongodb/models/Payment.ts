
// Mock Payment model for frontend-only app
import { mockPayments } from '@/mocks/mockData';
import { connectToDatabase } from '../client';

// Connect to the database (mock connection)
connectToDatabase().catch(console.error);

// Define the Payment model with mock implementation
const Payment = {
  // Find method returns all mock data
  find: function() {
    console.log('Mock: Finding payments');
    return {
      sort: function() {
        return mockPayments;
      },
      exec: function() {
        return Promise.resolve(mockPayments);
      }
    };
  },
  
  // FindByUserId method
  findByUserId: function(userId: string) {
    const payments = mockPayments.filter(p => p.user_id === userId);
    return {
      sort: function() {
        return payments;
      },
      exec: function() {
        return Promise.resolve(payments);
      }
    };
  },
  
  // Create method for creating new payments
  create: function(data: any) {
    const newPayment = {
      _id: (mockPayments.length + 1).toString(),
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    mockPayments.push(newPayment);
    return Promise.resolve(newPayment);
  }
};

export default Payment;
