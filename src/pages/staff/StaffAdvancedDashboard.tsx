
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';

const StaffAdvancedDashboard = () => {
  // Mock data for charts
  const facilityUsageData = [
    { name: 'Swimming Pool', usage: 120 },
    { name: 'Tennis Court', usage: 85 },
    { name: 'Gym', usage: 150 },
    { name: 'Sauna', usage: 60 },
    { name: 'Spa', usage: 75 },
    { name: 'Basketball Court', usage: 40 },
  ];

  const weeklyAttendanceData = [
    { day: 'Monday', attendance: 120 },
    { day: 'Tuesday', attendance: 145 },
    { day: 'Wednesday', attendance: 160 },
    { day: 'Thursday', attendance: 170 },
    { day: 'Friday', attendance: 185 },
    { day: 'Saturday', attendance: 210 },
    { day: 'Sunday', attendance: 190 },
  ];

  const monthlyUsageData = [
    { name: 'Jan', gym: 45, pool: 30, tennis: 25, spa: 20 },
    { name: 'Feb', gym: 50, pool: 35, tennis: 28, spa: 22 },
    { name: 'Mar', gym: 60, pool: 40, tennis: 30, spa: 25 },
    { name: 'Apr', gym: 70, pool: 45, tennis: 32, spa: 28 },
    { name: 'May', gym: 65, pool: 50, tennis: 35, spa: 30 },
    { name: 'Jun', gym: 80, pool: 65, tennis: 40, spa: 35 },
    { name: 'Jul', gym: 90, pool: 70, tennis: 45, spa: 40 },
  ];

  const staffScheduleData = [
    { name: 'John Smith', role: 'Trainer', mon: 'AM', tue: 'AM', wed: 'PM', thu: 'PM', fri: 'AM', sat: 'OFF', sun: 'OFF' },
    { name: 'Sarah Johnson', role: 'Receptionist', mon: 'PM', tue: 'PM', wed: 'AM', thu: 'AM', fri: 'PM', sat: 'AM', sun: 'OFF' },
    { name: 'Michael Brown', role: 'Maintenance', mon: 'AM', tue: 'AM', wed: 'AM', thu: 'PM', fri: 'PM', sat: 'PM', sun: 'OFF' },
    { name: 'Emily Davis', role: 'Swim Instructor', mon: 'OFF', tue: 'PM', wed: 'PM', thu: 'AM', fri: 'AM', sat: 'AM', sun: 'PM' },
    { name: 'James Wilson', role: 'Tennis Coach', mon: 'PM', tue: 'OFF', wed: 'OFF', thu: 'PM', fri: 'PM', sat: 'AM', sun: 'AM' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Advanced Dashboard</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff Schedule</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Attendance</CardTitle>
                  <CardDescription>Member attendance by day of week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weeklyAttendanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="attendance" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Facility Usage</CardTitle>
                  <CardDescription>Usage by facility type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={facilityUsageData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Monthly Facility Usage Trends</CardTitle>
                <CardDescription>Usage patterns over the past 7 months</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyUsageData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="gym" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="pool" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="tennis" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Area type="monotone" dataKey="spa" stackId="1" stroke="#ff8042" fill="#ff8042" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Schedule</CardTitle>
                <CardDescription>Weekly schedule for all staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Weekly staff schedule (AM = 8AM-3PM, PM = 2PM-9PM, OFF = Day off)</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Mon</TableHead>
                      <TableHead>Tue</TableHead>
                      <TableHead>Wed</TableHead>
                      <TableHead>Thu</TableHead>
                      <TableHead>Fri</TableHead>
                      <TableHead>Sat</TableHead>
                      <TableHead>Sun</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffScheduleData.map((staff) => (
                      <TableRow key={staff.name}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell className={staff.mon === 'OFF' ? 'text-muted-foreground' : ''}>{staff.mon}</TableCell>
                        <TableCell className={staff.tue === 'OFF' ? 'text-muted-foreground' : ''}>{staff.tue}</TableCell>
                        <TableCell className={staff.wed === 'OFF' ? 'text-muted-foreground' : ''}>{staff.wed}</TableCell>
                        <TableCell className={staff.thu === 'OFF' ? 'text-muted-foreground' : ''}>{staff.thu}</TableCell>
                        <TableCell className={staff.fri === 'OFF' ? 'text-muted-foreground' : ''}>{staff.fri}</TableCell>
                        <TableCell className={staff.sat === 'OFF' ? 'text-muted-foreground' : ''}>{staff.sat}</TableCell>
                        <TableCell className={staff.sun === 'OFF' ? 'text-muted-foreground' : ''}>{staff.sun}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Report Generator</CardTitle>
                <CardDescription>Generate custom reports for facility management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Select Report Type</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="attendance" />
                        <label htmlFor="attendance">Attendance Report</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="facility-usage" />
                        <label htmlFor="facility-usage">Facility Usage</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-performance" />
                        <label htmlFor="staff-performance">Staff Performance</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="maintenance" />
                        <label htmlFor="maintenance">Maintenance Log</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="inventory" />
                        <label htmlFor="inventory">Inventory Status</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="member-satisfaction" />
                        <label htmlFor="member-satisfaction">Member Satisfaction</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Report Period</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline">Today</Button>
                      <Button variant="outline">This Week</Button>
                      <Button variant="outline">This Month</Button>
                      <Button variant="outline">Custom Range</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Report Format</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button variant="outline">PDF</Button>
                      <Button variant="outline">Excel</Button>
                      <Button variant="outline">CSV</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Generate Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffAdvancedDashboard;
