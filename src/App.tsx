
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Page imports
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import MemberLanding from "@/pages/MemberLanding";
import BookActivity from "@/pages/BookActivity";
import MyBookings from "@/pages/MyBookings";
import StaffLanding from "@/pages/StaffLanding";
import AdminLanding from "@/pages/AdminLanding";
import AdminBookings from "@/pages/AdminBookings";
import NotFound from "@/pages/NotFound";

// New page imports
import UserManagement from "@/pages/admin/UserManagement";
import FinancialDashboard from "@/pages/admin/FinancialDashboard";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Member routes */}
            <Route element={<ProtectedRoute allowedRoles={['member', 'staff', 'admin']} />}>
              <Route path="/member" element={<MemberLanding />} />
              <Route path="/book-activity" element={<BookActivity />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>
            
            {/* Staff routes */}
            <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="/staff" element={<StaffLanding />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLanding />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/financial" element={<FinancialDashboard />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
