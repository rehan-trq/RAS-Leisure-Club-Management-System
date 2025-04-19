
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCards } from '@/components/admin/StatCards';
import { MembershipChart } from '@/components/admin/MembershipChart';
import { QuickActions } from '@/components/admin/QuickActions';
import { SystemPerformance } from '@/components/admin/SystemPerformance';
import { RecentActivity } from '@/components/admin/RecentActivity';

const AdminLanding = () => {
  const { user, logout } = useAuth();

  // Mock data for charts and stats
  const membershipData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 55 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 75 },
    { name: 'Jun', value: 85 },
    { name: 'Jul', value: 90 },
  ];

  const systemStats = {
    totalMembers: 452,
    activeBookings: 38,
    revenue: 28750,
    staffMembers: 12
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>

        <StatCards stats={systemStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <MembershipChart data={membershipData} />
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <RecentActivity />
          <SystemPerformance />
        </div>
      </div>
    </div>
  );
};

export default AdminLanding;
