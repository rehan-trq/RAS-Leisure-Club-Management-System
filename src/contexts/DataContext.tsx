import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { connectToDatabase } from '@/integrations/mongodb/client';
import Service from '@/integrations/mongodb/models/Service';
import Booking from '@/integrations/mongodb/models/Booking';
import MaintenanceRequest from '@/integrations/mongodb/models/MaintenanceRequest';
import Announcement from '@/integrations/mongodb/models/Announcement';
import type { Service as ServiceType, Booking as BookingType, MaintenanceRequest as MaintenanceRequestType, Announcement as AnnouncementType } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

interface DataContextType {
  // Services
  services: ServiceType[];
  isLoadingServices: boolean;
  
  // Bookings
  bookings: BookingType[];
  isLoadingBookings: boolean;
  createBooking: (booking: Omit<BookingType, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBooking: (id: string, status: BookingType['status']) => Promise<void>;
  
  // Maintenance
  maintenanceRequests: MaintenanceRequestType[];
  isLoadingMaintenance: boolean;
  createMaintenanceRequest: (request: Omit<MaintenanceRequestType, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) => Promise<void>;
  updateMaintenanceStatus: (id: string, status: MaintenanceRequestType['status']) => Promise<void>;
  
  // Announcements
  announcements: AnnouncementType[];
  isLoadingAnnouncements: boolean;
  createAnnouncement: (announcement: Omit<AnnouncementType, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  // Services queries - using mocked data
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        // Using mock connection
        await connectToDatabase();
        const services = Service.find().sort();
        return services.map(service => ({
          id: service._id.toString(),
          name: service.name,
          description: service.description,
          image_url: service.image_url,
          capacity: service.capacity,
          duration: service.duration,
          price: service.price,
          is_active: service.is_active,
          created_at: service.created_at.toISOString(),
          updated_at: service.updated_at.toISOString()
        })) as ServiceType[];
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    },
    enabled: true // Always enabled in frontend-only mode
  });

  // Bookings queries - using mock data
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      // For frontend-only app, return empty array or mock data
      console.log('Mock: Fetching bookings');
      return [];
    },
    enabled: true // Always enabled in frontend-only mode
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: Omit<BookingType, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock implementation
      console.log('Mock: Creating booking', bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully');
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingType['status'] }) => {
      // Mock implementation
      console.log('Mock: Updating booking', { id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking updated successfully');
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  });

  // Maintenance requests queries - using mock data
  const { data: maintenanceRequests = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      try {
        await connectToDatabase();
        const maintenance = MaintenanceRequest.find().sort({ created_at: -1 }).exec();
        return (await maintenance).map(request => ({
          id: request._id.toString(),
          facility: request.facility,
          issue: request.issue,
          priority: request.priority,
          status: request.status,
          reported_by: request.reported_by.toString(),
          assigned_to: request.assigned_to?.toString() || null,
          resolved_at: request.resolved_at?.toISOString() || null,
          created_at: request.created_at.toISOString(),
          updated_at: request.updated_at.toISOString()
        })) as MaintenanceRequestType[];
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        return [];
      }
    },
    enabled: true // Always enabled in frontend-only mode
  });

  const createMaintenanceRequestMutation = useMutation({
    mutationFn: async (requestData: Omit<MaintenanceRequestType, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) => {
      // Mock implementation
      console.log('Mock: Creating maintenance request', requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Maintenance request created successfully');
    },
    onError: (error) => {
      console.error('Error creating maintenance request:', error);
      toast.error('Failed to create maintenance request');
    }
  });

  const updateMaintenanceStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MaintenanceRequestType['status'] }) => {
      // Mock implementation
      console.log('Mock: Updating maintenance status', { id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Maintenance request updated successfully');
    },
    onError: (error) => {
      console.error('Error updating maintenance request:', error);
      toast.error('Failed to update maintenance request');
    }
  });

  // Announcements queries - using mock data
  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        await connectToDatabase();
        const anncs = Announcement.find().sort();
        return anncs.map(announcement => ({
          id: announcement._id.toString(),
          title: announcement.title,
          content: announcement.content,
          audience: announcement.audience,
          created_by: announcement.created_by.toString(),
          expires_at: announcement.expires_at?.toISOString() || null,
          created_at: announcement.created_at.toISOString(),
          updated_at: announcement.updated_at.toISOString()
        })) as AnnouncementType[];
      } catch (error) {
        console.error("Error fetching announcements:", error);
        return [];
      }
    },
    enabled: true // Always enabled in frontend-only mode
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: Omit<AnnouncementType, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock implementation
      console.log('Mock: Creating announcement', announcementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement created successfully');
    },
    onError: (error) => {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    }
  });

  const value = {
    // Services
    services,
    isLoadingServices,
    
    // Bookings
    bookings,
    isLoadingBookings,
    createBooking: createBookingMutation.mutateAsync,
    updateBooking: (id: string, status: BookingType['status']) => 
      updateBookingMutation.mutateAsync({ id, status }),
    
    // Maintenance
    maintenanceRequests,
    isLoadingMaintenance,
    createMaintenanceRequest: createMaintenanceRequestMutation.mutateAsync,
    updateMaintenanceStatus: (id: string, status: MaintenanceRequestType['status']) =>
      updateMaintenanceStatusMutation.mutateAsync({ id, status }),
    
    // Announcements
    announcements,
    isLoadingAnnouncements,
    createAnnouncement: createAnnouncementMutation.mutateAsync,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
