import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { authService } from '../services/auth';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import karachiBakeryLogo from '../assets/karachi-bakery-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const user = response.data.user;
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'factory_manager') {
          navigate('/factory');
        } else if (user.role === 'outlet_manager') {
          navigate('/outlet');
        } else {
          navigate('/user');
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={karachiBakeryLogo} 
              alt="Karachi Bakery" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Karachi Bakery 
          </CardTitle>
          <p className="text-muted-foreground">Franchise Orders Management</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleLogin();
                    }
                  }}
                  placeholder="Enter your email"
                  required
                />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleLogin();
                    }
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-pink" disabled={isLoading} >
 {              isLoading ? ( <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In... </> ) : ( 'Sign In' )} 
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h3 className="font-semibold mb-2">Demo Credentials:</h3>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@karachibakery.com / admin123456</p>
              <p><strong>Outlet Manager:</strong> outlet1@karachibakery.com / outlet123</p>
              <p><strong>Factory Manager:</strong> chocolate@karachibakery.com / factory123</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Need access? Contact admin for registration link.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
