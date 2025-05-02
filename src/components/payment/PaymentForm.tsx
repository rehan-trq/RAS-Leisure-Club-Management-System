
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface PaymentFormProps {
  onSubmit: (paymentDetails: any) => void;
  isProcessing: boolean;
}

const PaymentForm = ({ onSubmit, isProcessing }: PaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
      isValid = false;
    }

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Valid card number is required';
      isValid = false;
    }

    if (!expiry || expiry.length < 5) {
      newErrors.expiry = 'Valid expiry date is required (MM/YY)';
      isValid = false;
    } else {
      const [month, year] = expiry.split('/');
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of year
      const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)

      if (Number(month) < 1 || Number(month) > 12) {
        newErrors.expiry = 'Invalid month';
        isValid = false;
      } else if (Number(year) < currentYear || 
                (Number(year) === currentYear && Number(month) < currentMonth)) {
        newErrors.expiry = 'Card has expired';
        isValid = false;
      }
    }

    if (!cvc || cvc.length < 3 || cvc.length > 4) {
      newErrors.cvc = 'Valid CVC code is required (3-4 digits)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        cardName,
        cardNumber,
        expiry,
        cvc,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="form-control">
          <Label htmlFor="cardName" className="form-label">
            Cardholder Name
          </Label>
          <Input
            id="cardName"
            type="text"
            className={`form-input ${errors.cardName ? 'border-destructive focus:ring-destructive/20' : ''}`}
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            disabled={isProcessing}
          />
          {errors.cardName && (
            <div className="text-sm text-destructive mt-1">{errors.cardName}</div>
          )}
        </div>

        <div className="form-control">
          <Label htmlFor="cardNumber" className="form-label">
            Card Number
          </Label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="text"
              className={`form-input pl-10 ${errors.cardNumber ? 'border-destructive focus:ring-destructive/20' : ''}`}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              disabled={isProcessing}
              maxLength={19}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          {errors.cardNumber && (
            <div className="text-sm text-destructive mt-1">{errors.cardNumber}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <Label htmlFor="expiry" className="form-label">
              Expiry Date
            </Label>
            <div className="relative">
              <Input
                id="expiry"
                type="text"
                className={`form-input pl-10 ${errors.expiry ? 'border-destructive focus:ring-destructive/20' : ''}`}
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                disabled={isProcessing}
                maxLength={5}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            {errors.expiry && (
              <div className="text-sm text-destructive mt-1">{errors.expiry}</div>
            )}
          </div>

          <div className="form-control">
            <Label htmlFor="cvc" className="form-label">
              CVC
            </Label>
            <div className="relative">
              <Input
                id="cvc"
                type="text"
                className={`form-input pl-10 ${errors.cvc ? 'border-destructive focus:ring-destructive/20' : ''}`}
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                disabled={isProcessing}
                maxLength={4}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            {errors.cvc && (
              <div className="text-sm text-destructive mt-1">{errors.cvc}</div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <AnimatedButton
          variant="primary"
          size="lg"
          className="w-full"
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Payment...' : 'Pay Now'}
        </AnimatedButton>
      </div>
      
      <div className="text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Lock className="h-3 w-3" />
          <span>Secure Payment</span>
        </div>
        <p>This is a demo payment form. No actual payment will be processed.</p>
      </div>
    </form>
  );
};

export default PaymentForm;
