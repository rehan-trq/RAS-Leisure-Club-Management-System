
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SystemPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Performance</CardTitle>
        <CardDescription>Key metrics and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Server Uptime</span>
              <span className="text-sm text-muted-foreground">99.9%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Database Usage</span>
              <span className="text-sm text-muted-foreground">45%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-sm text-muted-foreground">235ms</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '23.5%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Storage Capacity</span>
              <span className="text-sm text-muted-foreground">68%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-amber-500">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">System Notice</h3>
              <div className="mt-1 text-sm text-amber-700">
                <p>Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Full Report</Button>
      </CardFooter>
    </Card>
  );
};
