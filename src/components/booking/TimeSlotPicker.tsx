
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { format } from 'date-fns';

interface TimeSlotPickerProps {
  serviceId: string;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  serviceId,
  selectedDate,
  selectedTime,
  onTimeSelect
}) => {
  const { isSlotAvailable } = useBooking();

  // Generate time slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
  });

  const checkAvailability = (time: string): boolean => {
    if (!selectedDate) return false;
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return isSlotAvailable(serviceId, formattedDate, time);
  };

  if (!selectedDate) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm text-center">
        <Clock className="mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Select a date to view available time slots</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {timeSlots.map((time) => {
          const isAvailable = checkAvailability(time);
          return (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={cn(
                "justify-start px-3",
                !isAvailable && "opacity-50 cursor-not-allowed"
              )}
              disabled={!isAvailable}
              onClick={() => isAvailable && onTimeSelect(time)}
            >
              <Clock className="mr-2 h-4 w-4" />
              {time}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
