import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();

  const passwordRequirements = [
    { id: 'length', label: 'At least 8 characters', isMet: password.length >= 8 },
    { id: 'uppercase', label: 'At least 1 uppercase letter', isMet: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'At least 1 lowercase letter', isMet: /[a-z]/.test(password) },
    { id: 'number', label: 'At least 1 number', isMet: /[0-9]/.test(password) },
    { id: 'match', label: 'Passwords match', isMet: password === confirmPassword && password !== '' },
  ];

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least 1 lowercase letter';
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least 1 number';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        // Register user with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        toast.success('Account created successfully! You can now log in.');
        console.log('Signup successful:', data);
        navigate('/login');
      } catch (error: any) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Failed to create account');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created with Google!');
      }
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative">
      <div className="blur-circle w-[600px] h-[600px] -bottom-64 right-16 bg-primary/10 animate-spin-slow"></div>
      <div className="blur-circle w-[700px] h-[700px] -top-96 -left-64 bg-accent/10 animate-spin-slow"></div>
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>
      
      <div className="w-full max-w-md animate-zoom-in">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Join RAS Club and experience exclusive benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="form-control">
                  <Label htmlFor="fullName" className="form-label">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    className={`form-input ${errors.fullName ? 'border-destructive focus:ring-destructive/20' : ''}`}
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                  {errors.fullName && (
                    <div className="text-sm text-destructive mt-1">{errors.fullName}</div>
                  )}
                </div>
                
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
                  <Label htmlFor="password" className="form-label">
                    Password
                  </Label>
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
                  <Label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`form-input pr-10 ${errors.confirmPassword ? 'border-destructive focus:ring-destructive/20' : ''}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-sm text-destructive mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
                
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Password Requirements:</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li key={req.id} className="text-xs flex items-center gap-1.5">
                        {req.isMet ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <XCircle size={14} className="text-muted-foreground" />
                        )}
                        <span className={req.isMet ? 'text-green-500' : 'text-muted-foreground'}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <AnimatedButton
                variant="primary"
                size="lg"
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
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
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  <span className="ml-2">Sign up with Google</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
              >
                Login
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
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

export default Signup;
