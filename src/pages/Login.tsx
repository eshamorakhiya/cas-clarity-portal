
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

const Login = () => {
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Using a default clinician ID since we're simplifying to just patient ID
      await login("000000", patientId);
      toast.success("Login successful", {
        description: `Connected to Patient ID: ${patientId}`,
        position: "bottom-right"
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/domains" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cas-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-card animate-fade-in">
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-4">
              <div className="rounded-md bg-cas-primary text-white font-bold text-2xl p-2 mr-2">CAS</div>
              <h2 className="text-xl font-medium">Admin Portal</h2>
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId" className="cas-label">Patient ID</Label>
                  <Input
                    id="patientId"
                    type="text"
                    placeholder="Enter 6-digit ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="cas-input"
                    required
                    pattern="\d{6}"
                    title="Please enter a 6-digit number"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full cas-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      {/* Demo Indicator */}
      <div className="fixed top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
        Demo Mode
      </div>
    </div>
  );
};

export default Login;
