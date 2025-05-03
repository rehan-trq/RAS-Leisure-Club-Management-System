
// Mock data to replace MongoDB data

export interface MockMaintenanceRequest {
  _id: string;
  facility: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  reported_by: string;
  assigned_to: string | null;
  resolved_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface MockService {
  _id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  capacity: number;
  duration: number;
  price: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MockAnnouncement {
  _id: string;
  title: string;
  content: string;
  audience: 'all' | 'members' | 'staff';
  created_by: string;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface MockPayment {
  _id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  payment_date: Date;
  created_at: Date;
}

// Mock maintenance requests
export const mockMaintenanceRequests: MockMaintenanceRequest[] = [
  {
    _id: '1',
    facility: 'Swimming Pool',
    issue: 'Water temperature too low',
    priority: 'medium',
    status: 'pending',
    reported_by: '123',
    assigned_to: null,
    resolved_at: null,
    created_at: new Date('2025-04-30T10:00:00'),
    updated_at: new Date('2025-04-30T10:00:00')
  },
  {
    _id: '2',
    facility: 'Gym',
    issue: 'Treadmill not working',
    priority: 'high',
    status: 'in_progress',
    reported_by: '124',
    assigned_to: '456',
    resolved_at: null,
    created_at: new Date('2025-04-29T15:30:00'),
    updated_at: new Date('2025-04-29T16:45:00')
  },
  {
    _id: '3',
    facility: 'Tennis Court',
    issue: 'Net needs replacement',
    priority: 'low',
    status: 'resolved',
    reported_by: '125',
    assigned_to: '456',
    resolved_at: new Date('2025-04-28T14:00:00'),
    created_at: new Date('2025-04-27T09:15:00'),
    updated_at: new Date('2025-04-28T14:00:00')
  }
];

// Mock services
export const mockServices: MockService[] = [
  {
    _id: '1',
    name: 'Swimming Lessons',
    description: 'Professional swimming lessons for all ages and levels',
    image_url: '/placeholder.svg',
    capacity: 10,
    duration: 60,
    price: 30,
    is_active: true,
    created_at: new Date('2025-01-15'),
    updated_at: new Date('2025-01-15')
  },
  {
    _id: '2',
    name: 'Yoga Class',
    description: 'Relaxing yoga sessions with experienced instructors',
    image_url: '/placeholder.svg',
    capacity: 15,
    duration: 90,
    price: 25,
    is_active: true,
    created_at: new Date('2025-01-10'),
    updated_at: new Date('2025-01-10')
  }
];

// Mock announcements
export const mockAnnouncements: MockAnnouncement[] = [
  {
    _id: '1',
    title: 'Facility Closure',
    content: 'The swimming pool will be closed for maintenance on May 10, 2025.',
    audience: 'all',
    created_by: '456',
    expires_at: new Date('2025-05-11'),
    created_at: new Date('2025-05-01'),
    updated_at: new Date('2025-05-01')
  },
  {
    _id: '2',
    title: 'New Yoga Class',
    content: 'We are excited to announce a new yoga class starting next week!',
    audience: 'members',
    created_by: '456',
    expires_at: null,
    created_at: new Date('2025-04-28'),
    updated_at: new Date('2025-04-28')
  }
];

// Mock payments
export const mockPayments: MockPayment[] = [
  {
    _id: '1',
    user_id: '123',
    plan_name: 'Premium Membership',
    amount: 89.99,
    status: 'completed',
    payment_method: 'Credit Card',
    payment_date: new Date('2025-04-01'),
    created_at: new Date('2025-04-01')
  },
  {
    _id: '2',
    user_id: '123',
    plan_name: 'Swimming Class',
    amount: 45.00,
    status: 'completed',
    payment_method: 'PayPal',
    payment_date: new Date('2025-03-15'),
    created_at: new Date('2025-03-15')
  }
];
