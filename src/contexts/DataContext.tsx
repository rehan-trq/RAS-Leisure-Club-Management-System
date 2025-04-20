
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Service, Booking, MaintenanceRequest, Announcement } from '@/types/database';

interface DataContextType {
  // Services
  services: Service[];
  isLoadingServices: boolean;
  
  // Bookings
  bookings: Booking[];
  isLoadingBookings: boolean;
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBooking: (id: string, status: Booking['status']) => Promise<void>;
  
  // Maintenance
  maintenanceRequests: MaintenanceRequest[];
  isLoadingMaintenance: boolean;
  createMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) => Promise<void>;
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status']) => Promise<void>;
  
  // Announcements
  announcements: Announcement[];
  isLoadingAnnouncements: boolean;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Services queries
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Service[];
    }
  });

  // Bookings queries
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    }
  });

  const createBookingMutation = useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('bookings')
        .insert([booking]);
      
      if (error) throw error;
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
    mutationFn: async ({ id, status }: { id: string; status: Booking['status'] }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
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

  // Maintenance requests queries
  const { data: maintenanceRequests = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceRequest[];
    }
  });

  const createMaintenanceRequestMutation = useMutation({
    mutationFn: async (request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) => {
      const { error } = await supabase
        .from('maintenance_requests')
        .insert([request]);
      
      if (error) throw error;
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
    mutationFn: async ({ id, status }: { id: string; status: MaintenanceRequest['status'] }) => {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null 
        })
        .eq('id', id);
      
      if (error) throw error;
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

  // Announcements queries
  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Announcement[];
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('announcements')
        .insert([announcement]);
      
      if (error) throw error;
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
    updateBooking: (id: string, status: Booking['status']) => 
      updateBookingMutation.mutateAsync({ id, status }),
    
    // Maintenance
    maintenanceRequests,
    isLoadingMaintenance,
    createMaintenanceRequest: createMaintenanceRequestMutation.mutateAsync,
    updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status']) =>
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
