
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import PaymentSummary from '@/components/payment/PaymentSummary';

// Define payment plan types
export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period?: string;
  features: string[];
  recommended?: boolean;
}

const defaultPlans: PaymentPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Membership',
    description: 'Full access to all club facilities',
    price: 49.99,
    period: 'month',
    features: [
      'Access to swimming pool',
      'Fitness center access',
      'Tennis and squash courts',
      'Group classes',
      'Locker room access'
    ]
  },
  {
    id: 'annual',
    name: 'Annual Membership',
    description: 'Save with our annual plan',
    price: 499.99,
    period: 'year',
    features: [
      'All monthly benefits',
      'Two free personal training sessions',
      'Guest passes (4 per year)',
      'Priority booking for special events',
      'Discounted spa services'
    ],
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    description: 'VIP experience and exclusive perks',
    price: 999.99,
    period: 'year',
    features: [
      'All annual benefits',
      'Unlimited guest passes',
      'Exclusive VIP lounge access',
      'Complimentary towel service',
      'Personal locker assignment',
      'Monthly massage session'
    ]
  }
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(defaultPlans[1]); // Annual plan as default
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get plan from location state if available
  const planFromLocation = location.state?.plan;
  
  React.useEffect(() => {
    if (planFromLocation) {
      setSelectedPlan(planFromLocation);
    }
  }, [planFromLocation]);
  
  const handleSelectPlan = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
  };
  
  const handlePayment = async (paymentDetails: any) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated successful payment
      toast.success('Payment processed successfully!');
      
      // Navigate to success page with order details
      navigate('/payment-success', { 
        state: { 
          plan: selectedPlan,
          paymentDate: new Date().toISOString(),
          orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        },
        replace: true
      });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Membership Payment</h1>
          <p className="text-muted-foreground">Select a membership plan and complete your payment</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {defaultPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`hover:shadow-lg transition-all ${
                selectedPlan.id === plan.id 
                  ? 'ring-2 ring-primary shadow-md' 
                  : 'border'
              } ${plan.recommended ? 'relative' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={selectedPlan.id === plan.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan)}
                >
                  {selectedPlan.id === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter your payment information to complete your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm onSubmit={handlePayment} isProcessing={isProcessing} />
            </CardContent>
          </Card>
          
          <div>
            <PaymentSummary plan={selectedPlan} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
