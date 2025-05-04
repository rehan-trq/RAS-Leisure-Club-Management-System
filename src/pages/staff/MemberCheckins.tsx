
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const MemberCheckins = () => {
  // Mock data for member check-ins
  const checkIns = [
    { id: 1, member: 'John Smith', facility: 'Gym', checkInTime: '08:30 AM', checkOutTime: '10:15 AM', date: '2025-05-04' },
    { id: 2, member: 'Emily Johnson', facility: 'Swimming Pool', checkInTime: '09:45 AM', checkOutTime: null, date: '2025-05-04' },
    { id: 3, member: 'Michael Brown', facility: 'Tennis Court', checkInTime: '11:00 AM', checkOutTime: '12:30 PM', date: '2025-05-04' },
    { id: 4, member: 'Sophia Davis', facility: 'Spa', checkInTime: '01:15 PM', checkOutTime: '02:45 PM', date: '2025-05-04' },
    { id: 5, member: 'Daniel Wilson', facility: 'Gym', checkInTime: '03:30 PM', checkOutTime: null, date: '2025-05-04' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Member Check-ins</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Check-in Filters</CardTitle>
            <CardDescription>Filter member check-ins by various parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Facility</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Facilities</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="pool">Swimming Pool</SelectItem>
                    <SelectItem value="tennis">Tennis Courts</SelectItem>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="sauna">Sauna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <div className="flex">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Today (May 4, 2025)
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Search Member</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name" className="pl-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Check-ins</CardTitle>
            <CardDescription>
              Real-time view of member check-ins across all facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of today's check-ins and check-outs.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Check-out Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkIns.map((checkIn) => (
                  <TableRow key={checkIn.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-primary" />
                        </span>
                        {checkIn.member}
                      </div>
                    </TableCell>
                    <TableCell>{checkIn.facility}</TableCell>
                    <TableCell>{checkIn.checkInTime}</TableCell>
                    <TableCell>{checkIn.checkOutTime || '—'}</TableCell>
                    <TableCell>
                      {checkIn.checkOutTime ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberCheckins;
