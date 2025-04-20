
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm = ({ onSubmit, loading: parentLoading }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submission with:', { email });
    
    if (validateForm()) {
      try {
        const trimmedEmail = email.trim();
        console.log('Submitting login with trimmed email:', trimmedEmail);
        await onSubmit(trimmedEmail, password);
      } catch (error: any) {
        console.error('Login form error:', error);
        // Don't clear password on error to allow the user to try again
      }
    } else {
      console.log('Form validation failed');
    }
  };

  // Login with one of the demo accounts
  const loginWithDemoAccount = async (role: string) => {
    let demoEmail = '';
    let demoPassword = 'password123';
    
    if (role === 'member') {
      demoEmail = 'member@example.com';
    } else if (role === 'staff') {
      demoEmail = 'staff@example.com';
    } else if (role === 'admin') {
      demoEmail = 'admin@example.com';
    }
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    // Use local loading state to prevent multiple clicks
    setLoading(true);
    
    try {
      await login(demoEmail, demoPassword);
      toast.success(`Logging in as ${role}...`);
    } catch (error: any) {
      console.error(`Error logging in as ${role}:`, error);
      toast.error(`Failed to login as ${role}: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="form-control">
          <Label htmlFor="email" className="form-label">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'border-destructive focus:ring-destructive/20' : ''}`}
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={parentLoading || loading}
          />
          {errors.email && (
            <div className="text-sm text-destructive mt-1">{errors.email}</div>
          )}
        </div>
        
        <div className="form-control">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="form-label">
              Password
            </Label>
            <a 
              href="#" 
              className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input pr-10 ${errors.password ? 'border-destructive focus:ring-destructive/20' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={parentLoading || loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <div className="text-sm text-destructive mt-1">{errors.password}</div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <span className="text-xs text-muted-foreground">Quick login:</span>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            onClick={() => loginWithDemoAccount('member')} 
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            disabled={parentLoading || loading}
          >
            Member
          </button>
          <button 
            type="button" 
            onClick={() => loginWithDemoAccount('staff')} 
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
            disabled={parentLoading || loading}
          >
            Staff
          </button>
          <button 
            type="button" 
            onClick={() => loginWithDemoAccount('admin')} 
            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
            disabled={parentLoading || loading}
          >
            Admin
          </button>
        </div>
      </div>
      
      <AnimatedButton
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
        disabled={parentLoading || loading}
      >
        {parentLoading || loading ? 'Logging in...' : 'Login'}
      </AnimatedButton>
    </form>
  );
};

export default LoginForm;
