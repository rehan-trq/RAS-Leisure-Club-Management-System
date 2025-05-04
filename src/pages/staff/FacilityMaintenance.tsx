
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, ArrowRight, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { connectToDatabase } from '@/integrations/mongodb/client';
import MaintenanceRequest from '@/integrations/mongodb/models/MaintenanceRequest';
import { mockMaintenanceRequests } from '@/mocks/mockData';

const FacilityMaintenance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newRequest, setNewRequest] = useState({
    facility: '',
    issue: '',
    priority: 'medium',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Fetch maintenance requests
  const { data: maintenanceRequests = [], isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: async () => {
      try {
        // Mock connection
        await connectToDatabase();
        return mockMaintenanceRequests;
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        return [];
      }
    },
  });
  
  // Mutation to update request status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await MaintenanceRequest.findByIdAndUpdate(id, {
        status,
        updated_at: new Date(),
        ...(status === 'resolved' ? { resolved_at: new Date() } : {})
      });
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance status updated');
      setSelectedRequest(null);
    }
  });

  // Mutation to create new request
  const createRequestMutation = useMutation({
    mutationFn: async (request: any) => {
      // Mock implementation
      console.log('Creating maintenance request:', request);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance request created');
      setDialogOpen(false);
      setNewRequest({ facility: '', issue: '', priority: 'medium' });
    }
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleCreateRequest = () => {
    if (!newRequest.facility || !newRequest.issue) {
      toast.error('Please fill in all required fields');
      return;
    }
    createRequestMutation.mutate({
      ...newRequest,
      reported_by: user?.name || 'Staff Member',
      status: 'pending',
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Facility Maintenance</h1>
            <p className="text-muted-foreground">Manage and track maintenance requests</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Wrench className="mr-2 h-4 w-4" />
                New Maintenance Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Maintenance Request</DialogTitle>
                <DialogDescription>
                  Create a new maintenance request for a facility
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Select 
                    value={newRequest.facility} 
                    onValueChange={(value) => setNewRequest({...newRequest, facility: value})}
                  >
                    <SelectTrigger id="facility">
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="pool">Swimming Pool</SelectItem>
                      <SelectItem value="tennis">Tennis Court</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="sauna">Sauna</SelectItem>
                      <SelectItem value="locker">Locker Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newRequest.priority} 
                    onValueChange={(value) => setNewRequest({...newRequest, priority: value})}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="issue">Issue Description</Label>
                  <Textarea 
                    id="issue" 
                    value={newRequest.issue}
                    onChange={(e) => setNewRequest({...newRequest, issue: e.target.value})}
                    placeholder="Describe the maintenance issue"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateRequest}>Create Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>View and manage all maintenance requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                <Table>
                  <TableCaption>Pending maintenance requests awaiting action.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading requests...</TableCell>
                      </TableRow>
                    ) : maintenanceRequests.filter(r => r.status === 'pending').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No pending maintenance requests</TableCell>
                      </TableRow>
                    ) : (
                      maintenanceRequests
                        .filter(request => request.status === 'pending')
                        .map(request => (
                          <TableRow key={request._id}>
                            <TableCell>{getStatusIcon(request.status)} Pending</TableCell>
                            <TableCell>{request.facility}</TableCell>
                            <TableCell>{request.issue.substring(0, 40)}{request.issue.length > 40 ? '...' : ''}</TableCell>
                            <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                            <TableCell>{request.reported_by}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(request._id, 'in_progress')}
                              >
                                Start Work
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="in_progress">
                <Table>
                  <TableCaption>Maintenance requests currently in progress.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading requests...</TableCell>
                      </TableRow>
                    ) : maintenanceRequests.filter(r => r.status === 'in_progress').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No maintenance requests in progress</TableCell>
                      </TableRow>
                    ) : (
                      maintenanceRequests
                        .filter(request => request.status === 'in_progress')
                        .map(request => (
                          <TableRow key={request._id}>
                            <TableCell>{getStatusIcon(request.status)} In Progress</TableCell>
                            <TableCell>{request.facility}</TableCell>
                            <TableCell>{request.issue.substring(0, 40)}{request.issue.length > 40 ? '...' : ''}</TableCell>
                            <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                            <TableCell>{request.reported_by}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(request._id, 'resolved')}
                              >
                                Mark Resolved
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="resolved">
                <Table>
                  <TableCaption>Maintenance requests that have been resolved.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Resolved Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading requests...</TableCell>
                      </TableRow>
                    ) : maintenanceRequests.filter(r => r.status === 'resolved').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No resolved maintenance requests</TableCell>
                      </TableRow>
                    ) : (
                      maintenanceRequests
                        .filter(request => request.status === 'resolved')
                        .map(request => (
                          <TableRow key={request._id}>
                            <TableCell>{getStatusIcon(request.status)} Resolved</TableCell>
                            <TableCell>{request.facility}</TableCell>
                            <TableCell>{request.issue.substring(0, 40)}{request.issue.length > 40 ? '...' : ''}</TableCell>
                            <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                            <TableCell>{request.reported_by}</TableCell>
                            <TableCell>
                              {request.resolved_at 
                                ? (request.resolved_at instanceof Date 
                                  ? request.resolved_at.toLocaleDateString() 
                                  : new Date(request.resolved_at).toLocaleDateString())
                                : 'N/A'
                              }
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="all">
                <Table>
                  <TableCaption>All maintenance requests in the system.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading requests...</TableCell>
                      </TableRow>
                    ) : maintenanceRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No maintenance requests</TableCell>
                      </TableRow>
                    ) : (
                      maintenanceRequests.map(request => (
                        <TableRow key={request._id}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>{request.facility}</TableCell>
                          <TableCell>{request.issue.substring(0, 40)}{request.issue.length > 40 ? '...' : ''}</TableCell>
                          <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                          <TableCell>{request.reported_by}</TableCell>
                          <TableCell>
                            {request.status === 'pending' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(request._id, 'in_progress')}
                              >
                                Start Work
                              </Button>
                            ) : request.status === 'in_progress' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(request._id, 'resolved')}
                              >
                                Mark Resolved
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled
                              >
                                Completed
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilityMaintenance;
