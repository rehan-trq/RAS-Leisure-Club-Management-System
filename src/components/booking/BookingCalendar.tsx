
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useBooking } from '@/contexts/BookingContext';

interface BookingCalendarProps {
  serviceId: string;
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  serviceId, 
  onDateSelect,
  selectedDate 
}) => {
  const { getBookingsByService } = useBooking();
  
  // This function would check if the date has any available slots
  const hasAvailableSlots = (date: Date): boolean => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const bookingsOnDate = getBookingsByService(serviceId).filter(
      booking => booking.date === formattedDate && booking.status === 'confirmed'
    );
    
    // For this example, assume each service can have 20 bookings per day
    return bookingsOnDate.length < 20;
  };

  // Disable past dates and dates with no available slots
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today || !hasAvailableSlots(date);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDays}
        className={cn("p-3 pointer-events-auto rounded-md border")}
        showOutsideDays={false}
      />
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Available dates</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span>Unavailable dates</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
