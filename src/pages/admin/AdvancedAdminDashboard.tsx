
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Settings, Download, ChartBar } from 'lucide-react';
import { ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  status: string;
  joinDate: string;
  lastVisit: string;
}

const AdvancedAdminDashboard = () => {
  const { bookings } = useData();
  const { isAdmin, isStaff } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch member profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'member')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Format the data to match our interface
        const formattedMembers: Member[] = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.full_name || 'Unknown',
          email: profile.email || 'No email',
          membershipType: 'Standard', // Default value since we don't have this in our database yet
          status: 'Active', // Default value
          joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : 'Unknown',
          lastVisit: new Date().toISOString().split('T')[0] // Placeholder
        }));
        
        setMembers(formattedMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  // Demo stats for the dashboard
  const systemStats = {
    totalMembers: members.length,
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Advanced Dashboard</h1>
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
              {loading ? (
                <div className="text-center py-6">Loading members...</div>
              ) : (
                <SearchSortTable 
                  data={members} 
                  columns={memberColumns} 
                  defaultSortColumn="name"
                  defaultSortDirection="asc"
                  onRowClick={handleMemberClick}
                  emptyMessage="No members found matching your search criteria"
                />
              )}
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
