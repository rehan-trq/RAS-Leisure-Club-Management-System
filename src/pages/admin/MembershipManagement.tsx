import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge as BadgeIcon, Clock, CalendarDays, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MembershipType {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  benefits: string[];
}

interface MemberWithMembership {
  id: string;
  full_name: string;
  email: string;
  membership_type: string;
  status: 'active' | 'expired' | 'pending';
  start_date: string;
  end_date: string;
}

const membershipTypes: MembershipType[] = [
  {
    id: '1',
    name: 'Standard',
    price: 49.99,
    duration: 1,
    benefits: ['Gym access', 'Pool access', 'Group classes (limited)']
  },
  {
    id: '2',
    name: 'Premium',
    price: 89.99,
    duration: 1,
    benefits: ['All Standard benefits', 'Unlimited group classes', 'Sauna access', 'One personal training session/month']
  },
  {
    id: '3',
    name: 'Platinum',
    price: 149.99,
    duration: 1,
    benefits: ['All Premium benefits', 'Unlimited personal training', 'VIP locker', 'Guest passes (2/month)', 'Nutrition consultation']
  },
  {
    id: '4',
    name: 'Annual Standard',
    price: 499.99,
    duration: 12,
    benefits: ['All Standard benefits', '15% discount vs. monthly', 'Free gym bag']
  },
  {
    id: '5',
    name: 'Annual Premium',
    price: 899.99,
    duration: 12,
    benefits: ['All Premium benefits', '15% discount vs. monthly', 'Free gym bag', 'Additional guest passes']
  }
];

const MembershipManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isChangeMembershipOpen, setIsChangeMembershipOpen] = useState(false);
  const [isExtendMembershipOpen, setIsExtendMembershipOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberWithMembership | null>(null);
  const [newMembershipType, setNewMembershipType] = useState('');
  const [extensionMonths, setExtensionMonths] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<MembershipType[]>([]);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        const mockMemberships = [
          {
            id: '1',
            name: 'Premium',
            price: 99.99,
            duration: 30,
            description: 'Full access to all facilities and premium services',
            benefits: ['Unlimited access', 'Personal trainer', 'Spa access', 'Priority booking'],
            isActive: true
          },
          // ... more mock memberships
        ];
        
        setMemberships(mockMemberships);
      } catch (error) {
        console.error('Error fetching memberships:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMemberships();
  }, []);

  // Fetch members with their membership data
  const { data: members, isLoading } = useQuery({
    queryKey: ['members-with-memberships'],
    queryFn: async () => {
      // In a real app, this would join profiles with a memberships table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'member');
      
      if (error) {
        toast({
          title: 'Error fetching members',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Mock membership data - in a real app this would come from a memberships table
      const membersWithData: MemberWithMembership[] = profiles.map((profile) => {
        // Generate random membership data for demo
        const types = ['Standard', 'Premium', 'Platinum', 'Annual Standard', 'Annual Premium'];
        const statuses = ['active', 'expired', 'pending'] as const;
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate random dates
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
        
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + (randomType.includes('Annual') ? 12 : 1));
        
        return {
          id: profile.id,
          full_name: profile.full_name || 'Unknown',
          email: profile.email || 'No email',
          membership_type: randomType,
          status: randomStatus,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        };
      });
      
      return membersWithData;
    }
  });

  // Change membership type mutation
  const changeMembershipMutation = useMutation({
    mutationFn: async (data: { memberId: string; membershipType: string }) => {
      // In a real app, this would update a memberships table
      toast({
        title: 'Membership changed',
        description: `Membership updated to ${data.membershipType}`,
      });
      
      // Return mock data for the UI update
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members-with-memberships'] });
      setIsChangeMembershipOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to change membership',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Extend membership mutation
  const extendMembershipMutation = useMutation({
    mutationFn: async (data: { memberId: string; months: number }) => {
      // In a real app, this would update a memberships table
      toast({
        title: 'Membership extended',
        description: `Membership extended by ${data.months} months`,
      });
      
      // Return mock data for the UI update
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members-with-memberships'] });
      setIsExtendMembershipOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to extend membership',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleChangeMembership = async () => {
    if (!selectedMember || !newMembershipType) return;
    
    try {
      await changeMembershipMutation.mutateAsync({
        memberId: selectedMember.id,
        membershipType: newMembershipType
      });
    } catch (error) {
      console.error('Error changing membership:', error);
    }
  };

  const handleExtendMembership = async () => {
    if (!selectedMember || !extensionMonths) return;
    
    try {
      await extendMembershipMutation.mutateAsync({
        memberId: selectedMember.id,
        months: parseInt(extensionMonths)
      });
    } catch (error) {
      console.error('Error extending membership:', error);
    }
  };

  // Filter members based on search query
  const filteredMembers = members?.filter(member => 
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.membership_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMembershipStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Membership Management</h1>
          <p className="text-muted-foreground">
            Manage member status and membership plans
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BadgeIcon className="mr-2 h-5 w-5 text-primary" />
              <span>Active Memberships</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {members?.filter(m => m.status === 'active').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Current active members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <span>Expiring Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {/* Mock data - in a real app would calculate from actual expiration dates */}
              12
            </div>
            <p className="text-sm text-muted-foreground">Memberships expiring in 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" />
              <span>New This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {/* Mock data - in a real app would calculate from actual join dates */}
              24
            </div>
            <p className="text-sm text-muted-foreground">New memberships this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Types Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {membershipTypes.map((type) => (
              <Card key={type.id} className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <p className="text-2xl font-bold">
                    ${type.price.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{type.duration === 1 ? 'month' : 'year'}
                    </span>
                  </p>
                  <ul className="text-sm space-y-1">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Members List Section */}
      <div className="mb-6">
        <Input 
          placeholder="Search members by name, email, or membership type..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Member Memberships</span>
            <Badge variant="outline">{members?.length || 0} Members</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading member data...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Membership Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers && filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.full_name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.membership_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {getMembershipStatusBadge(member.status)}
                        </TableCell>
                        <TableCell>{member.start_date}</TableCell>
                        <TableCell>{member.end_date}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setSelectedMember(member);
                              setNewMembershipType(member.membership_type);
                              setIsChangeMembershipOpen(true);
                            }}
                          >
                            Change
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setExtensionMonths('1');
                              setIsExtendMembershipOpen(true);
                            }}
                          >
                            Extend
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {searchQuery ? 'No matching members found' : 'No members found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            <AlertCircle className="inline h-3 w-3 mr-1" />
            <span>Members with expired memberships need to renew to regain facility access.</span>
          </div>
        </CardFooter>
      </Card>

      {/* Change Membership Dialog */}
      <Dialog open={isChangeMembershipOpen} onOpenChange={setIsChangeMembershipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Membership</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{selectedMember.full_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Current Membership:</span>
                  <Badge variant="secondary">{selectedMember.membership_type}</Badge>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Membership Type
                </label>
                <Select value={newMembershipType} onValueChange={setNewMembershipType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership type" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name} - ${type.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeMembershipOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeMembership}>
              Change Membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Membership Dialog */}
      <Dialog open={isExtendMembershipOpen} onOpenChange={setIsExtendMembershipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Membership</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{selectedMember.full_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Current expiration: {selectedMember.end_date}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Extend by (months)
                </label>
                <Select value={extensionMonths} onValueChange={setExtensionMonths}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtendMembershipOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtendMembership}>
              Extend Membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipManagement;
