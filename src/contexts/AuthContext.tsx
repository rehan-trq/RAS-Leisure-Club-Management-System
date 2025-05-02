
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { login as authLogin, signup as authSignup, getCurrentUser, updateUserProfile } from '@/integrations/mongodb/services/authService';
import type { AuthUser, UserRole } from '@/types/database';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved token and authenticate user on page load
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        
        if (savedToken) {
          const currentUser = await getCurrentUser(savedToken);
          
          if (currentUser) {
            setUser(currentUser);
            setToken(savedToken);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const redirectBasedOnRole = (role: UserRole) => {
    console.log('Redirecting based on role:', role);
    switch(role) {
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'staff':
        navigate('/staff', { replace: true });
        break;
      case 'member':
        navigate('/member', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authLogin(email, password);
      
      setUser(user);
      setToken(token);
      
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      
      toast.success('Successfully logged in!');
      
      // Redirect based on user role
      redirectBasedOnRole(user.role);
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { user, token } = await authSignup(email, password, fullName);
      
      setUser(user);
      setToken(token);
      
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      
      toast.success('Account created successfully! You are now logged in.');
      
      // Redirect to member dashboard for new users
      redirectBasedOnRole('member');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      
      navigate('/login');
      toast.success('Successfully logged out');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Failed to log out');
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user?.id || !token) throw new Error('No user logged in');

      const updatedUser = await updateUserProfile(user.id, data);
      
      setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
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
        token,
        isAuthenticated,
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
