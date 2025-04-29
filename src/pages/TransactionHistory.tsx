
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, Download, Search, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'payment' | 'refund' | 'adjustment';
  status: 'completed' | 'pending' | 'failed';
  method: string;
  receipt_url?: string;
}

const TransactionHistory = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch payment/transaction history
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform to Transaction interface
      const formattedTransactions: Transaction[] = data.map(payment => ({
        id: payment.id,
        date: new Date(payment.payment_date).toLocaleDateString(),
        description: `${payment.plan_name} Membership`,
        amount: parseFloat(payment.amount),
        type: 'payment',
        status: payment.status,
        method: payment.payment_method || 'Credit Card',
        receipt_url: `/receipts/${payment.id}.pdf` // This would be a real URL in production
      }));
      
      return formattedTransactions;
    },
    enabled: !!user
  });

  // Filter transactions based on search query, time range, and tab
  const filteredTransactions = transactions?.filter(transaction => {
    // Filter by search query
    const matchesQuery = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by time range
    let matchesTimeRange = true;
    if (timeRange !== 'all') {
      const now = new Date();
      const transactionDate = new Date(transaction.date);
      const daysDiff = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
      
      switch (timeRange) {
        case 'last30':
          matchesTimeRange = daysDiff <= 30;
          break;
        case 'last90':
          matchesTimeRange = daysDiff <= 90;
          break;
        case 'last365':
          matchesTimeRange = daysDiff <= 365;
          break;
        default:
          matchesTimeRange = true;
      }
    }
    
    // Filter by transaction type
    const matchesType = activeTab === 'all' || transaction.type === activeTab;
    
    return matchesQuery && matchesTimeRange && matchesType;
  });

  const calculateTotal = () => {
    if (!filteredTransactions) return 0;
    
    return filteredTransactions.reduce((total, transaction) => {
      if (transaction.type === 'payment') {
        return total + transaction.amount;
      } else if (transaction.type === 'refund') {
        return total - transaction.amount;
      }
      return total;
    }, 0);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const viewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage your payment history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              <span>Total Spent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${calculateTotal().toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {transactions && transactions.length > 0 
                ? `$${transactions[0].amount.toFixed(2)}`
                : '$0.00'
              }
            </div>
            <p className="text-sm text-muted-foreground">
              {transactions && transactions.length > 0 
                ? transactions[0].date
                : 'No payments yet'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              Premium Membership
            </div>
            <p className="text-sm text-muted-foreground">
              Expires: December 31, 2025
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and filter your payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="last365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center p-8">Loading transaction history...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions && filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className={
                              transaction.type === 'refund' ? 'text-red-600' : ''
                            }>
                              {transaction.type === 'refund' ? '- ' : ''}
                              ${transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{transaction.method}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => viewReceipt(transaction)}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View Receipt</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            {searchQuery 
                              ? 'No matching transactions found' 
                              : 'No transactions found'}
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

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transaction ID</span>
                  <span className="text-sm">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Date</span>
                  <span className="text-sm">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Description</span>
                  <span className="text-sm">{selectedTransaction.description}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Amount</span>
                  <span className="text-sm">${selectedTransaction.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Payment Method</span>
                  <span className="text-sm">{selectedTransaction.method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-sm">{selectedTransaction.status}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionHistory;
