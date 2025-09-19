import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { login } from '../utils/auth';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { sendLoginAlert } from '../utils/emailService';

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
      const result = login(email, password);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}!`,
        });

        // Send login alert email
        try {
          await sendLoginAlert(result.user);
        } catch (emailError) {
          console.error('Failed to send login alert:', emailError);
        }
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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

            <Button 
              type="submit" 
              className="w-full bg-gradient-golden"
            >
            Sign In
            </Button>

          </form>

          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h3 className="font-semibold mb-2">Demo Credentials:</h3>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@karachibakery.com / admin123</p>
              <p><strong>User:</strong> franchise1@karachibakery.com / franchise123</p>
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
