
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectToDatabase } from '@/integrations/mongodb/client';
import MaintenanceRequest from '@/integrations/mongodb/models/MaintenanceRequest';
import type { MaintenanceRequest as MaintenanceRequestType, MaintenanceStatus, MaintenancePriority } from '@/types/database';
import { format } from 'date-fns';

interface MaintenanceRequestWithNames extends MaintenanceRequestType {
  reportedByName?: string;
  assignedToName?: string;
}

const MaintenanceManagement = () => {
  const { isAdmin, isStaff, token, user } = useAuth();
  const queryClient = useQueryClient();
  const [requests, setRequests] = useState<MaintenanceRequestWithNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequestWithNames | null>(null);
  const [facility, setFacility] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<MaintenancePriority>('low');
  const [status, setStatus] = useState<MaintenanceStatus>('pending');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<MaintenancePriority | 'all'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch maintenance requests from mock data
  const { data: requestItems = [], isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: async () => {
      try {
        await connectToDatabase();

        const maintenanceObj = MaintenanceRequest.find().sort({ created_at: -1 });
        const maintenanceData = await maintenanceObj.exec();

        // Mock user names since we don't have real User model
        const userMap = new Map();
        userMap.set('123', 'John Doe');
        userMap.set('456', 'Jane Smith');
        userMap.set('789', 'Bob Johnson');

        // Format the data to match our interface
        const formattedRequests: MaintenanceRequestWithNames[] = maintenanceData.map(req => ({
          id: req._id.toString(),
          facility: req.facility,
          issue: req.issue,
          priority: req.priority,
          status: req.status,
          reported_by: req.reported_by.toString(),
          reportedByName: userMap.get(req.reported_by.toString()) || 'Unknown User',
          assigned_to: req.assigned_to ? req.assigned_to.toString() : null,
          assignedToName: req.assigned_to ? userMap.get(req.assigned_to.toString()) || 'Unassigned' : 'Unassigned',
          resolved_at: req.resolved_at ? req.resolved_at.toISOString() : null,
          created_at: req.created_at.toISOString(),
          updated_at: req.updated_at.toISOString()
        }));

        return formattedRequests;
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        toast.error("Failed to load maintenance requests");
        return [];
      }
    },
    enabled: true // Always enabled in frontend-only mode
  });

  // Fetch users for assigning requests
  useEffect(() => {
    // Mock users data since we no longer have a User model
    const mockUsers = [
      { id: '456', name: 'Jane Smith (Staff)' },
      { id: '789', name: 'Bob Johnson (Admin)' }
    ];
    
    setUsers(mockUsers);
  }, [isAdmin, isStaff]);

  const createMaintenanceRequestMutation = useMutation({
    mutationFn: async (requestData: Omit<MaintenanceRequestType, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) => {
      // Mock implementation that uses our mock MaintenanceRequest model
      await connectToDatabase();
      console.log('Mock: Creating maintenance request with data:', requestData);
      // This will use our mock implementation in MaintenanceRequest.js
      const newRequest = {
        ...requestData,
        _id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
        resolved_at: null
      };

      // We don't actually save to MongoDB, this is just for the mock
      await MaintenanceRequest.findByIdAndUpdate(newRequest._id, newRequest);
      
      return newRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance request created successfully');
      closeDialog();
    },
    onError: (error) => {
      console.error('Error creating maintenance request:', error);
      toast.error('Failed to create maintenance request');
    }
  });

  const updateMaintenanceRequestMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      assignedTo
    }: {
      id: string;
      status?: MaintenanceStatus;
      assignedTo?: string | null;
    }) => {
      // Mock implementation
      await connectToDatabase();
      console.log('Mock: Updating maintenance request with id:', id);

      const updateData: any = {
        updated_at: new Date()
      };

      if (status) {
        updateData.status = status;
        if (status === 'resolved') {
          updateData.resolved_at = new Date();
        }
      }

      if (assignedTo !== undefined) {
        updateData.assigned_to = assignedTo === 'unassigned' ? null : assignedTo;
      }

      await MaintenanceRequest.findByIdAndUpdate(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance request updated successfully');
      closeDialog();
    },
    onError: (error) => {
      console.error('Error updating maintenance request:', error);
      toast.error('Failed to update maintenance request');
    }
  });

  // Filter requests based on search term, status, and priority
  const filteredRequests = requestItems.filter(request => {
    const matchesSearchTerm = !searchTerm ||
      request.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.reportedByName && request.reportedByName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

    return matchesSearchTerm && matchesStatus && matchesPriority;
  });

  const openDialog = () => {
    setIsDialogOpen(true);
    setSelectedRequest(null);
    setFacility('');
    setIssue('');
    setPriority('low');
    setStatus('pending');
    setAssignedTo(null);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleCreateRequest = async () => {
    if (!facility || !issue) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      await createMaintenanceRequestMutation.mutateAsync({
        facility,
        issue,
        priority,
        status,
        reported_by: user?.id || '',
        assigned_to: null
      });
    } catch (error) {
      console.error("Error creating maintenance request:", error);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      await updateMaintenanceRequestMutation.mutateAsync({
        id: selectedRequest.id,
        status: status,
        assignedTo: assignedTo
      });
    } catch (error) {
      console.error("Error updating maintenance request:", error);
    }
  };

  const handleOpenEditDialog = (request: MaintenanceRequestWithNames) => {
    setSelectedRequest(request);
    setFacility(request.facility);
    setIssue(request.issue);
    setPriority(request.priority);
    setStatus(request.status);
    setAssignedTo(request.assigned_to);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy - hh:mm a');
  };

  const handleSubmitRequest = async () => {
    if (!facility || !issue) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await createMaintenanceRequestMutation.mutateAsync({
        facility: facility,
        issue: issue,
        priority: priority,
        status: 'pending',
        reported_by: user?.id || '',
        assigned_to: null
      });
      
      setFacility('');
      setIssue('');
      setPriority('low');
      setIsDialogOpen(false);
      toast.success('Maintenance request submitted successfully');
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      toast.error('Failed to submit maintenance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin && !isStaff) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">You don't have permission to access this feature.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Management</CardTitle>
          <CardDescription>Create, assign, and manage maintenance requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search requests..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MaintenanceStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as MaintenancePriority | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={openDialog}>Add Request</Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading maintenance requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No maintenance requests found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.facility}</TableCell>
                    <TableCell>{request.issue}</TableCell>
                    <TableCell>{request.priority}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{request.reportedByName}</TableCell>
                    <TableCell>{request.assignedToName}</TableCell>
                    <TableCell>{formatDate(request.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(request)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRequest ? 'Edit Request' : 'Create Request'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facility" className="text-right">
                Facility
              </Label>
              <Input
                id="facility"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issue" className="text-right">
                Issue
              </Label>
              <Textarea
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as MaintenancePriority)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as MaintenanceStatus)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assign To
              </Label>
              <Select value={assignedTo || 'unassigned'} onValueChange={(value) => setAssignedTo(value === 'unassigned' ? null : value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={selectedRequest ? handleUpdateRequest : handleSubmitRequest}>
              {selectedRequest ? 'Update Request' : 'Create Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaintenanceManagement;
