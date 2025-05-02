
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent User Activity</CardTitle>
        <CardDescription>Latest member interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">ML</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Mark Lee</p>
              <p className="text-xs text-muted-foreground">Booked Tennis Court for Saturday</p>
            </div>
            <div className="text-xs text-muted-foreground">2h ago</div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">SD</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Sarah Davis</p>
              <p className="text-xs text-muted-foreground">Updated profile information</p>
            </div>
            <div className="text-xs text-muted-foreground">4h ago</div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">JT</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">James Thompson</p>
              <p className="text-xs text-muted-foreground">Requested membership renewal</p>
            </div>
            <div className="text-xs text-muted-foreground">6h ago</div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">EW</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Emma Wilson</p>
              <p className="text-xs text-muted-foreground">Canceled yoga class booking</p>
            </div>
            <div className="text-xs text-muted-foreground">8h ago</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View All Activity</Button>
      </CardFooter>
    </Card>
  );
};
