export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'member' | 'staff' | 'admin';
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'resolved';
export type MaintenancePriority = 'low' | 'medium' | 'high';
export type FeedbackStatus = 'new' | 'flagged' | 'responded' | 'archived';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  capacity: number;
  duration: number;
  price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  date: string;
  time_slot: string;
  status: 'confirmed' | 'canceled' | 'rescheduled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  facility: string;
  issue: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reported_by: string;
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: 'all' | 'members' | 'staff';
  created_by: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  payment_date: string;
  created_at: string;
}

export interface StaffSchedule {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  activity_type: string;
  facility: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FacilityCheckin {
  id: string;
  user_id: string;
  facility: string;
  check_in_time: string;
  check_out_time: string | null;
  notes: string | null;
}

export interface StaffAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_by: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  member_id: string;
  service_type: string;
  rating: number;
  comment: string;
  status: FeedbackStatus;
  staff_response?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface RefundRequest {
  id: string;
  customer_id: string;
  transaction_id: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  notes?: string;
  requested_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

// Extended Database type to include our custom tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
      };
      services: {
        Row: Service;
      };
      bookings: {
        Row: Booking;
      };
      maintenance_requests: {
        Row: MaintenanceRequest;
      };
      announcements: {
        Row: Announcement;
      };
      payments: {
        Row: Payment;
      };
      staff_schedules: {
        Row: StaffSchedule;
      };
      facility_checkins: {
        Row: FacilityCheckin;
      };
      staff_announcements: {
        Row: StaffAnnouncement;
      };
      member_feedback: {
        Row: Feedback;
      };
      refund_requests: {
        Row: RefundRequest;
      };
    };
  };
};
