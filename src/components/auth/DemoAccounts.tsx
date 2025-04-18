
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const sampleAccounts = [
  { role: 'member', email: 'member@example.com', password: 'password123' },
  { role: 'staff', email: 'staff@example.com', password: 'password123' },
  { role: 'admin', email: 'admin@example.com', password: 'password123' },
];

const DemoAccounts = () => {
  // Check if the Supabase client is properly configured by checking its configuration
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
                               import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return (
    <div className="mt-8 p-4 bg-secondary/50 rounded-md">
      <Alert variant={isSupabaseConfigured ? "default" : "destructive"} className="mb-4">
        {isSupabaseConfigured ? (
          <AlertCircleIcon className="h-4 w-4" />
        ) : (
          <AlertTriangleIcon className="h-4 w-4" />
        )}
        <AlertTitle>{isSupabaseConfigured ? "Supabase Setup" : "Supabase Not Configured"}</AlertTitle>
        <AlertDescription className="text-xs mt-1">
          {isSupabaseConfigured ? (
            <>
              Create these accounts in your Supabase project using the Auth section.
              You'll also need to create a 'profiles' table with columns for name and role.
            </>
          ) : (
            <>
              <p className="mb-2">To fix this error, you need to:</p>
              <ol className="list-decimal pl-5 mb-2">
                <li>Connect your project to Supabase using the green Supabase button in the top-right corner</li>
                <li>Create a 'profiles' table with columns for id, name, and role</li>
                <li>Set up authentication in your Supabase project</li>
              </ol>
              <p>Once connected, these demo accounts will be available for testing.</p>
            </>
          )}
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
