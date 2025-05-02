
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type FineType = 'late_payment' | 'damaged_equipment' | 'missed_class' | 'other';

interface FineRule {
  type: FineType;
  description: string;
  baseAmount: number;
  dailyRate?: number;
}

const fineRules: Record<FineType, FineRule> = {
  late_payment: {
    type: 'late_payment',
    description: 'Late payment fee',
    baseAmount: 10,
    dailyRate: 1
  },
  damaged_equipment: {
    type: 'damaged_equipment',
    description: 'Damaged equipment fee',
    baseAmount: 50
  },
  missed_class: {
    type: 'missed_class',
    description: 'Missed class without notice',
    baseAmount: 15
  },
  other: {
    type: 'other',
    description: 'Other fees',
    baseAmount: 0
  }
};

const FineCalculator = () => {
  const [fineType, setFineType] = useState<FineType>('late_payment');
  const [memberId, setMemberId] = useState('');
  const [daysLate, setDaysLate] = useState('0');
  const [customAmount, setCustomAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [calculatedFines, setCalculatedFines] = useState<Array<{
    id: string;
    memberId: string;
    amount: number;
    type: string;
    date: string;
    description: string;
    status: 'pending' | 'paid' | 'waived';
  }>>([]);
  const [notes, setNotes] = useState('');

  const calculateFine = () => {
    if (!memberId) {
      return;
    }

    const rule = fineRules[fineType];
    let amount = rule.baseAmount;

    // For late payments, calculate based on days late
    if (fineType === 'late_payment' && rule.dailyRate) {
      amount += rule.dailyRate * parseInt(daysLate || '0');
    }

    // Override with custom amount if provided
    if (fineType === 'other' && customAmount) {
      amount = parseFloat(customAmount);
    }

    const newFine = {
      id: `fine-${Date.now()}`,
      memberId,
      amount,
      type: rule.description,
      date: format(date, 'yyyy-MM-dd'),
      description: notes || rule.description,
      status: 'pending' as const
    };

    setCalculatedFines([newFine, ...calculatedFines]);
    
    // Clear form
    setNotes('');
    if (fineType === 'other') {
      setCustomAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fine Calculator</CardTitle>
          <CardDescription>Calculate member fines based on predefined rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fineType">Fine Type</Label>
                <Select
                  value={fineType}
                  onValueChange={(value: FineType) => setFineType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="late_payment">Late Payment</SelectItem>
                    <SelectItem value="damaged_equipment">Damaged Equipment</SelectItem>
                    <SelectItem value="missed_class">Missed Class</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="Enter member ID"
                />
              </div>

              {fineType === 'late_payment' && (
                <div className="space-y-2">
                  <Label htmlFor="daysLate">Days Late</Label>
                  <Input
                    id="daysLate"
                    type="number"
                    min="0"
                    value={daysLate}
                    onChange={(e) => setDaysLate(e.target.value)}
                  />
                </div>
              )}

              {fineType === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Custom Amount ($)</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter custom amount"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional details (optional)"
                />
              </div>

              <Button onClick={calculateFine}>Calculate & Add Fine</Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fine Details</h3>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Selected Fine Type</p>
                <p className="text-lg">{fineRules[fineType].description}</p>
                
                <div className="mt-2">
                  <p className="text-sm font-medium">Base Amount</p>
                  <p className="text-lg">${fineRules[fineType].baseAmount.toFixed(2)}</p>
                </div>
                
                {fineType === 'late_payment' && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Daily Late Fee</p>
                    <p className="text-lg">${fineRules[fineType].dailyRate?.toFixed(2)} per day</p>
                  </div>
                )}
                
                {fineType === 'late_payment' && parseInt(daysLate) > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Calculated Amount</p>
                    <p className="text-lg font-bold">
                      ${(fineRules[fineType].baseAmount + (fineRules[fineType].dailyRate || 0) * parseInt(daysLate)).toFixed(2)}
                    </p>
                  </div>
                )}
                
                {fineType === 'other' && customAmount && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Custom Amount</p>
                    <p className="text-lg font-bold">${parseFloat(customAmount).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {calculatedFines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculated Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedFines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell>{fine.memberId}</TableCell>
                    <TableCell>{fine.type}</TableCell>
                    <TableCell>${fine.amount.toFixed(2)}</TableCell>
                    <TableCell>{fine.date}</TableCell>
                    <TableCell className="max-w-xs truncate">{fine.description}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        fine.status === 'paid' ? "bg-green-100 text-green-800" : 
                        fine.status === 'waived' ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"
                      )}>
                        {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FineCalculator;
