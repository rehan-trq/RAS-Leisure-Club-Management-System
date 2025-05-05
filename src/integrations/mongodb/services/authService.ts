
import { AuthUser, UserRole } from '@/types/database';
import { connectToDatabase } from '../client';

// Mock user data for frontend-only authentication
const mockUsers = [
  {
    _id: '1',
    email: 'member@example.com',
    password: 'password123',
    full_name: 'Member User',
    role: 'member' as UserRole,
    avatar_url: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    email: 'staff@example.com',
    password: 'password123',
    full_name: 'Staff User',
    role: 'staff' as UserRole,
    avatar_url: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
    email: 'admin@example.com',
    password: 'password123',
    full_name: 'Admin User',
    role: 'admin' as UserRole,
    avatar_url: null,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// Simple token generation for frontend-only auth
const generateToken = (userId: string, email: string, role: UserRole): string => {
  // Create a simple encoded token with user information
  const payload = { id: userId, email, role };
  return btoa(JSON.stringify(payload)); // Base64 encode for simple token
};

// Simple token verification for frontend-only auth
const verifyToken = (token: string): { id: string; email: string; role: UserRole } | null => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  await connectToDatabase();
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  if (user.password !== password) {
    throw new Error('Invalid login credentials');
  }
  
  const token = generateToken(user._id, user.email, user.role);
  
  const authUser: AuthUser = {
    id: user._id,
    email: user.email,
    full_name: user.full_name,
    name: user.full_name?.split(' ')[0] || user.email.split('@')[0],
    role: user.role as UserRole,
    avatar_url: user.avatar_url
  };
  
  return { user: authUser, token };
}

export async function signup(email: string, password: string, fullName: string): Promise<LoginResponse> {
  await connectToDatabase();
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser = {
    _id: (mockUsers.length + 1).toString(),
    email,
    password, // In a real app, this would be hashed
    full_name: fullName,
    role: 'member' as UserRole,
    avatar_url: null,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  // Add to mock users array
  mockUsers.push(newUser);
  
  const token = generateToken(newUser._id, newUser.email, newUser.role);
  
  const authUser: AuthUser = {
    id: newUser._id,
    email: newUser.email,
    full_name: newUser.full_name,
    name: newUser.full_name?.split(' ')[0] || newUser.email.split('@')[0],
    role: newUser.role as UserRole,
    avatar_url: null
  };
  
  return { user: authUser, token };
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  if (!token) return null;
  
  try {
    await connectToDatabase();
    
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    const user = mockUsers.find(u => u._id === decoded.id);
    
    if (!user) return null;
    
    return {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      name: user.full_name?.split(' ')[0] || user.email.split('@')[0],
      role: user.role as UserRole,
      avatar_url: user.avatar_url
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
  await connectToDatabase();
  
  const userIndex = mockUsers.findIndex(u => u._id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update the user in our mock data
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    full_name: data.full_name || mockUsers[userIndex].full_name,
    avatar_url: data.avatar_url || mockUsers[userIndex].avatar_url,
    updated_at: new Date()
  };
  
  const user = mockUsers[userIndex];
  
  return {
    id: user._id,
    email: user.email,
    full_name: user.full_name,
    name: user.full_name?.split(' ')[0] || user.email.split('@')[0],
    role: user.role as UserRole,
    avatar_url: user.avatar_url
  };
}

// Initialize demo accounts on import
// No need to call this function as the mock data is already defined
export async function createDemoAccounts(): Promise<void> {
  console.log('Mock accounts already loaded');
  return Promise.resolve();
}
