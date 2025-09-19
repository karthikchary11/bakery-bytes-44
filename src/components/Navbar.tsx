import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { getCurrentUser, logout } from '../utils/auth';
import { useToast } from '../hooks/use-toast';
import { LogOut, User, Settings } from 'lucide-react';
import karachiBakeryLogo from '../assets/karachi-bakery-logo.png';

const Navbar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={karachiBakeryLogo} 
              alt="Karachi Bakery" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl text-primary">Karachi Bakery</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost">Admin Dashboard</Button>
                  </Link>
                )}
                
                {user.role === 'user' && (
                  <Link to="/user">
                    <Button variant="ghost">My Dashboard</Button>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;