
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText } from "lucide-react";

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Management tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link to="/admin/bookings">
          <Button className="w-full justify-start" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Manage Bookings
          </Button>
        </Link>
        <Link to="/admin/users">
          <Button className="w-full justify-start" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            User Management
          </Button>
        </Link>
        <Link to="/admin/financial">
          <Button className="w-full justify-start" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Financial Dashboard
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
