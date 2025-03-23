
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useBooking, Booking } from '@/contexts/BookingContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  CalendarCheck,
  CalendarX,
  RefreshCw,
  LayoutGrid,
  LayoutList,
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import BookingCard from '@/components/booking/BookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { servicesData } from '@/data/servicesData';

const AdminBookings = () => {
  const { bookings, cancelBooking } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Apply all filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !dateFilter || booking.date === dateFilter;
    const matchesService = !serviceFilter || booking.serviceId === serviceFilter;
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesService && matchesStatus;
  });

  // Sort bookings by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelBooking(selectedBooking.id);
      setShowCancelDialog(false);
      setSelectedBooking(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 border">
            <CheckCircle className="mr-1 h-3 w-3" /> Confirmed
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 border">
            <XCircle className="mr-1 h-3 w-3" /> Canceled
          </Badge>
        );
      case 'rescheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
            <RefreshCw className="mr-1 h-3 w-3" /> Rescheduled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const resetFilters = () => {
    setDateFilter('');
    setServiceFilter('');
    setStatusFilter('');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage and monitor all bookings across the system.</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <Button 
                  variant={viewMode === 'table' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setViewMode('table')}
                  className="px-3"
                >
                  <LayoutList className="h-4 w-4 mr-1" /> Table
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" /> Grid
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                
                <div>
                  <Input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                  >
                    <option value="">All Services</option>
                    {servicesData.map(service => (
                      <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="canceled">Canceled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="text-muted-foreground">
                {filteredBookings.length} bookings found
              </div>
            </div>
            
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booked On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedBookings.length > 0 ? (
                      sortedBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.serviceName}</TableCell>
                          <TableCell>{booking.userId}</TableCell>
                          <TableCell>{format(parseISO(booking.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{format(parseISO(booking.createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="text-right">
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelDialog(true);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Grid View */}
            {viewMode === 'grid' && (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="confirmed" className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4" />
                    Confirmed
                  </TabsTrigger>
                  <TabsTrigger value="canceled" className="flex items-center gap-1.5">
                    <CalendarX className="h-4 w-4" />
                    Canceled
                  </TabsTrigger>
                  <TabsTrigger value="rescheduled" className="flex items-center gap-1.5">
                    <RefreshCw className="h-4 w-4" />
                    Rescheduled
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  {sortedBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="confirmed" className="mt-6">
                  {sortedBookings.filter(b => b.status === 'confirmed').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedBookings
                        .filter(b => b.status === 'confirmed')
                        .map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">No confirmed bookings</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="canceled" className="mt-6">
                  {sortedBookings.filter(b => b.status === 'canceled').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedBookings
                        .filter(b => b.status === 'canceled')
                        .map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarX className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">No canceled bookings</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rescheduled" className="mt-6">
                  {sortedBookings.filter(b => b.status === 'rescheduled').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedBookings
                        .filter(b => b.status === 'rescheduled')
                        .map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">No rescheduled bookings</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>
      
      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md overflow-hidden w-12 h-12">
                  <img 
                    src={selectedBooking.serviceImage} 
                    alt={selectedBooking.serviceName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedBooking.serviceName}</p>
                  <div className="text-sm text-muted-foreground">
                    {format(parseISO(selectedBooking.date), 'MMM d, yyyy')} at {selectedBooking.time}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminBookings;
