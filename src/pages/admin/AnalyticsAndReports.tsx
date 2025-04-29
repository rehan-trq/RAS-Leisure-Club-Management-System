
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChartBar, Download, Calendar, BarChart, PieChart, LineChart, Eye } from 'lucide-react';
import { AreaChart, Area, LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, 
         PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
         ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mock data for charts
const membershipData = [
  { name: 'Jan', value: 42 },
  { name: 'Feb', value: 48 },
  { name: 'Mar', value: 55 },
  { name: 'Apr', value: 59 },
  { name: 'May', value: 65 },
  { name: 'Jun', value: 70 },
  { name: 'Jul', value: 78 },
  { name: 'Aug', value: 85 },
  { name: 'Sep', value: 90 },
];

const revenueData = [
  { name: 'Jan', value: 15000 },
  { name: 'Feb', value: 17500 },
  { name: 'Mar', value: 19000 },
  { name: 'Apr', value: 21000 },
  { name: 'May', value: 23500 },
  { name: 'Jun', value: 25000 },
  { name: 'Jul', value: 28000 },
  { name: 'Aug', value: 30500 },
  { name: 'Sep', value: 33000 },
];

const facilityUsageData = [
  { name: 'Pool', value: 35 },
  { name: 'Gym', value: 45 },
  { name: 'Tennis', value: 12 },
  { name: 'Basketball', value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const activityPopularity = [
  { name: 'Yoga Class', count: 45 },
  { name: 'Swimming Lessons', count: 38 },
  { name: 'Tennis Training', count: 25 },
  { name: 'Spin Class', count: 32 },
  { name: 'Personal Training', count: 20 },
];

const AnalyticsAndReports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch booking data for analytics
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch payment data for revenue analytics
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*');
        
      if (error) throw error;
      return data;
    }
  });

  // Demo function to generate a fake report
  const generateReport = () => {
    // In a real app, this would generate a proper report
    window.alert('Report generation would be implemented in a production system');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Insights and performance metrics for your business
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={generateReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 overflow-x-auto">
          <TabsTrigger value="overview" className="flex gap-2 items-center">
            <ChartBar className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex gap-2 items-center">
            <LineChart className="h-4 w-4" />
            Membership
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex gap-2 items-center">
            <BarChart className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="facility" className="flex gap-2 items-center">
            <PieChart className="h-4 w-4" />
            Facility Usage
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  Total active members: 452
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={membershipData}
                      margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                  Monthly revenue trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart 
                      data={revenueData}
                      margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Facility Usage</CardTitle>
                <CardDescription>
                  Distribution by area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={facilityUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {facilityUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Popular Activities</CardTitle>
              <CardDescription>Most booked activities this {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={activityPopularity}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Bookings" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Membership Tab */}
        <TabsContent value="membership">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Growth</CardTitle>
                <CardDescription>New members over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={membershipData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" name="Members" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Member Retention</CardTitle>
                <CardDescription>Renewal rates by membership type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Monthly', renewal: 65, churn: 35 },
                        { name: 'Quarterly', renewal: 78, churn: 22 },
                        { name: 'Annual', renewal: 92, churn: 8 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="renewal" stackId="a" fill="#4f46e5" name="Renewal %" />
                      <Bar dataKey="churn" stackId="a" fill="#ef4444" name="Churn %" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By membership type and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Jan', memberships: 12000, services: 3000, merchandise: 1000 },
                        { name: 'Feb', memberships: 13500, services: 4000, merchandise: 1200 },
                        { name: 'Mar', memberships: 15000, services: 4000, merchandise: 1300 },
                        { name: 'Apr', memberships: 16200, services: 4800, merchandise: 1500 },
                        { name: 'May', memberships: 18000, services: 5500, merchandise: 1800 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                      <Bar dataKey="memberships" fill="#4f46e5" name="Memberships" />
                      <Bar dataKey="services" fill="#22c55e" name="Services" />
                      <Bar dataKey="merchandise" fill="#f59e0b" name="Merchandise" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Credit Card', value: 68 },
                          { name: 'Debit Card', value: 15 },
                          { name: 'Bank Transfer', value: 12 },
                          { name: 'PayPal', value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {facilityUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Facility Usage Tab */}
        <TabsContent value="facility">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Facility Utilization</CardTitle>
                <CardDescription>Usage by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { hour: '6am', visitors: 12 },
                        { hour: '8am', visitors: 45 },
                        { hour: '10am', visitors: 30 },
                        { hour: '12pm', visitors: 55 },
                        { hour: '2pm', visitors: 20 },
                        { hour: '4pm', visitors: 40 },
                        { hour: '6pm', visitors: 68 },
                        { hour: '8pm', visitors: 42 },
                        { hour: '10pm', visitors: 15 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" name="Visitors" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Equipment Usage</CardTitle>
                <CardDescription>Most popular equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Treadmill', usage: 85 },
                        { name: 'Bench Press', usage: 65 },
                        { name: 'Elliptical', usage: 55 },
                        { name: 'Squat Rack', usage: 75 },
                        { name: 'Rowing', usage: 40 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" fill="#22c55e" name="Usage %" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Report Generation Section */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Create custom reports for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex flex-col items-center h-auto py-4">
              <Calendar className="h-8 w-8 mb-2" />
              <span>Monthly Report</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center h-auto py-4">
              <ChartBar className="h-8 w-8 mb-2" />
              <span>Revenue Analysis</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center h-auto py-4">
              <Eye className="h-8 w-8 mb-2" />
              <span>Member Insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsAndReports;
