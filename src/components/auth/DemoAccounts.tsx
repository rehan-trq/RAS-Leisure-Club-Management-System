
import React from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, Check } from 'lucide-react';

const sampleAccounts = [
  { role: 'member', email: 'member@example.com', password: 'password123' },
  { role: 'staff', email: 'staff@example.com', password: 'password123' },
  { role: 'admin', email: 'admin@example.com', password: 'password123' },
];

const DemoAccounts = () => {
  return (
    <div className="mt-8 p-4 bg-secondary/50 rounded-md">
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertCircleIcon className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Demo Accounts</AlertTitle>
        <AlertDescription className="text-xs mt-1 text-blue-600">
          The app creates profiles automatically for demo accounts.
          <div className="mt-1 flex items-center text-green-600">
            <Check size={14} className="mr-1" /> No setup required!
          </div>
        </AlertDescription>
      </Alert>
      
      <p className="text-sm font-medium mb-2">Sample Accounts:</p>
      <div className="space-y-2 text-xs">
        {sampleAccounts.map((account) => (
          <div key={account.role} className="flex flex-col">
            <span className="font-semibold capitalize">{account.role}:</span>
            <div className="flex flex-col space-y-1">
              <span>Email: {account.email}</span>
              <span>Password: {account.password}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
