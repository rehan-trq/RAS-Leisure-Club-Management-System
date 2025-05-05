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

// Staff page imports
import StaffAdvancedDashboard from "@/pages/staff/StaffAdvancedDashboard";
import ScheduleMaintenance from "@/pages/staff/ScheduleMaintenance";
import MemberCheckins from "@/pages/staff/MemberCheckins";
import FacilityMaintenance from "@/pages/staff/FacilityMaintenance";

// New page imports
import UserManagement from "@/pages/admin/UserManagement";
import StaffManagement from "@/pages/admin/StaffManagement";
import MaintenanceManagement from "@/pages/admin/MaintenanceManagement";
import AnalyticsAndReports from "@/pages/admin/AnalyticsAndReports";
import MembershipManagement from "@/pages/admin/MembershipManagement";
import FinancialDashboard from "@/pages/admin/FinancialDashboard";
import TransactionHistory from "@/pages/TransactionHistory";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import AdvancedAdminDashboard from "@/pages/admin/AdvancedAdminDashboard";

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
            <Route element={<ProtectedRoute allowedRoles={['member']} />}>
              <Route path="/member-landing" element={<MemberLanding />} />
              <Route path="/book-activity" element={<BookActivity />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/transactions" element={<TransactionHistory />} />
            </Route>
            
            {/* Staff routes */}
            <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="/staff-landing" element={<StaffLanding />} />
              <Route path="/staff/maintenance" element={<MaintenanceManagement />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/staff/advanced-dashboard" element={<StaffAdvancedDashboard />} />
              <Route path="/staff/schedule-maintenance" element={<ScheduleMaintenance />} />
              <Route path="/staff/member-checkins" element={<MemberCheckins />} />
              <Route path="/staff/facility-maintenance" element={<FacilityMaintenance />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-landing" element={<AdminLanding />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/staff" element={<StaffManagement />} />
              <Route path="/admin/maintenance" element={<MaintenanceManagement />} />
              <Route path="/admin/analytics" element={<AnalyticsAndReports />} />
              <Route path="/admin/memberships" element={<MembershipManagement />} />
              <Route path="/admin/financial" element={<FinancialDashboard />} />
              <Route path="/admin/advanced" element={<AdvancedAdminDashboard />} />
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
