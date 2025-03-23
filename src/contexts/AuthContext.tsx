
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'member' | 'staff' | 'admin';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Auth context type
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

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers = [
  {
    id: 'user1',
    email: 'member@example.com',
    name: 'John Member',
    password: 'password123',
    role: 'member' as UserRole
  },
  {
    id: 'user2',
    email: 'staff@example.com',
    name: 'Jane Staff',
    password: 'password123',
    role: 'staff' as UserRole
  },
  {
    id: 'user3',
    email: 'admin@example.com',
    name: 'Alex Admin',
    password: 'password123',
    role: 'admin' as UserRole
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const navigate = useNavigate();

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Computed properties for role checks
  const isAuthenticated = !!user;
  const isAdmin = !!user && user.role === 'admin';
  const isStaff = !!user && user.role === 'staff';
  const isMember = !!user && user.role === 'member';

  // Login function
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    // In a real app, this would be an API call to your backend
    const foundUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password &&
      u.role === role
    );

    if (foundUser) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      
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
      
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      toast.error('Invalid credentials. Please try again.');
      throw new Error('Invalid credentials');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    navigate('/login');
    toast.info('You have been logged out.');
  };

  // Check if user has permissions for specific roles
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

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
