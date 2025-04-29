
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed';

interface RefundRequest {
  id: string;
  customer_id: string;
  customerName?: string; // For UI display
  transaction_id: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  notes?: string;
  requested_at: string;
  processed_at?: string;
}

const RefundRequestHandler = () => {
  const { isAdmin, isStaff } = useAuth();
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [partialRefundAmount, setPartialRefundAmount] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch refund requests from database
  useEffect(() => {
    const fetchRefundRequests = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('refund_requests')
          .select(`
            *,
            profiles:customer_id(full_name)
          `)
          .order('requested_at', { ascending: false });

        if (error) throw error;

        // Format the data to match our interface
        const formattedRequests: RefundRequest[] = data.map(req => ({
          id: req.id,
          customer_id: req.customer_id,
          customerName: req.profiles?.full_name || 'Unknown User',
          transaction_id: req.transaction_id,
          amount: parseFloat(req.amount),
          reason: req.reason,
          status: req.status,
          notes: req.notes || '',
          requested_at: req.requested_at,
          processed_at: req.processed_at
        }));

        setRequests(formattedRequests);
      } catch (error) {
        console.error("Error fetching refund requests:", error);
        toast.error("Failed to load refund requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRefundRequests();
  }, []);

  // Filter requests based on status
  const pendingRequests = requests.filter(request => request.status === 'pending');
  const processedRequests = requests.filter(request => request.status === 'approved' || request.status === 'rejected' || request.status === 'processed');

  const openReviewDialog = (request: RefundRequest) => {
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
      
      // Update the refund request in the database
      const { error } = await supabase
        .from('refund_requests')
        .update({ 
          status: newStatus, 
          notes: reviewNotes,
          amount: newAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      // Update local state
      const updatedRequests = requests.map(request => {
        if (request.id === selectedRequest.id) {
          return {
            ...request,
            status: newStatus as RefundStatus,
            notes: reviewNotes,
            amount: newAmount
          };
        }
        return request;
      });

      setRequests(updatedRequests);
      setIsReviewOpen(false);
      toast.success(`Refund request ${newStatus}`);
    } catch (error) {
      console.error("Error updating refund request:", error);
      toast.error("Failed to update refund request");
    }
  };

  const handleProcessRefund = async (requestId: string) => {
    try {
      // Update the refund request in the database
      const { error } = await supabase
        .from('refund_requests')
        .update({ 
          status: 'processed', 
          notes: `Processed on ${format(new Date(), 'yyyy-MM-dd')}`,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      const updatedRequests = requests.map(request => {
        if (request.id === requestId && request.status === 'approved') {
          return {
            ...request,
            status: 'processed' as RefundStatus,
            notes: `Processed on ${format(new Date(), 'yyyy-MM-dd')}`
          };
        }
        return request;
      });

      setRequests(updatedRequests);
      toast.success('Refund has been processed');
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
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
            {loading ? (
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
            {loading ? (
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
      </CardContent>

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
                <Label className="text-sm font-medium">Review Action</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="approve"
                      name="reviewAction"
                      className="mr-2"
                      checked={reviewAction === 'approve'}
                      onChange={() => setReviewAction('approve')}
                    />
                    <Label htmlFor="approve">Approve</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="reject"
                      name="reviewAction"
                      className="mr-2"
                      checked={reviewAction === 'reject'}
                      onChange={() => setReviewAction('reject')}
                    />
                    <Label htmlFor="reject">Reject</Label>
                  </div>
                </div>
              </div>
              
              {reviewAction === 'approve' && (
                <div className="space-y-2">
                  <Label htmlFor="partialRefund" className="text-sm font-medium">
                    Refund Amount
                  </Label>
                  <Input
                    id="partialRefund"
                    value={partialRefundAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value || /^\d*\.?\d*$/.test(value)) {
                        setPartialRefundAmount(value);
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Adjust the amount if providing a partial refund
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reviewNotes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add additional notes or reason for decision..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReviewSubmit}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {reviewAction === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RefundRequestHandler;
