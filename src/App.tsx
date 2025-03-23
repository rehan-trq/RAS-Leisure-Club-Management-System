
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import BookActivity from "./pages/BookActivity";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import { BookingProvider } from "./contexts/BookingContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MemberLanding from "./pages/MemberLanding";
import StaffLanding from "./pages/StaffLanding";
import AdminLanding from "./pages/AdminLanding";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
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
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
