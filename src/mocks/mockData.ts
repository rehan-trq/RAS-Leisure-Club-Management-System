// Add or update the mock data to include all required models

// Mock Services
export const mockServices = [
  {
    _id: '1',
    name: 'Tennis Court',
    description: 'Professional tennis court with equipment rental available.',
    image_url: '/images/tennis.jpg',
    capacity: 4,
    duration: 60,
    price: 25,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    name: 'Swimming Pool',
    description: 'Olympic-sized swimming pool with lanes for lap swimming.',
    image_url: '/images/pool.jpg',
    capacity: 30,
    duration: 120,
    price: 15,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
    name: 'Fitness Center',
    description: 'State-of-the-art fitness equipment and personal trainers.',
    image_url: '/images/fitness.jpg',
    capacity: 20,
    duration: 90,
    price: 20,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Mock Maintenance Requests
export const mockMaintenanceRequests = [
  {
    _id: '1',
    facility: 'Tennis Court',
    issue: 'Net needs replacement',
    priority: 'medium',
    status: 'pending',
    reported_by: '1',
    assigned_to: '2',
    resolved_at: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    facility: 'Swimming Pool',
    issue: 'pH level is too high',
    priority: 'high',
    status: 'in_progress',
    reported_by: '2',
    assigned_to: '2',
    resolved_at: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
    facility: 'Fitness Center',
    issue: 'Treadmill #3 not working',
    priority: 'medium',
    status: 'pending',
    reported_by: '3',
    assigned_to: null,
    resolved_at: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '4',
    facility: 'Locker Room',
    issue: 'Shower #2 leaking',
    priority: 'low',
    status: 'resolved',
    reported_by: '1',
    assigned_to: '2',
    resolved_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Mock Announcements
export const mockAnnouncements = [
  {
    _id: '1',
    title: 'Summer Schedule Update',
    content: 'New summer hours will begin next month. Please check the schedule for details.',
    audience: 'all',
    created_by: '3',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    title: 'Pool Maintenance',
    content: 'The pool will be closed for maintenance on July 15th.',
    audience: 'members',
    created_by: '3',
    expires_at: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
    title: 'New Staff Training',
    content: 'All staff members must attend the training session on Friday.',
    audience: 'staff',
    created_by: '3',
    expires_at: null,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Update mock payments with additional fields
export const mockPayments = [
  {
    _id: '1',
    user_id: '1',
    amount: 50,
    payment_method: 'credit_card',
    status: 'completed',
    description: 'Monthly membership fee',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    user_id: '1',
    amount: 25,
    payment_method: 'credit_card',
    status: 'completed',
    description: 'Tennis court booking',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
    user_id: '2',
    amount: 100,
    payment_method: 'paypal',
    status: 'completed',
    description: 'Annual membership fee',
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Add other mock data as needed
