import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsAndReports = () => {
  const { isAdmin, isStaff } = useAuth();
  const [timeFrame, setTimeFrame] = useState('last7Days');
  const [revenueData, setRevenueData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [loading, setLoading] = useState(true);

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue Analytics',
      },
    },
  };

  const membershipOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Membership Analytics',
      },
    },
  };

  const revenueLabels = revenueData.map(item => item.month);
  const membershipLabels = membershipData.map(item => item.type);

  const revenueChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(item => item.amount),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const membershipChartData = {
    labels: membershipLabels,
    datasets: [
      {
        label: 'Memberships',
        data: membershipData.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        const mockRevenue = [
          { month: 'Jan', amount: 12500 },
          { month: 'Feb', amount: 14200 },
          { month: 'Mar', amount: 13800 },
          { month: 'Apr', amount: 15500 },
          { month: 'May', amount: 16000 },
        ];
        
        // Mock membership data
        const mockMemberships = [
          { type: 'Premium', count: 120 },
          { type: 'Standard', count: 245 },
          { type: 'Basic', count: 178 },
        ];
        
        setRevenueData(mockRevenue);
        setMembershipData(mockMemberships);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeFrame]);

  if (!isAdmin && !isStaff) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Analytics and Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            View and generate reports based on different time frames.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7Days">Last 7 Days</SelectItem>
                <SelectItem value="last30Days">Last 30 Days</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              A chart displaying revenue over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Bar options={revenueOptions} data={revenueChartData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memberships</CardTitle>
            <CardDescription>
              A chart displaying membership types.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Bar options={membershipOptions} data={membershipChartData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsAndReports;
