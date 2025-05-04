import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarCheck, Clock, Info, Loader2 } from 'lucide-react';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  serviceImage: string;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  isLoading: boolean;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  serviceImage,
  selectedDate,
  selectedTime,
  isLoading
}) => {
  if (!selectedDate || !selectedTime) return null;

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4">
            <div className="rounded-md overflow-hidden w-16 h-16 flex-shrink-0">
              <img 
                src={serviceImage} 
                alt={serviceName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{serviceName}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <CalendarCheck className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4" />
                <span>{selectedTime}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-accent/10 p-3 rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              By confirming this booking, you agree to our cancellation policy. Cancellations made 
              less than 24 hours before the scheduled time may incur a fee.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;
