
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, ClipboardList, User, BarChart4, CreditCard } from 'lucide-react';

const MemberLanding = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">RAS Club Member Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Book Activities</CardTitle>
              <CardDescription>Reserve your spot for club activities</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Browse and book our premium facilities and services
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/book-activity">
                <Button variant="outline">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>Manage your upcoming reservations</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                View, modify or cancel your existing bookings
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/my-bookings">
                <Button variant="outline">View Bookings</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Membership</CardTitle>
              <CardDescription>View or upgrade your membership</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Manage your membership plan and payments
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/payment">
                <Button variant="outline">View Plans</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-medium mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/services" className="flex items-center p-3 bg-background rounded-md hover:bg-accent transition-colors">
              <div className="mr-3 text-primary">🏊‍♂️</div>
              <span>Explore Services</span>
            </Link>
            <Link to="/about" className="flex items-center p-3 bg-background rounded-md hover:bg-accent transition-colors">
              <div className="mr-3 text-primary">ℹ️</div>
              <span>About Club</span>
            </Link>
            <Link to="/contact" className="flex items-center p-3 bg-background rounded-md hover:bg-accent transition-colors">
              <div className="mr-3 text-primary">📞</div>
              <span>Contact Us</span>
            </Link>
            <button 
              onClick={logout}
              className="flex items-center p-3 bg-background rounded-md hover:bg-accent transition-colors"
            >
              <div className="mr-3 text-primary">🚪</div>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Priority Booking</h3>
              <p className="text-sm text-muted-foreground">Early access to facility reservations</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Member Events</h3>
              <p className="text-sm text-muted-foreground">Exclusive access to member-only gatherings</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Discounted Rates</h3>
              <p className="text-sm text-muted-foreground">Special pricing on premium services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLanding;
