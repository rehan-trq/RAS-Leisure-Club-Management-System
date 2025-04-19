
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
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'resolved';
  reported_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: 'all' | 'staff' | 'members';
  created_by: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}
