
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'member' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isStaff: boolean;
  isMember: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Determine role based on email for demo purposes
      let role: UserRole = 'member';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('staff')) {
        role = 'staff';
      }

      // Create mock user without authentication
      const mockUser: AuthUser = {
        id: crypto.randomUUID(),
        email,
        full_name: email.split('@')[0],
        name: email.split('@')[0],
        role,
        avatar_url: null
      };

      setUser(mockUser);
      toast.success('Successfully logged in!');
      
      // Navigate based on role
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'staff':
          navigate('/staff');
          break;
        default:
          navigate('/member');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please check your email and password.');
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const mockUser: AuthUser = {
        id: crypto.randomUUID(),
        email,
        full_name: fullName,
        name: fullName,
        role: 'member',
        avatar_url: null
      };

      setUser(mockUser);
      toast.success('Successfully signed up!');
      navigate('/member');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    navigate('/login');
    toast.success('Successfully logged out');
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const isAdmin = !!user && user.role === 'admin';
  const isStaff = !!user && user.role === 'staff';
  const isMember = !!user && user.role === 'member';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isStaff,
        isMember,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
