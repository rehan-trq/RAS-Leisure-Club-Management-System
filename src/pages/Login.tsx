
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, UserRole } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        await login(email, password, role);
        // Note: No need to manually redirect here as the auth context handles it
      } catch (error) {
        // Error handling is done in the auth context
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    
    // Simulate Google API request
    setTimeout(() => {
      setLoading(false);
      toast.success('Successfully logged in with Google!');
      navigate('/');
    }, 1500);
  };

  // Sample account information for demo purposes
  const sampleAccounts = [
    { role: 'member', email: 'member@example.com', password: 'password123' },
    { role: 'staff', email: 'staff@example.com', password: 'password123' },
    { role: 'admin', email: 'admin@example.com', password: 'password123' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative">
      <div className="blur-circle w-[600px] h-[600px] -top-64 right-16 bg-primary/10 animate-spin-slow"></div>
      <div className="blur-circle w-[700px] h-[700px] -bottom-96 -left-64 bg-accent/10 animate-spin-slow"></div>
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>
      
      <div className="w-full max-w-md animate-zoom-in">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Log in to access your RAS Club membership
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    disabled={loading}
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
                    <Link 
                      to="#" 
                      className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input pr-10 ${errors.password ? 'border-destructive focus:ring-destructive/20' : ''}`}
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
                  {errors.password && (
                    <div className="text-sm text-destructive mt-1">{errors.password}</div>
                  )}
                </div>

                <div className="form-control">
                  <Label className="form-label">Login As</Label>
                  <RadioGroup 
                    value={role} 
                    onValueChange={(value) => setRole(value as UserRole)}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="member" id="member" />
                      <Label htmlFor="member" className="cursor-pointer">Member</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="staff" id="staff" />
                      <Label htmlFor="staff" className="cursor-pointer">Staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                    </div>
                  </RadioGroup>
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
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  type="button"
                  className="social-btn w-full"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  <span className="ml-2">Sign in with Google</span>
                </Button>
              </div>
            </div>

            {/* Sample accounts for demo purposes */}
            <div className="mt-8 p-4 bg-secondary/50 rounded-md">
              <p className="text-sm font-medium mb-2">Demo Accounts:</p>
              <div className="space-y-2 text-xs">
                {sampleAccounts.map((account) => (
                  <div key={account.role} className="flex flex-col">
                    <span className="font-semibold capitalize">{account.role}:</span>
                    <div className="flex justify-between">
                      <span>{account.email}</span>
                      <span>{account.password}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              By logging in, you agree to our{' '}
              <Link to="#" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
