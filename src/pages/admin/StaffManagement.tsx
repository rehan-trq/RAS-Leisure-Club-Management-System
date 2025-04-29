
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Edit, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
}

const StaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch staff members (role = 'staff' or 'admin')
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .or('role.eq.staff,role.eq.admin')
        .order('full_name');
      
      if (error) {
        toast({
          title: 'Error fetching staff members',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Transform to StaffMember interface - in a real app, department and status would come from database
      const staff: StaffMember[] = data.map(profile => ({
        id: profile.id,
        full_name: profile.full_name || 'Unknown',
        email: profile.email || 'No email',
        role: profile.role,
        department: profile.role === 'admin' ? 'Management' : 'Operations',
        status: 'active',
      }));
      
      return staff;
    }
  });
  
  // Filter staff based on search query
  const filteredStaff = staffMembers?.filter(staff => 
    staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update staff role/status mutation
  const updateStaffMutation = useMutation({
    mutationFn: async (data: { id: string; role?: string; status?: 'active' | 'inactive' | 'on_leave' }) => {
      const updates: any = {};
      if (data.role) updates.role = data.role;
      // In a real app, you would also update status
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', data.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({ title: "Staff member updated successfully" });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update staff member", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage staff members and their roles
          </p>
        </div>
        
        <Button className="mt-4 md:mt-0" onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
      <div className="mb-6">
        <Input 
          placeholder="Search by name, email, or department..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Staff Members
          </CardTitle>
          <Badge variant="outline">{staffMembers?.length || 0} Total</Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading staff data...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff && filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.full_name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{staff.role}</Badge>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(staff.status)}>{staff.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setCurrentStaff(staff);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {searchQuery ? 'No matching staff found' : 'No staff members found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          
          {currentStaff && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{currentStaff.full_name}</h3>
                <p className="text-sm text-muted-foreground">{currentStaff.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Role</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant={currentStaff.role === 'staff' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStaffMutation.mutate({ 
                        id: currentStaff.id, 
                        role: 'staff' 
                      })}
                    >
                      Staff
                    </Button>
                    <Button 
                      variant={currentStaff.role === 'admin' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStaffMutation.mutate({ 
                        id: currentStaff.id, 
                        role: 'admin' 
                      })}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant={currentStaff.status === 'active' ? 'default' : 'outline'}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // In a real app, this would update the status in the database
                        toast({ title: "Status update not implemented in demo" });
                      }}
                    >
                      Active
                    </Button>
                    <Button 
                      variant={currentStaff.status === 'inactive' ? 'default' : 'outline'}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        toast({ title: "Status update not implemented in demo" });
                      }}
                    >
                      Inactive
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog (in real app would have form fields) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              In a complete implementation, this would contain a form to add new staff members.
              <br /><br />
              For this demo, you can use the signup page and then change their role to 'staff' or 'admin'.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setIsAddDialogOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
