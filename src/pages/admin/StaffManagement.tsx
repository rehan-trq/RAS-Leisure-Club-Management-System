import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectToDatabase } from '@/integrations/mongodb/client';
import User from '@/integrations/mongodb/models/User';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Pencil, Trash, Search } from 'lucide-react';
import type { UserRole } from '@/types/database';

interface StaffMember {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

const StaffManagement = () => {
  const { isAdmin, isStaff, token } = useAuth();
  const queryClient = useQueryClient();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('staff');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch staff members from database
  const { data: staffData = [], isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      try {
        await connectToDatabase();
        const staff = await User.find({ role: { $in: ['staff', 'admin'] } }).sort({ full_name: 1 });
        return staff.map(member => ({
          id: member._id.toString(),
          email: member.email,
          full_name: member.full_name,
          role: member.role as UserRole,
          created_at: member.created_at.toISOString()
        })) as StaffMember[];
      } catch (error) {
        console.error("Error fetching staff members:", error);
        toast.error("Failed to load staff members");
        return [];
      }
    },
    enabled: !!token && (isAdmin || isStaff)
  });

  // Mutation to create a new staff member
  const createStaffMutation = useMutation({
    mutationFn: async () => {
      await connectToDatabase();
      // Placeholder for creating a new staff member
      console.log('Creating staff member', { newFullName, newEmail, newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast.success('Staff member created successfully');
      setIsCreateOpen(false);
    },
    onError: (error) => {
      console.error('Error creating staff member:', error);
      toast.error('Failed to create staff member');
    }
  });

  // Mutation to update a staff member
  const updateStaffMutation = useMutation({
    mutationFn: async () => {
      await connectToDatabase();
      // Placeholder for updating a staff member
      console.log('Updating staff member', { selectedStaff, newFullName, newEmail, newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast.success('Staff member updated successfully');
      setIsEditOpen(false);
    },
    onError: (error) => {
      console.error('Error updating staff member:', error);
      toast.error('Failed to update staff member');
    }
  });

  // Mutation to delete a staff member
  const deleteStaffMutation = useMutation({
    mutationFn: async () => {
      await connectToDatabase();
      // Placeholder for deleting a staff member
      console.log('Deleting staff member', selectedStaff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast.success('Staff member deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting staff member:', error);
      toast.error('Failed to delete staff member');
    }
  });

  // Filter staff members based on search term
  const filteredStaff = staffData.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.full_name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower)
    );
  });

  const openCreateDialog = () => {
    setNewFullName('');
    setNewEmail('');
    setNewRole('staff');
    setIsCreateOpen(true);
  };

  const openEditDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setNewFullName(member.full_name);
    setNewEmail(member.email);
    setNewRole(member.role);
    setIsEditOpen(true);
  };

  const handleDeleteStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    deleteStaffMutation.mutate();
  };

  if (!isAdmin) {
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
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Manage staff members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading staff data...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No staff members match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(member)}
                          title="Edit staff member"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStaff(member)}
                          title="Delete staff member"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Staff Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => createStaffMutation.mutate()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Edit staff member details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => updateStaffMutation.mutate()}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StaffManagement;
