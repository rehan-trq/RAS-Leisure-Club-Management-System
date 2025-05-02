
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FineCalculator from '@/components/admin/FineCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RefundRequestHandler from '@/components/admin/RefundRequestHandler';

const FinancialDashboard = () => {
  const { bookings } = useData();

  // Mock financial data - in a real app, this would come from the backend
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18750 },
    { month: 'Apr', revenue: 21000 },
    { month: 'May', revenue: 23500 },
    { month: 'Jun', revenue: 25000 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$115,750</p>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">487</p>
            <p className="text-sm text-muted-foreground">+24 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$235</p>
            <p className="text-sm text-muted-foreground">-2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="fines" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fines">Fine Management</TabsTrigger>
          <TabsTrigger value="refunds">Refund Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fines">
          <FineCalculator />
        </TabsContent>
        
        <TabsContent value="refunds">
          <RefundRequestHandler />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;
