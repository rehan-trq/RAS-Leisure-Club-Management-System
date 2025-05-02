
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaymentPlan } from '@/pages/Payment';

interface PaymentSummaryProps {
  plan: PaymentPlan;
}

const PaymentSummary = ({ plan }: PaymentSummaryProps) => {
  // Calculate tax (for demo purposes)
  const taxRate = 0.08; // 8% tax rate
  const subtotal = plan.price;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your membership purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.period ? `Billed ${plan.period}ly` : 'One-time payment'}</p>
            </div>
            <span>${plan.price.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="bg-secondary p-3 rounded-md text-sm mt-4">
            <p className="font-medium mb-1">What's included:</p>
            <ul className="space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-xs text-muted-foreground">• {feature}</li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-xs text-muted-foreground">• And {plan.features.length - 3} more benefits</li>
              )}
            </ul>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
