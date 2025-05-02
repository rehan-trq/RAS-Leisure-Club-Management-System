
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Filter, Star, MessageSquare, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectToDatabase } from '@/integrations/mongodb/client';
import Feedback from '@/integrations/mongodb/models/Feedback';
import User from '@/integrations/mongodb/models/User';
import { useAuth } from '@/contexts/AuthContext';
import type { Feedback as FeedbackType } from '@/types/database';

interface FeedbackWithUserName extends FeedbackType {
  memberName?: string;
}

const MemberFeedback: React.FC = () => {
  const { isAdmin, isStaff, token } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithUserName | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Fetch feedback from database
  const { data: feedbackItems = [], isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      try {
        await connectToDatabase();
        
        const feedbackData = await Feedback.find().sort({ submitted_at: -1 });
        
        // Get user names
        const userIds = [...new Set(feedbackData.map(fb => fb.member_id))];
        const users = await User.find({ _id: { $in: userIds } });
        
        // Map users to a dictionary for quick lookup
        const userMap = new Map();
        users.forEach(user => {
          userMap.set(user._id.toString(), user.full_name || 'Unknown User');
        });
        
        // Format the data to match our interface
        const formattedFeedback: FeedbackWithUserName[] = feedbackData.map(fb => ({
          id: fb._id.toString(),
          member_id: fb.member_id.toString(),
          memberName: userMap.get(fb.member_id.toString()) || 'Unknown User',
          service_type: fb.service_type,
          rating: fb.rating,
          comment: fb.comment,
          status: fb.status,
          staff_response: fb.staff_response,
          submitted_at: fb.submitted_at.toISOString(),
          created_at: fb.created_at.toISOString(),
          updated_at: fb.updated_at.toISOString()
        }));
        
        return formattedFeedback;
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load member feedback");
        return [];
      }
    },
    enabled: !!token && (isAdmin || isStaff)
  });

  // Mutation to update feedback
  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ 
      id, 
      staffResponse, 
      status 
    }: { 
      id: string; 
      staffResponse?: string; 
      status?: string;
    }) => {
      await connectToDatabase();
      const updateData: {[key: string]: any} = {
        updated_at: new Date()
      };
      
      if (staffResponse !== undefined) {
        updateData.staff_response = staffResponse;
        updateData.status = 'responded';
      }
      
      if (status !== undefined) {
        updateData.status = status;
      }
      
      await Feedback.findByIdAndUpdate(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Feedback updated successfully');
    },
    onError: (error) => {
      console.error('Error updating feedback:', error);
      toast.error('Failed to update feedback');
    }
  });

  // Filter feedback based on search term and filters
  const filteredFeedback = feedbackItems.filter(item => {
    // Filter by status
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    
    // Filter by rating
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      if (item.rating !== rating) {
        return false;
      }
    }
    
    // Search by name, service, or comment
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.memberName?.toLowerCase().includes(searchLower) || false) ||
        item.service_type.toLowerCase().includes(searchLower) ||
        item.comment.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by status (new first) and then by date (newest first)
    if (a.status === 'new' && b.status !== 'new') return -1;
    if (a.status !== 'new' && b.status === 'new') return 1;
    if (a.status === 'flagged' && b.status !== 'flagged') return -1;
    if (a.status !== 'flagged' && b.status === 'flagged') return 1;
    return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
  });

  const openDetail = (item: FeedbackWithUserName) => {
    setSelectedFeedback(item);
    setResponseText(item.staff_response || '');
    setIsDetailOpen(true);
  };

  const handleResponseSubmit = async () => {
    if (!selectedFeedback) return;
    
    try {
      await updateFeedbackMutation.mutateAsync({
        id: selectedFeedback.id,
        staffResponse: responseText
      });
      
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Error in handleResponseSubmit:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateFeedbackMutation.mutateAsync({
        id,
        status: newStatus
      });
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      case 'responded':
        return <Badge className="bg-green-100 text-green-800">Responded</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge>Unknown</Badge>;
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
          <CardTitle>Member Feedback & Ratings</CardTitle>
          <CardDescription>Review and respond to member feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-40">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Select 
                  value={ratingFilter} 
                  onValueChange={setRatingFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">★★★★★</SelectItem>
                    <SelectItem value="4">★★★★</SelectItem>
                    <SelectItem value="3">★★★</SelectItem>
                    <SelectItem value="2">★★</SelectItem>
                    <SelectItem value="1">★</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading feedback data...</p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No feedback matches your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.memberName}</div>
                      <div className="text-xs text-muted-foreground">{item.member_id.substring(0, 8)}</div>
                    </TableCell>
                    <TableCell>{item.service_type}</TableCell>
                    <TableCell>{renderStars(item.rating)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.comment}>
                        {item.comment}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.submitted_at)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDetail(item)}
                          title="View details"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        
                        {item.status !== 'flagged' && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleStatusChange(item.id, 'flagged')}
                            title="Flag for attention"
                          >
                            <Filter className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                        
                        {item.status !== 'archived' && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleStatusChange(item.id, 'archived')}
                            title="Archive feedback"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              From {selectedFeedback?.memberName} on {selectedFeedback?.service_type}
            </DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {renderStars(selectedFeedback.rating)}
                  <span className="ml-2 font-medium">
                    {selectedFeedback.rating}/5
                  </span>
                </div>
                <div>
                  {getStatusBadge(selectedFeedback.status)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Comment</h4>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{selectedFeedback.comment}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Submitted on {formatDate(selectedFeedback.submitted_at)}
                </p>
              </div>
              
              {selectedFeedback.staff_response && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Staff Response</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">{selectedFeedback.staff_response}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Response</label>
                <Textarea 
                  value={responseText} 
                  onChange={(e) => setResponseText(e.target.value)} 
                  placeholder="Write your response to this feedback..."
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleResponseSubmit} 
                  disabled={!responseText.trim()}
                >
                  Submit Response
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberFeedback;
