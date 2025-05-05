import api from './api';

export const bookingAPI = {
  createBooking: async (bookingData: {
    activityName: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create booking' 
      };
    }
  },

  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/me');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch bookings' 
      };
    }
  },

  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch bookings' 
      };
    }
  },

  cancelBooking: async (bookingId: string) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to cancel booking' 
      };
    }
  }
}; 