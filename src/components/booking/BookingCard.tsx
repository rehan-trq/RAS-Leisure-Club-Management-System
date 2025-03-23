
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, Check, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { Booking, useBooking } from '@/contexts/BookingContext';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { cancelBooking } = useBooking();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const statusIcons = {
    confirmed: <Check className="h-4 w-4" />,
    canceled: <X className="h-4 w-4" />,
    rescheduled: <RefreshCw className="h-4 w-4" />
  };

  const statusStyles = {
    confirmed: "bg-green-100 text-green-800 border-green-200",
    canceled: "bg-red-100 text-red-800 border-red-200",
    rescheduled: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const handleCancel = () => {
    cancelBooking(booking.id);
    setIsDeleteDialogOpen(false);
  };

  const formattedDate = format(parseISO(booking.date), 'EEE, MMM d, yyyy');
  const isPastBooking = new Date(`${booking.date}T${booking.time}`) < new Date();

  return (
    <>
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        booking.status === 'canceled' && "opacity-70"
      )}>
        <div className="relative h-40 overflow-hidden">
          <img 
            src={booking.serviceImage} 
            alt={booking.serviceName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg">{booking.serviceName}</h3>
            <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Clock className="h-4 w-4" />
              <span>{booking.time}</span>
            </div>
          </div>
          
          <Badge className={cn(
            "absolute top-2 right-2 border",
            statusStyles[booking.status]
          )}>
            <span className="flex items-center gap-1">
              {statusIcons[booking.status]}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              Booked on {format(parseISO(booking.createdAt), 'MMM d, yyyy')}
            </div>
            
            {booking.status === 'confirmed' && !isPastBooking && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Cancel
              </Button>
            )}
            
            {isPastBooking && booking.status === 'confirmed' && (
              <Badge variant="outline" className="bg-gray-100">
                Completed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking for {booking.serviceName} on {formattedDate} at {booking.time}?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Cancellations made less than 24 hours before the scheduled time may incur a fee according to our cancellation policy.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancel}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingCard;
