
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Login = () => {
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
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700 font-medium">
                Use the quick access buttons below to log in with demo accounts for different roles.
              </AlertDescription>
            </Alert>
            
            <LoginForm />
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
