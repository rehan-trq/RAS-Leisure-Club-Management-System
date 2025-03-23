
import React from 'react';

const sampleAccounts = [
  { role: 'member', email: 'member@example.com', password: 'password123' },
  { role: 'staff', email: 'staff@example.com', password: 'password123' },
  { role: 'admin', email: 'admin@example.com', password: 'password123' },
];

const DemoAccounts = () => {
  return (
    <div className="mt-8 p-4 bg-secondary/50 rounded-md">
      <p className="text-sm font-medium mb-2">Demo Accounts:</p>
      <div className="space-y-2 text-xs">
        {sampleAccounts.map((account) => (
          <div key={account.role} className="flex flex-col">
            <span className="font-semibold capitalize">{account.role}:</span>
            <div className="flex justify-between">
              <span>{account.email}</span>
              <span>{account.password}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
