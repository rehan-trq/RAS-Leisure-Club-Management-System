import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Check, X, RefreshCw, Calendar, Clock, Info } from 'lucide-react';
import { bookingAPI } from '@/utils/bookingApi';
import { toast } from 'sonner';

interface Booking {
  _id: string;
  activityName: string;
  date: string;
  timeSlot: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await bookingAPI.cancelBooking(booking._id);
      if (result.success) {
        toast.success('Booking canceled successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formattedDate = format(parseISO(booking.date), 'EEE, MMM d, yyyy');
  const isPastBooking = new Date(`${booking.date}T${booking.timeSlot}`) < new Date();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-medium">{booking.activityName}</h3>
            <Badge 
              variant="outline" 
              className={`mt-2 ${statusStyles[booking.status as keyof typeof statusStyles]}`}
            >
              {statusIcons[booking.status as keyof typeof statusIcons]}
              <span className="ml-1 capitalize">{booking.status}</span>
            </Badge>
          </div>
          {booking.status === 'confirmed' && !isPastBooking && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isLoading}
            >
              {isLoading ? 'Canceling...' : 'Cancel'}
            </Button>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{booking.timeSlot}</span>
          </div>
          {booking.notes && (
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5" />
              <span>{booking.notes}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
