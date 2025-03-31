
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(userId);
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cas-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block rounded-md bg-cas-primary text-white font-bold text-3xl p-3 mb-2">CAS</div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Portal</h1>
        </div>
        
        <Card className="border-0 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your user ID to access the CAS Admin Portal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="userId" className="text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter 4-6 digit ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full"
                    required
                    pattern="\d{4,6}"
                    title="Please enter a 4-6 digit number"
                  />
                  <p className="text-xs text-gray-500">For demo, use ID: 1234</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-cas-primary hover:bg-cas-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
