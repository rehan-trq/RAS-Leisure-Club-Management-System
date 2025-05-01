import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectToDatabase } from '@/integrations/mongodb/client';
import RefundRequest from '@/integrations/mongodb/models/RefundRequest';
import User from '@/integrations/mongodb/models/User';
import { useAuth } from '@/contexts/AuthContext';
import type { RefundRequest as RefundRequestType } from '@/types/database';

interface RefundRequestWithUserName extends RefundRequestType {
  customerName?: string;
}

const RefundRequestHandler = () => {
  const { isAdmin, isStaff, token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<RefundRequestWithUserName | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [partialRefundAmount, setPartialRefundAmount] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch refund requests from database
  const { data: requestItems = [], isLoading } = useQuery({
    queryKey: ['refund-requests'],
    queryFn: async () => {
      try {
        await connectToDatabase();
        
        const refundData = await RefundRequest.find().sort({ requested_at: -1 });
        
        // Get user names
        const userIds = [...new Set(refundData.map(req => req.customer_id))];
        const users = await User.find({ _id: { $in: userIds } });
        
        // Map users to a dictionary for quick lookup
        const userMap = new Map();
        users.forEach(user => {
          userMap.set(user._id.toString(), user.full_name || 'Unknown User');
        });
        
        // Format the data to match our interface
        const formattedRequests: RefundRequestWithUserName[] = refundData.map(req => ({
          id: req._id.toString(),
          customer_id: req.customer_id.toString(),
          customerName: userMap.get(req.customer_id.toString()) || 'Unknown User',
          transaction_id: req.transaction_id,
          amount: req.amount,
          reason: req.reason,
          status: req.status,
          notes: req.notes || '',
          requested_at: req.requested_at.toISOString(),
          processed_at: req.processed_at ? req.processed_at.toISOString() : undefined,
          created_at: req.created_at.toISOString(),
          updated_at: req.updated_at.toISOString()
        }));
        
        return formattedRequests;
      } catch (error) {
        console.error("Error fetching refund requests:", error);
        toast.error("Failed to load refund requests");
        return [];
      }
    },
    enabled: !!token && (isAdmin || isStaff)
  });
  
  const updateRefundRequestMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes,
      amount,
      processed 
    }: { 
      id: string; 
      status?: string; 
      notes?: string;
      amount?: number;
      processed?: boolean;
    }) => {
      await connectToDatabase();
      
      const updateData: {[key: string]: any} = {
        updated_at: new Date()
      };
      
      if (status) {
        updateData.status = status;
      }
      
      if (notes !== undefined) {
        updateData.notes = notes;
      }
      
      if (amount !== undefined) {
        updateData.amount = amount;
      }
      
      if (processed) {
        updateData.processed_at = new Date();
      }
      
      await RefundRequest.findByIdAndUpdate(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refund-requests'] });
      toast.success('Refund request updated successfully');
    },
    onError: (error) => {
      console.error('Error updating refund request:', error);
      toast.error('Failed to update refund request');
    }
  });
  
  // Filter requests based on status
  const pendingRequests = requestItems.filter(request => request.status === 'pending');
  const processedRequests = requestItems.filter(request => request.status === 'approved' || request.status === 'rejected' || request.status === 'processed');

  const openReviewDialog = (request: RefundRequestWithUserName) => {
    setSelectedRequest(request);
    setReviewAction('approve');
    setReviewNotes('');
    setPartialRefundAmount(request.amount.toString());
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedRequest) return;
    
    try {
      const newStatus = reviewAction === 'approve' ? 'approved' : 'rejected';
      const newAmount = reviewAction === 'approve' && partialRefundAmount 
        ? parseFloat(partialRefundAmount) 
        : selectedRequest.amount;
      
      await updateRefundRequestMutation.mutateAsync({
        id: selectedRequest.id,
        status: newStatus,
        notes: reviewNotes,
        amount: newAmount
      });
      
      setIsReviewOpen(false);
    } catch (error) {
      console.error("Error in handleReviewSubmit:", error);
    }
  };

  const handleProcessRefund = async (requestId: string) => {
    try {
      await updateRefundRequestMutation.mutateAsync({
        id: requestId,
        status: 'processed',
        notes: `Processed on ${format(new Date(), 'yyyy-MM-dd')}`,
        processed: true
      });
    } catch (error) {
      console.error("Error in handleProcessRefund:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-800">Processed</Badge>;
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
    <Card>
      <CardHeader>
        <CardTitle>Refund Request Handler</CardTitle>
        <CardDescription>Process and manage customer refund requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending Requests 
              {pendingRequests.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="processed">Processed Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {isLoading ? (
              <div className="text-center py-6">Loading refund requests...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No pending refund requests at this time.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{format(new Date(request.requested_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>{request.transaction_id}</TableCell>
                      <TableCell>{formatCurrency(request.amount)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openReviewDialog(request)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="processed">
            {isLoading ? (
              <div className="text-center py-6">Loading refund requests...</div>
            ) : processedRequests.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No processed refund requests to display.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{format(new Date(request.requested_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>{request.transaction_id}</TableCell>
                      <TableCell>{formatCurrency(request.amount)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={request.notes}>
                          {request.notes || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === 'approved' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleProcessRefund(request.id)}
                          >
                            Process Refund
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review Refund Request</DialogTitle>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Customer</Label>
                    <div>{selectedRequest.customerName}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Transaction ID</Label>
                    <div>{selectedRequest.transaction_id}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Amount</Label>
                    <div>{formatCurrency(selectedRequest.amount)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <div>{format(new Date(selectedRequest.requested_at), 'MMM dd, yyyy')}</div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Reason for Refund</Label>
                  <div className="mt-1 p-2 bg-muted rounded-md">
                    {selectedRequest.reason}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex space-x-4">
                    <Button 
                      variant={reviewAction === 'approve' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setReviewAction('approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant={reviewAction === 'reject' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setReviewAction('reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
                
                {reviewAction === 'approve' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Refund Amount</Label>
                    <Input
                      type="number"
                      value={partialRefundAmount}
                      onChange={(e) => setPartialRefundAmount(e.target.value)}
                      min={0}
                      max={selectedRequest.amount}
                      step={0.01}
                    />
                    <p className="text-xs text-muted-foreground">
                      You can adjust the amount for partial refunds.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <Textarea
                    placeholder="Add notes about this decision..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReviewSubmit}>
                    {reviewAction === 'approve' ? 'Approve Refund' : 'Reject Refund'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RefundRequestHandler;
