
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          try {
            // Fetch the user's profile to get their role
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error('Error fetching user profile:', error);
              return;
            }
            
            const authUser = {
              id: session.user.id,
              email: session.user.email!,
              full_name: profile?.full_name,
              name: profile?.full_name?.split(' ')[0] || session.user.email!.split('@')[0],
              role: profile?.role || 'member',
              avatar_url: profile?.avatar_url
            };
            
            setUser(authUser);
            
            // Handle redirection based on role for login event
            if (event === 'SIGNED_IN') {
              redirectBasedOnRole(authUser.role);
            }
          } catch (error) {
            console.error('Error in auth state change handler:', error);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }
          
          const authUser = {
            id: session.user.id,
            email: session.user.email!,
            full_name: profile?.full_name,
            name: profile?.full_name?.split(' ')[0] || session.user.email!.split('@')[0],
            role: profile?.role || 'member',
            avatar_url: profile?.avatar_url
          };
          
          setUser(authUser);
          
          // Handle redirection based on role for existing session
          redirectBasedOnRole(authUser.role);
        } catch (error) {
          console.error('Error initializing auth:', error);
        }
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const redirectBasedOnRole = (role: UserRole) => {
    console.log('Redirecting based on role:', role);
    switch(role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'staff':
        navigate('/staff');
        break;
      case 'member':
        navigate('/member');
        break;
      default:
        navigate('/');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Successfully logged in!');
      // Let the auth state listener handle the redirect
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting signup with:', email, fullName);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'member' // Default role for new signups
          }
        }
      });

      if (error) throw error;

      toast.success('Account created successfully! You are now logged in.');
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
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

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
