
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRequest } from '@/types/database';

const MaintenanceManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { maintenanceRequests: contextRequests, updateMaintenanceStatus } = useData();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<MaintenanceRequest | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [newIssue, setNewIssue] = useState({
    facility: '',
    issue: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  
  // Fetch staff for assignment
  const { data: staffMembers } = useQuery({
    queryKey: ['maintenance-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'staff');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch maintenance requests (with more details than context)
  const { data: maintenanceRequests, isLoading } = useQuery({
    queryKey: ['maintenance-requests-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          reporter:reported_by(full_name),
          assignee:assigned_to(full_name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  const handleAssignMaintenance = async (assignedToId: string) => {
    if (!currentRequest) return;
    
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ assigned_to: assignedToId, status: 'in_progress' })
        .eq('id', currentRequest.id);
        
      if (error) throw error;
      
      // Update local state
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests-detailed'] });
      toast({ title: "Task assigned successfully" });
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      toast({ 
        title: "Failed to assign task", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const createMaintenanceRequest = useMutation({
    mutationFn: async (data: typeof newIssue & { reported_by: string }) => {
      const { error } = await supabase
        .from('maintenance_requests')
        .insert([data]);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests-detailed'] });
      toast({ title: "Maintenance request created successfully" });
      setIsAddDialogOpen(false);
      setNewIssue({
        facility: '',
        issue: '',
        priority: 'medium'
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create maintenance request", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const handleCreateRequest = async () => {
    const { facility, issue, priority } = newIssue;
    
    if (!facility || !issue) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user.id) {
        throw new Error("You must be logged in");
      }
      
      await createMaintenanceRequest.mutateAsync({
        ...newIssue,
        reported_by: data.session.user.id
      });
    } catch (error: any) {
      toast({
        title: "Failed to create request",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Filter requests based on active tab
  const filteredRequests = maintenanceRequests?.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Facility Maintenance</h1>
          <p className="text-muted-foreground">
            Manage maintenance requests for all facilities
          </p>
        </div>
        
        <Button className="mt-4 md:mt-0" onClick={() => setIsAddDialogOpen(true)}>
          <Wrench className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Wrench className="mr-2 h-5 w-5 text-primary" />
            Maintenance Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center p-8">Loading maintenance requests...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facility</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests && filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.facility}</TableCell>
                            <TableCell>{request.issue}</TableCell>
                            <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell>{request.reporter?.full_name || 'Unknown'}</TableCell>
                            <TableCell>{request.assignee?.full_name || 'Unassigned'}</TableCell>
                            <TableCell className="text-right">
                              {request.status === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setCurrentRequest(request);
                                    setIsAssignDialogOpen(true);
                                  }}
                                >
                                  Assign
                                </Button>
                              )}
                              {request.status === 'in_progress' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      await updateMaintenanceStatus(request.id, 'resolved');
                                      toast({ title: "Task marked as resolved" });
                                    } catch (error) {
                                      console.error('Error resolving task:', error);
                                    }
                                  }}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Resolve
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No maintenance requests found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Assign Task Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
          </DialogHeader>
          
          {currentRequest && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{currentRequest.facility}</h3>
                <p className="text-sm text-muted-foreground">{currentRequest.issue}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Priority:</span>
                  {getPriorityBadge(currentRequest.priority)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assign to Staff Member
                </label>
                <Select onValueChange={(value) => handleAssignMaintenance(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers?.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Maintenance Request Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Facility
              </label>
              <Select
                value={newIssue.facility}
                onValueChange={(value) => setNewIssue({...newIssue, facility: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pool">Pool</SelectItem>
                  <SelectItem value="Gym">Gym</SelectItem>
                  <SelectItem value="Tennis Courts">Tennis Courts</SelectItem>
                  <SelectItem value="Basketball Courts">Basketball Courts</SelectItem>
                  <SelectItem value="Locker Rooms">Locker Rooms</SelectItem>
                  <SelectItem value="Reception">Reception</SelectItem>
                  <SelectItem value="Parking Lot">Parking Lot</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Issue Description
              </label>
              <Textarea
                placeholder="Describe the issue..."
                value={newIssue.issue}
                onChange={(e) => setNewIssue({...newIssue, issue: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Priority
              </label>
              <Select
                value={newIssue.priority}
                onValueChange={(value: any) => setNewIssue({...newIssue, priority: value})}
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest}>
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceManagement;
