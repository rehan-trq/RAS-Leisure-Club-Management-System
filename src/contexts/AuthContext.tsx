
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Initialize Supabase client
const supabase = createClient(
  supabaseUrl || '', // Provide fallback empty string to prevent runtime errors
  supabaseAnonKey || '' // Provide fallback empty string to prevent runtime errors
);

export type UserRole = 'member' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isMember: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      toast.error('Supabase environment variables are missing. Please set them up properly.');
      return;
    }

    // Check active session on load
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              role: profile.role
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Failed to initialize authentication. Please check your Supabase configuration.');
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              role: profile.role
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authUser) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.role !== role) {
          await supabase.auth.signOut();
          throw new Error('Invalid role for this user');
        }

        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: profile.name,
          role: profile.role
        });

        // Redirect based on role
        switch (role) {
          case 'member':
            navigate('/member');
            break;
          case 'staff':
            navigate('/staff');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
        
        toast.success(`Welcome back, ${profile.name}!`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
    toast.info('You have been logged out.');
  };

  // Check if user has permissions for specific roles
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
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
        logout,
        hasPermission
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
