
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { useBooking, Booking } from '@/contexts/BookingContext';
import BookingCard from '@/components/booking/BookingCard';
import { Search, CalendarClock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const MyBookings = () => {
  const { bookings } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user ID (in a real app, this would come from auth context)
  const userId = 'user1';
  
  // Filter bookings for the current user
  const userBookings = bookings.filter(booking => booking.userId === userId);
  
  // Filter bookings based on search query
  const filteredBookings = userBookings.filter(booking => 
    booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group bookings by status
  const confirmed = filteredBookings.filter(booking => booking.status === 'confirmed');
  const canceled = filteredBookings.filter(booking => booking.status === 'canceled');
  const rescheduled = filteredBookings.filter(booking => booking.status === 'rescheduled');
  
  // Sort bookings by date (newest first)
  const sortBookings = (bookings: Booking[]) => {
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground mb-8">Manage your upcoming and past activity bookings.</p>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search bookings..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4" />
                  All ({filteredBookings.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Confirmed ({confirmed.length})
                </TabsTrigger>
                <TabsTrigger value="canceled" className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" />
                  Canceled ({canceled.length})
                </TabsTrigger>
                <TabsTrigger value="rescheduled" className="flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" />
                  Rescheduled ({rescheduled.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {filteredBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortBookings(filteredBookings).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search query' : 'You haven\'t made any bookings yet'}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="confirmed" className="mt-6">
                {confirmed.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortBookings(confirmed).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">No confirmed bookings</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search query' : 'You don\'t have any confirmed bookings'}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="canceled" className="mt-6">
                {canceled.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortBookings(canceled).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <XCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">No canceled bookings</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search query' : 'You don\'t have any canceled bookings'}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="rescheduled" className="mt-6">
                {rescheduled.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortBookings(rescheduled).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">No rescheduled bookings</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search query' : 'You don\'t have any rescheduled bookings'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyBookings;
