import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectToDatabase } from '@/integrations/mongodb/client';
import MaintenanceRequest from '@/integrations/mongodb/models/MaintenanceRequest';
import { mockMaintenanceRequests } from '@/mocks/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const MaintenanceManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    facility: '',
    issue: '',
    priority: 'medium',
  });
  const [editRequest, setEditRequest] = useState({
    id: '',
    status: 'pending',
  });

  // Fetch maintenance requests using react-query
  const { data: maintenanceRequests = [], isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: async () => {
      try {
        await connectToDatabase();
        return mockMaintenanceRequests;
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        return [];
      }
    },
  });

  // Mutation to create a new maintenance request
  const createMaintenanceRequestMutation = useMutation({
    mutationFn: async (request: any) => {
      // Mock implementation
      console.log('Mock: Creating maintenance request', request);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance request created successfully');
      setOpen(false);
      setNewRequest({ facility: '', issue: '', priority: 'medium' });
    },
    onError: (error) => {
      console.error('Error creating maintenance request:', error);
      toast.error('Failed to create maintenance request');
    },
  });

  // Mutation to update a maintenance request
  const updateMaintenanceRequestMutation = useMutation({
    mutationFn: async (request: any) => {
      // Mock implementation
      console.log('Mock: Updating maintenance request', request);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance request updated successfully');
      setEditOpen(false);
      setEditRequest({ id: '', status: 'pending' });
    },
    onError: (error) => {
      console.error('Error updating maintenance request:', error);
      toast.error('Failed to update maintenance request');
    },
  });

  const handleCreate = async () => {
    await createMaintenanceRequestMutation.mutateAsync(newRequest);
  };

  const handleUpdate = async () => {
    await updateMaintenanceRequestMutation.mutateAsync(editRequest);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Management</CardTitle>
          <CardDescription>
            Manage maintenance requests for club facilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <Table>
                <TableCaption>
                  A list of maintenance requests that are currently pending.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    maintenanceRequests
                      .filter((request) => request.status === 'pending')
                      .map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>{request.facility}</TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.priority}</TableCell>
                          <TableCell>{user?.name}</TableCell>
                          <TableCell className="text-right">
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setEditRequest({
                                    id: request._id,
                                    status: request.status,
                                  })
                                }
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="in_progress">
              <Table>
                <TableCaption>
                  A list of maintenance requests that are currently in progress.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    maintenanceRequests
                      .filter((request) => request.status === 'in_progress')
                      .map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>{request.facility}</TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.priority}</TableCell>
                          <TableCell>{user?.name}</TableCell>
                          <TableCell className="text-right">
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setEditRequest({
                                    id: request._id,
                                    status: request.status,
                                  })
                                }
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="resolved">
              <Table>
                <TableCaption>
                  A list of maintenance requests that have been resolved.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Resolved At</TableHead>
                    <TableHead>Resolved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    maintenanceRequests
                      .filter((request) => request.status === 'resolved')
                      .map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>{request.facility}</TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.priority}</TableCell>
                          <TableCell>
                            {request.resolved_at ? 
                              (request.resolved_at instanceof Date ? 
                                request.resolved_at.toLocaleDateString() : 
                                String(request.resolved_at)) : 'N/A'}
                          </TableCell>
                          <TableCell>{user?.name}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <DialogTrigger asChild>
              <Button>Add Request</Button>
            </DialogTrigger>
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Maintenance Request</DialogTitle>
            <DialogDescription>
              Add a new maintenance request to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="facility">Facility</Label>
              <Input
                id="facility"
                placeholder="Tennis Court"
                value={newRequest.facility}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, facility: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="issue">Issue</Label>
              <Input
                id="issue"
                placeholder="Net needs replacement"
                value={newRequest.issue}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, issue: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newRequest.priority}
                onValueChange={(value) =>
                  setNewRequest({ ...newRequest, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreate}>
              Add Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Request</DialogTitle>
            <DialogDescription>
              Edit the status of the maintenance request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editRequest.status}
                onValueChange={(value) =>
                  setEditRequest({ ...editRequest, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceManagement;
