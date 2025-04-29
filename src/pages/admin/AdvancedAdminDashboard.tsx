import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCards } from '@/components/admin/StatCards';
import { MembershipChart } from '@/components/admin/MembershipChart';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { SystemPerformance } from '@/components/admin/SystemPerformance';
import FineCalculator from '@/components/admin/FineCalculator';
import RefundRequestHandler from '@/components/admin/RefundRequestHandler';
import MemberFeedback from '@/components/admin/MemberFeedback';
import SearchSortTable from '@/components/admin/SearchSortTable';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Settings, Download, ChartBar } from 'lucide-react';
import { ReactNode } from 'react';

interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  status: string;
  joinDate: string;
  lastVisit: string;
}

// Mock data for demonstration
const mockMembers: Member[] = [
  {
    id: 'mem-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2024-10-15',
    lastVisit: '2025-04-28',
  },
  {
    id: 'mem-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    membershipType: 'Standard',
    status: 'Active',
    joinDate: '2024-11-03',
    lastVisit: '2025-04-26',
  },
  {
    id: 'mem-003',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    membershipType: 'Premium',
    status: 'Suspended',
    joinDate: '2024-08-22',
    lastVisit: '2025-04-18',
  },
  {
    id: 'mem-004',
    name: 'Emily Wilson',
    email: 'emily.w@example.com',
    membershipType: 'Standard',
    status: 'Active',
    joinDate: '2025-01-10',
    lastVisit: '2025-04-27',
  },
  {
    id: 'mem-005',
    name: 'David Lee',
    email: 'david.l@example.com',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2024-12-05',
    lastVisit: '2025-04-28',
  },
  {
    id: 'mem-006',
    name: 'Jennifer Garcia',
    email: 'jennifer.g@example.com',
    membershipType: 'Standard',
    status: 'Inactive',
    joinDate: '2024-09-18',
    lastVisit: '2025-03-15',
  },
  {
    id: 'mem-007',
    name: 'Robert Martinez',
    email: 'robert.m@example.com',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2025-02-14',
    lastVisit: '2025-04-25',
  }
];

const AdvancedAdminDashboard = () => {
  const { bookings } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Demo stats for the dashboard
  const systemStats = {
    totalMembers: 452,
    activeBookings: bookings.length,
    revenue: 28750,
    staffMembers: 12
  };
  
  // Demo data for charts
  const membershipData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 55 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 75 },
    { name: 'Jun', value: 85 },
    { name: 'Jul', value: 90 },
  ];

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const memberColumns: {
    key: keyof Member;
    header: string;
    width?: string;
    render?: (value: any, row: Member) => ReactNode;
  }[] = [
    { key: 'name', header: 'Name', width: '20%' },
    { key: 'email', header: 'Email', width: '20%' },
    { key: 'membershipType', header: 'Membership' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => renderStatusBadge(value)
    },
    { key: 'joinDate', header: 'Join Date' },
    { key: 'lastVisit', header: 'Last Visit' }
  ];
  
  const handleMemberClick = (member: Member) => {
    console.log('Member clicked:', member);
    // Navigate to member details or open a modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Advanced management tools and analytics</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
          <Button variant="default" size="sm">
            <ChartBar className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <StatCards stats={systemStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MembershipChart data={membershipData} />
            <SystemPerformance />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('financial')}>
                  Manage Financial Operations
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('members')}>
                  View Member Directory
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('feedback')}>
                  Review Member Feedback
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Generate Monthly Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Directory</CardTitle>
              <CardDescription>Browse and manage facility members</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchSortTable 
                data={mockMembers} 
                columns={memberColumns} 
                defaultSortColumn="name"
                defaultSortDirection="asc"
                onRowClick={handleMemberClick}
                emptyMessage="No members found matching your search criteria"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6">
          <FineCalculator />
          <RefundRequestHandler />
        </TabsContent>
        
        <TabsContent value="feedback">
          <MemberFeedback />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAdminDashboard;
