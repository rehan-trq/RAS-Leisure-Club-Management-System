
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { servicesData } from '@/data/servicesData';
import BookingCalendar from '@/components/booking/BookingCalendar';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { useBooking } from '@/contexts/BookingContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

const BookActivity = () => {
  const [selectedService, setSelectedService] = useState(servicesData[0]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { addBooking } = useBooking();

  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  const handleServiceChange = (serviceId: string) => {
    const service = servicesData.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setSelectedDate(undefined);
      setSelectedTime(null);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    addBooking({
      userId: 'user1', // In a real app, this would be the current user's ID
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      serviceImage: selectedService.image,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      status: 'confirmed'
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime(null);
    setIsConfirmationOpen(false);

    // Navigate to bookings page or show success message
    toast.success('Booking confirmed! You can view it in My Bookings.');
  };

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Book an Activity</h1>
            <p className="text-muted-foreground mb-8">Select a service, date, and time slot to book your next activity.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Services Selection */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-medium mb-4">Choose a Service</h2>
                <div className="space-y-3">
                  {servicesData.map((service) => (
                    <Card 
                      key={service.id} 
                      className={cn(
                        "cursor-pointer transition-all overflow-hidden",
                        selectedService.id === service.id && "ring-2 ring-primary"
                      )}
                      onClick={() => handleServiceChange(service.id)}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{service.title}</h3>
                          <p className="text-xs text-muted-foreground">{service.price}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="date" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="date">Date & Time</TabsTrigger>
                    <TabsTrigger value="details">Service Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="date" className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Select a Date</h3>
                        <BookingCalendar 
                          serviceId={selectedService.id}
                          selectedDate={selectedDate}
                          onDateSelect={handleDateSelect}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Select a Time</h3>
                        <TimeSlotPicker 
                          serviceId={selectedService.id}
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          onTimeSelect={handleTimeSelect}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        disabled={!canProceed}
                        className="px-8"
                        onClick={() => setIsConfirmationOpen(true)}
                      >
                        Proceed to Booking
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/3 rounded-md overflow-hidden">
                            <img 
                              src={selectedService.image} 
                              alt={selectedService.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <h2 className="text-2xl font-bold mb-2">{selectedService.title}</h2>
                            <p className="text-muted-foreground mb-4">{selectedService.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedService.duration && (
                                <div className="flex items-start gap-2">
                                  <div className="font-medium">Hours:</div>
                                  <div>{selectedService.duration}</div>
                                </div>
                              )}
                              
                              {selectedService.capacity && (
                                <div className="flex items-start gap-2">
                                  <div className="font-medium">Capacity:</div>
                                  <div>{selectedService.capacity}</div>
                                </div>
                              )}
                              
                              {selectedService.schedule && (
                                <div className="flex items-start gap-2">
                                  <div className="font-medium">Schedule:</div>
                                  <div>{selectedService.schedule}</div>
                                </div>
                              )}
                              
                              <div className="flex items-start gap-2">
                                <div className="font-medium">Price:</div>
                                <div>{selectedService.price}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BookingConfirmation 
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleBookingConfirm}
        serviceName={selectedService.title}
        serviceImage={selectedService.image}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
      
      <Footer />
    </div>
  );
};

export default BookActivity;
