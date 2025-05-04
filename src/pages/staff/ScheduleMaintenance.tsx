
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ScheduleMaintenance = () => {
  const [date, setDate] = useState<Date>();
  const [facility, setFacility] = useState('');
  const [priority, setPriority] = useState('medium');
  const [issue, setIssue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!facility || !issue || !date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Mock submission
    toast.success('Maintenance scheduled successfully');
    // Reset form
    setFacility('');
    setPriority('medium');
    setIssue('');
    setDate(undefined);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Schedule Maintenance</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Request Form</CardTitle>
            <CardDescription>
              Submit a request for facility maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Select value={facility} onValueChange={setFacility}>
                    <SelectTrigger id="facility">
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pool">Swimming Pool</SelectItem>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="tennis">Tennis Court</SelectItem>
                      <SelectItem value="sauna">Sauna</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="locker">Locker Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Scheduled Date</Label>
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
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issue">Description of Issue</Label>
                  <Textarea
                    id="issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Please describe the maintenance issue in detail"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">Schedule Maintenance</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleMaintenance;
