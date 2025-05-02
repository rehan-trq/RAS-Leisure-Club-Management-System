
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download, User } from 'lucide-react';
import { PaymentPlan } from '@/pages/Payment';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state as {
    plan: PaymentPlan;
    paymentDate: string;
    orderId: string;
  } | null;
  
  // Redirect to payment page if no payment data is available
  React.useEffect(() => {
    if (!paymentData) {
      navigate('/payment');
    }
  }, [paymentData, navigate]);
  
  if (!paymentData) {
    return null;
  }
  
  const { plan, paymentDate, orderId } = paymentData;
  const formattedDate = new Date(paymentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-up">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Payment Successful!</CardTitle>
            <CardDescription>Your membership has been activated</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Order ID</span>
                <span className="text-sm">{orderId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Date</span>
                <span className="text-sm">{formattedDate}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-sm">${(plan.price * 1.08).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Method</span>
                <span className="text-sm">Credit Card (•••• 1234)</span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-md p-4">
              <h3 className="font-medium text-green-800 mb-2">Membership Details</h3>
              <p className="text-sm text-green-700">{plan.name}</p>
              <p className="text-xs text-green-600 mt-1">
                {plan.period === 'month' 
                  ? 'Your membership will renew monthly.' 
                  : `Your membership is active for 1 ${plan.period}.`}
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <div className="w-full grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" asChild>
                <Link to="#">
                  <Download className="h-4 w-4" />
                  <span>Receipt</span>
                </Link>
              </Button>
              
              <Button className="w-full flex items-center justify-center gap-2" asChild>
                <Link to="/member">
                  <User className="h-4 w-4" />
                  <span>My Account</span>
                </Link>
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Thank you for joining RAS Club!</p>
              <p className="mt-1">
                <Link to="/" className="text-primary hover:underline">
                  Return to Homepage
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
