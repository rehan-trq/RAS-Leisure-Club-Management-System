import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  XCircle,
  Clock,
  Info
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { bookingAPI } from '@/utils/bookingApi';
import { toast } from 'sonner';

interface Booking {
  _id: string;
  activityName: string;
  date: string;
  timeSlot: string;
  status: string;
  memberName: string;
  memberEmail: string;
  notes?: string;
  createdAt: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await bookingAPI.getAllBookings();
        if (result.success) {
          setBookings(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Apply all filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.memberEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !dateFilter || booking.date === dateFilter;
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Sort bookings by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.timeSlot}`);
    const dateB = new Date(`${b.date}T${b.timeSlot}`);
    return dateB.getTime() - dateA.getTime();
  });

  const handleCancelBooking = async () => {
    if (selectedBooking) {
      try {
        const result = await bookingAPI.cancelBooking(selectedBooking._id);
        if (result.success) {
          setBookings(prev => 
            prev.map(booking => 
              booking._id === selectedBooking._id 
                ? { ...booking, status: 'canceled' } 
                : booking
            )
          );
          toast.success('Booking canceled successfully');
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to cancel booking');
      } finally {
        setShowCancelDialog(false);
        setSelectedBooking(null);
      }
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
    setStatusFilter('');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading bookings...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Bookings</h1>
                <p className="text-muted-foreground">View and manage all member bookings.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <TableHead>Activity</TableHead>
                      <TableHead>Member</TableHead>
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
                        <TableRow key={booking._id}>
                          <TableCell className="font-medium">{booking.activityName}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.memberName}</div>
                              <div className="text-sm text-muted-foreground">{booking.memberEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{format(parseISO(booking.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{booking.timeSlot}</TableCell>
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
                        <div key={booking._id} className="bg-white rounded-lg shadow-sm border p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-medium">{booking.activityName}</h3>
                              <div className="mt-2">
                                <div className="font-medium">{booking.memberName}</div>
                                <div className="text-sm text-muted-foreground">{booking.memberEmail}</div>
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
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
                          {booking.status === 'confirmed' && (
                            <div className="mt-4 flex justify-end">
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
                            </div>
                          )}
                        </div>
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
                          <div key={booking._id} className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-medium">{booking.activityName}</h3>
                                <div className="mt-2">
                                  <div className="font-medium">{booking.memberName}</div>
                                  <div className="text-sm text-muted-foreground">{booking.memberEmail}</div>
                                </div>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
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
                            <div className="mt-4 flex justify-end">
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
                            </div>
                          </div>
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
                          <div key={booking._id} className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-medium">{booking.activityName}</h3>
                                <div className="mt-2">
                                  <div className="font-medium">{booking.memberName}</div>
                                  <div className="text-sm text-muted-foreground">{booking.memberEmail}</div>
                                </div>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
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
                          </div>
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
                          <div key={booking._id} className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-medium">{booking.activityName}</h3>
                                <div className="mt-2">
                                  <div className="font-medium">{booking.memberName}</div>
                                  <div className="text-sm text-muted-foreground">{booking.memberEmail}</div>
                                </div>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
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
                          </div>
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
                <div>
                  <p className="font-medium">{selectedBooking.activityName}</p>
                  <div className="text-sm text-muted-foreground">
                    {format(parseISO(selectedBooking.date), 'MMM d, yyyy')} at {selectedBooking.timeSlot}
                  </div>
                  <div className="mt-2">
                    <div className="font-medium">{selectedBooking.memberName}</div>
                    <div className="text-sm text-muted-foreground">{selectedBooking.memberEmail}</div>
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
