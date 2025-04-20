import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Wrench, ClipboardList, Calendar, Users, Bell } from 'lucide-react';

const StaffLanding = () => {
  const { user, logout } = useAuth();
  const { maintenanceRequests, isLoadingMaintenance, updateMaintenanceStatus } = useData();
  
  const pendingMaintenanceRequests = maintenanceRequests.filter(
    request => request.status === 'pending'
  ).slice(0, 3);

  const todayBookings = 8;
  const pendingTasks = pendingMaintenanceRequests.length;

  const handleResolveTask = async (id: string) => {
    try {
      await updateMaintenanceStatus(id, 'resolved');
    } catch (error) {
      console.error('Error resolving task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Staff Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Today's Bookings</span>
                <Calendar className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayBookings}</p>
              <p className="text-sm text-muted-foreground">Activities scheduled for today</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/bookings" className="text-sm text-primary hover:underline">
                View all bookings
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Pending Tasks</span>
                <ClipboardList className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks requiring your attention</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-sm text-primary p-0 h-auto">
                Manage tasks
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Facility Status</span>
                <Wrench className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <span>All facilities operational</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-sm text-primary p-0 h-auto">
                View details
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Maintenance Requests</span>
                  <Wrench className="h-5 w-5" />
                </CardTitle>
                <CardDescription>Recent maintenance issues that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Facility</th>
                        <th className="text-left py-3 px-4 font-medium">Issue</th>
                        <th className="text-left py-3 px-4 font-medium">Priority</th>
                        <th className="text-left py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingMaintenance ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center">Loading...</td>
                        </tr>
                      ) : pendingMaintenanceRequests.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center">No pending maintenance requests</td>
                        </tr>
                      ) : (
                        pendingMaintenanceRequests.map((request) => (
                          <tr key={request.id} className="border-b">
                            <td className="py-3 px-4">{request.facility}</td>
                            <td className="py-3 px-4">{request.issue}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                request.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : request.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                              }`}>
                                {request.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolveTask(request.id)}
                              >
                                Resolve
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Log New Issue
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Quick Actions</span>
                  <Bell className="h-5 w-5" />
                </CardTitle>
                <CardDescription>Common staff tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View Member Check-ins
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Update Activity Schedule
                </Button>
                <Link to="/admin/bookings" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Staff Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-md">
                  <p className="font-medium">Team Meeting</p>
                  <p className="text-sm text-muted-foreground">Friday at 3:00 PM in the Conference Room</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-md">
                  <p className="font-medium">New Equipment Training</p>
                  <p className="text-sm text-muted-foreground">Tuesday at 10:00 AM in the Gym</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLanding;
