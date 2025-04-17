
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

const sampleAccounts = [
  { role: 'member', email: 'member@example.com', password: 'password123' },
  { role: 'staff', email: 'staff@example.com', password: 'password123' },
  { role: 'admin', email: 'admin@example.com', password: 'password123' },
];

const DemoAccounts = () => {
  return (
    <div className="mt-8 p-4 bg-secondary/50 rounded-md">
      <Alert variant="default" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Supabase Setup Required</AlertTitle>
        <AlertDescription className="text-xs mt-1">
          Please make sure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are set.
          Create these accounts in your Supabase project using the Auth section.
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
              <span className="text-muted-foreground italic">(Create this account in Supabase)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
