
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Simplified fetch user profile function
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (profile) {
        // Set user with defaults for any missing fields
        setUser({
          id: userId,
          email: session?.user?.email || '',
          full_name: profile.full_name || null,
          name: profile.full_name || null,
          role: profile.role || 'member',
          avatar_url: profile.avatar_url || null
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Don't toast errors here as it can be disruptive during initial load
    }
  };

  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state change:', event);
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Use setTimeout to prevent Supabase Auth deadlock
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        throw error;
      }
      
      toast.success('Successfully logged in!');
      navigate('/');
      return data;
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please check your email and password.');
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast.success('Successfully signed up! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
      toast.success('Successfully logged out');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Failed to log out');
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
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
        session,
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
