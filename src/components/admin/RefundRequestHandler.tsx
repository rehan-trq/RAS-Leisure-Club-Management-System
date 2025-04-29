
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Search, Filter, CheckCheck, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed';

interface RefundRequest {
  id: string;
  customerId: string;
  customerName: string;
  transactionId: string;
  amount: number;
  date: string;
  reason: string;
  status: RefundStatus;
  notes: string;
}

// Mock data
const mockRefundRequests: RefundRequest[] = [
  {
    id: 'ref-001',
    customerId: 'cust-123',
    customerName: 'John Smith',
    transactionId: 'tx-456789',
    amount: 99.99,
    date: '2025-04-24',
    reason: 'Service not provided as described',
    status: 'pending',
    notes: '',
  },
  {
    id: 'ref-002',
    customerId: 'cust-456',
    customerName: 'Emma Johnson',
    transactionId: 'tx-123456',
    amount: 149.50,
    date: '2025-04-22',
    reason: 'Duplicate charge',
    status: 'approved',
    notes: 'Verified duplicate payment in system',
  },
  {
    id: 'ref-003',
    customerId: 'cust-789',
    customerName: 'Michael Brown',
    transactionId: 'tx-789012',
    amount: 75.00,
    date: '2025-04-20',
    reason: 'Membership cancelled within grace period',
    status: 'processed',
    notes: 'Refund processed on April 22',
  },
  {
    id: 'ref-004',
    customerId: 'cust-101',
    customerName: 'Sarah Wilson',
    transactionId: 'tx-345678',
    amount: 199.99,
    date: '2025-04-18',
    reason: 'Unsatisfied with service',
    status: 'rejected',
    notes: 'Customer used services for over 14 days',
  },
  {
    id: 'ref-005',
    customerId: 'cust-202',
    customerName: 'David Garcia',
    transactionId: 'tx-901234',
    amount: 45.00,
    date: '2025-04-25',
    reason: 'Charged for unwanted add-on service',
    status: 'pending',
    notes: '',
  }
];

const RefundRequestHandler: React.FC = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(mockRefundRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RefundStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [partialRefundAmount, setPartialRefundAmount] = useState('');

  // Filter and sort the refund requests
  const filteredRequests = refundRequests
    .filter(request => {
      // Apply status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.customerName.toLowerCase().includes(searchLower) ||
          request.customerId.toLowerCase().includes(searchLower) ||
          request.transactionId.toLowerCase().includes(searchLower) ||
          request.reason.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by status (pending first) and then by date (newest first)
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const openReviewDialog = (request: RefundRequest) => {
    setSelectedRequest(request);
    setReviewNotes(request.notes);
    setReviewAction(null);
    setPartialRefundAmount(request.amount.toString());
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedRequest || !reviewAction) return;

    const updatedRequests = refundRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: reviewAction === 'approve' ? 'approved' as RefundStatus : 'rejected' as RefundStatus,
          notes: reviewNotes,
          amount: reviewAction === 'approve' && partialRefundAmount 
            ? parseFloat(partialRefundAmount) 
            : request.amount
        };
      }
      return request;
    });

    setRefundRequests(updatedRequests);
    setIsReviewOpen(false);
    
    toast.success(
      reviewAction === 'approve' 
        ? `Refund request ${selectedRequest.id} approved` 
        : `Refund request ${selectedRequest.id} rejected`
    );
  };

  const handleProcessRefund = (requestId: string) => {
    const updatedRequests = refundRequests.map(request => {
      if (request.id === requestId && request.status === 'approved') {
        return {
          ...request,
          status: 'processed' as RefundStatus,
          notes: `${request.notes}\nProcessed on ${format(new Date(), 'yyyy-MM-dd')}`
        };
      }
      return request;
    });

    setRefundRequests(updatedRequests);
    toast.success(`Refund for request ${requestId} has been processed`);
  };

  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'processed':
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Refund Request Management</CardTitle>
          <CardDescription>Review and process member refund requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search by name, ID, transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as RefundStatus | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No refund requests match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.customerName}</div>
                        <div className="text-xs text-muted-foreground">{request.customerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.transactionId}</TableCell>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={request.reason}>{request.reason}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      {request.status === 'pending' && (
                        <Button variant="ghost" size="sm" onClick={() => openReviewDialog(request)}>
                          Review
                        </Button>
                      )}
                      {request.status === 'approved' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleProcessRefund(request.id)}
                        >
                          Process
                        </Button>
                      )}
                      {request.status !== 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openReviewDialog(request)}
                        >
                          Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.status === 'pending' 
                ? 'Review Refund Request' 
                : 'Refund Request Details'}
            </DialogTitle>
            <DialogDescription>
              Request {selectedRequest?.id} from {selectedRequest?.customerName}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm">{selectedRequest.customerName}</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.customerId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Transaction</p>
                  <p className="text-sm">{selectedRequest.transactionId}</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.date}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Reason for Refund</p>
                <p className="text-sm">{selectedRequest.reason}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm font-bold">${selectedRequest.amount.toFixed(2)}</p>
              </div>
              
              {selectedRequest.status === 'pending' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea 
                      value={reviewNotes} 
                      onChange={(e) => setReviewNotes(e.target.value)} 
                      placeholder="Add notes about this refund request"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Refund Amount ($)</label>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      max={selectedRequest.amount}
                      value={partialRefundAmount} 
                      onChange={(e) => setPartialRefundAmount(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">
                      You can issue a partial refund if needed
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => setReviewAction('approve')}
                      variant={reviewAction === 'approve' ? 'default' : 'outline'}
                    >
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => setReviewAction('reject')}
                      variant={reviewAction === 'reject' ? 'destructive' : 'outline'}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedRequest.status)}
                    {selectedRequest.status === 'rejected' && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Rejected requests cannot be reversed
                      </div>
                    )}
                  </div>
                  
                  {selectedRequest.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm whitespace-pre-line">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedRequest?.status === 'pending' ? (
              <>
                <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleReviewSubmit}
                  disabled={!reviewAction}
                >
                  Submit Review
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsReviewOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RefundRequestHandler;
