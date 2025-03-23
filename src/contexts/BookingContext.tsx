import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  date: string;
  time: string;
  status: 'confirmed' | 'canceled' | 'rescheduled';
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  selectedService: any;
  setSelectedService: (service: any) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, newDate: string, newTime: string) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getBookingsByService: (serviceId: string) => Booking[];
  getBookingsByDate: (date: string) => Booking[];
  isSlotAvailable: (serviceId: string, date: string, time: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Mock data for demonstration
const generateMockBookings = (): Booking[] => {
  const mockBookings: Booking[] = [
    {
      id: '1',
      userId: 'user1',
      serviceId: '1',
      serviceName: 'Premium Swimming Pool',
      serviceImage: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=2070&auto=format&fit=crop',
      date: '2023-07-15',
      time: '10:00 AM',
      status: 'confirmed',
      createdAt: '2023-07-10T14:30:00Z'
    },
    {
      id: '2',
      userId: 'user1',
      serviceId: '5',
      serviceName: 'Yoga & Pilates Studio',
      serviceImage: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=2070&auto=format&fit=crop',
      date: '2023-07-18',
      time: '2:00 PM',
      status: 'canceled',
      createdAt: '2023-07-12T09:15:00Z'
    },
    {
      id: '3',
      userId: 'user2',
      serviceId: '4',
      serviceName: 'Professional Tennis Courts',
      serviceImage: 'https://images.unsplash.com/photo-1622279457486-28f3daa63871?q=80&w=2070&auto=format&fit=crop',
      date: '2023-07-20',
      time: '4:00 PM',
      status: 'confirmed',
      createdAt: '2023-07-14T11:45:00Z'
    }
  ];
  return mockBookings;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings');
    return savedBookings ? JSON.parse(savedBookings) : generateMockBookings();
  });
  
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    toast.success('Booking confirmed successfully!');
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id 
          ? { ...booking, status: 'canceled' } 
          : booking
      )
    );
    toast.info('Booking has been canceled');
  };

  const rescheduleBooking = (id: string, newDate: string, newTime: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id 
          ? { ...booking, date: newDate, time: newTime, status: 'rescheduled' } 
          : booking
      )
    );
    toast.success('Booking has been rescheduled');
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getBookingsByService = (serviceId: string) => {
    return bookings.filter(booking => booking.serviceId === serviceId);
  };

  const getBookingsByDate = (date: string) => {
    return bookings.filter(booking => booking.date === date);
  };

  const isSlotAvailable = (serviceId: string, date: string, time: string) => {
    const bookingsForSlot = bookings.filter(
      booking => 
        booking.serviceId === serviceId && 
        booking.date === date && 
        booking.time === time &&
        booking.status === 'confirmed'
    );
    
    // For this example, assume each service has a max capacity of 5 bookings per slot
    return bookingsForSlot.length < 5;
  };

  return (
    <BookingContext.Provider 
      value={{ 
        bookings, 
        selectedService,
        setSelectedService,
        addBooking, 
        cancelBooking, 
        rescheduleBooking, 
        getBookingsByUser, 
        getBookingsByService, 
        getBookingsByDate,
        isSlotAvailable
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
