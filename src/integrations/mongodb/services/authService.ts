
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { connectToDatabase } from '../client';
import { AuthUser, UserRole } from '@/types/database';

const JWT_SECRET = 'your-jwt-secret-key'; // In production, this would be an environment variable

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  await connectToDatabase();
  
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid login credentials');
  }
  
  const token = jwt.sign({ 
    id: user._id,
    email: user.email,
    role: user.role 
  }, JWT_SECRET, { expiresIn: '7d' });
  
  const authUser: AuthUser = {
    id: user._id.toString(),
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
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser = new User({
    email,
    password, // Will be hashed by the pre-save hook
    full_name: fullName,
    role: 'member'
  });
  
  await newUser.save();
  
  const token = jwt.sign({ 
    id: newUser._id,
    email: newUser.email,
    role: newUser.role 
  }, JWT_SECRET, { expiresIn: '7d' });
  
  const authUser: AuthUser = {
    id: newUser._id.toString(),
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
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    
    if (!user) return null;
    
    return {
      id: user._id.toString(),
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
  
  const user = await User.findByIdAndUpdate(userId, {
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    updated_at: new Date()
  }, { new: true });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    id: user._id.toString(),
    email: user.email,
    full_name: user.full_name,
    name: user.full_name?.split(' ')[0] || user.email.split('@')[0],
    role: user.role as UserRole,
    avatar_url: user.avatar_url
  };
}

// Create demo accounts if they don't exist
export async function createDemoAccounts(): Promise<void> {
  await connectToDatabase();
  
  const demoAccounts = [
    { email: 'member@example.com', password: 'password123', full_name: 'Member User', role: 'member' },
    { email: 'staff@example.com', password: 'password123', full_name: 'Staff User', role: 'staff' },
    { email: 'admin@example.com', password: 'password123', full_name: 'Admin User', role: 'admin' }
  ];
  
  for (const account of demoAccounts) {
    const existingUser = await User.findOne({ email: account.email });
    if (!existingUser) {
      const password = await bcrypt.hash(account.password, 10);
      await User.create({
        ...account,
        password
      });
      console.log(`Created demo account: ${account.email}`);
    }
  }
}

// Call this function when the application starts
createDemoAccounts().catch(console.error);
