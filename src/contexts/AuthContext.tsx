import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'staff' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isMember: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user data on page load
    const savedUser = authAPI.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const redirectBasedOnRole = (role: string) => {
    switch(role) {
      case 'admin':
        navigate('/admin-landing', { replace: true });
        break;
      case 'staff':
        navigate('/staff-landing', { replace: true });
        break;
      case 'member':
        navigate('/member-landing', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authAPI.login(email, password);
      
      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Successfully logged in!');
        redirectBasedOnRole(result.data.role);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate('/login', { replace: true });
    toast.success('Successfully logged out!');
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const result = await authAPI.signup(name, email, password, role);
      
      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Account created successfully!');
        redirectBasedOnRole(result.data.role);
      } else {
        throw new Error(result.error || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user && user.role === 'admin';
  const isStaff = !!user && user.role === 'staff';
  const isMember = !!user && user.role === 'member';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isStaff,
        isMember,
        login,
        signup,
        logout,
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
