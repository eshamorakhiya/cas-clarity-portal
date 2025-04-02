
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
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8">
        {/* Welcome Text - Left Side */}
        <div className="w-full md:w-1/2 text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to CAS Admin Portal</h1>
          <p className="text-gray-600 mb-8">Configure and manage patient assessment sessions through our integrated platform.</p>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-cas-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
              <div className="text-left">
                <h3 className="font-medium text-gray-800">Connect to Patient</h3>
                <p className="text-sm text-gray-600">Enter your credentials to link with a patient session</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
              <div className="text-left">
                <h3 className="font-medium text-gray-600">Configure Assessment</h3>
                <p className="text-sm text-gray-500">Customize domains for your session</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
              <div className="text-left">
                <h3 className="font-medium text-gray-600">View Results</h3>
                <p className="text-sm text-gray-500">Review assessment data</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Login Form - Right Side */}
        <div className="w-full md:w-1/2">
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
      </div>
      
      {/* Demo Indicator */}
      <div className="fixed top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
        Demo Mode
      </div>
    </div>
  );
};

export default Login;
