
import React from 'react';

const sampleAccounts = [
  { role: 'member', email: 'member@example.com', password: 'password123', note: '(Create this account in Supabase)' },
  { role: 'staff', email: 'staff@example.com', password: 'password123', note: '(Create this account in Supabase)' },
  { role: 'admin', email: 'admin@example.com', password: 'password123', note: '(Create this account in Supabase)' },
];

const DemoAccounts = () => {
  return (
    <div className="mt-8 p-4 bg-secondary/50 rounded-md">
      <p className="text-sm font-medium mb-2">Sample Accounts:</p>
      <div className="space-y-2 text-xs">
        {sampleAccounts.map((account) => (
          <div key={account.role} className="flex flex-col">
            <span className="font-semibold capitalize">{account.role}:</span>
            <div className="flex flex-col space-y-1">
              <span>Email: {account.email}</span>
              <span>Password: {account.password}</span>
              <span className="text-muted-foreground italic">{account.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
