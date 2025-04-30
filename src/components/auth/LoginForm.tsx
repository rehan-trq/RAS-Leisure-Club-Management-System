
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      console.error('Login form error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login with one of the demo accounts
  const loginWithDemoAccount = async (role: string) => {
    console.log(`Login as ${role} role`);
    
    // Set the form fields for visual feedback
    const demoEmail = `${role}@example.com`;
    const demoPassword = 'password123';
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    try {
      setLoading(true);
      toast.loading(`Logging in as ${role}...`);
      
      // Attempt to login with the demo account
      await login(demoEmail, demoPassword);
    } catch (error) {
      console.error('Demo login error:', error);
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
            className="form-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
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
              className="form-input pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <span className="text-xs text-muted-foreground">Quick access:</span>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            onClick={() => loginWithDemoAccount('member')} 
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            disabled={loading}
          >
            Member
          </button>
          <button 
            type="button" 
            onClick={() => loginWithDemoAccount('staff')} 
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
            disabled={loading}
          >
            Staff
          </button>
          <button 
            type="button" 
            onClick={() => loginWithDemoAccount('admin')} 
            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
            disabled={loading}
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
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </AnimatedButton>
    </form>
  );
};

export default LoginForm;
