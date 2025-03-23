
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar, ClipboardList, LayoutDashboard, Info, Mail } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Mock authentication status (in a real app, this would come from an auth context)
  const isAuthenticated = true; // This is just for demonstration
  const isAdmin = true; // This is just for demonstration

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold">RAS Club</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/services" className="nav-link">
            Services
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/book-activity" className="nav-link flex items-center gap-1">
                <Calendar size={16} />
                Book Activity
              </Link>
              <Link to="/my-bookings" className="nav-link flex items-center gap-1">
                <ClipboardList size={16} />
                My Bookings
              </Link>
            </>
          )}
          {isAdmin && isAuthenticated && (
            <Link to="/admin/bookings" className="nav-link flex items-center gap-1">
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
          <Link to="/about" className="nav-link flex items-center gap-1">
            <Info size={16} />
            About
          </Link>
          <Link to="/contact" className="nav-link flex items-center gap-1">
            <Mail size={16} />
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="rounded-xl px-5 transition-all hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl px-5 shadow-md hover:-translate-y-0.5 transition-all">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="outline" className="rounded-xl px-5">
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} className="text-primary animate-fade-in" />
          ) : (
            <Menu size={24} className="text-primary animate-fade-in" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg animate-slide-down border-b border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link to="/" className="nav-link py-2 block">
              Home
            </Link>
            <Link to="/services" className="nav-link py-2 block">
              Services
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/book-activity" className="nav-link py-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Book Activity
                </Link>
                <Link to="/my-bookings" className="nav-link py-2 flex items-center gap-2">
                  <ClipboardList size={16} />
                  My Bookings
                </Link>
              </>
            )}
            {isAdmin && isAuthenticated && (
              <Link to="/admin/bookings" className="nav-link py-2 flex items-center gap-2">
                <LayoutDashboard size={16} />
                Admin
              </Link>
            )}
            <Link to="/about" className="nav-link py-2 flex items-center gap-2">
              <Info size={16} />
              About
            </Link>
            <Link to="/contact" className="nav-link py-2 flex items-center gap-2">
              <Mail size={16} />
              Contact
            </Link>
            <div className="flex flex-col space-y-3 pt-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full rounded-xl">Login</Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full rounded-xl">Sign Up</Button>
                  </Link>
                </>
              ) : (
                <Button variant="outline" className="w-full rounded-xl">Logout</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
