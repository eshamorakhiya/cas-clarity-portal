
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

const Login = () => {
  const [clinicianId, setClinicianId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(clinicianId, patientId);
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
    return <Navigate to="/assessment-type" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cas-background p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - content */}
        <div className="space-y-6 hidden md:block">
          <div className="inline-block rounded-md bg-cas-primary text-white font-bold text-3xl p-4 mb-2">CAS</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CAS Admin Portal</h1>
          <p className="text-lg text-gray-600">Configure and manage patient assessment sessions through our integrated platform.</p>
          <div className="space-y-4 mt-8">
            <div className="flex items-start space-x-3">
              <div className="bg-cas-primary p-2 rounded text-white mt-1">1</div>
              <div>
                <h3 className="font-medium">Connect to Patient</h3>
                <p className="text-gray-600">Enter your credentials to link with a patient session</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-cas-primary p-2 rounded text-white mt-1">2</div>
              <div>
                <h3 className="font-medium">Configure Assessment</h3>
                <p className="text-gray-600">Customize domains and parameters for your session</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-cas-primary p-2 rounded text-white mt-1">3</div>
              <div>
                <h3 className="font-medium">View Results</h3>
                <p className="text-gray-600">Analyze assessment data and export reports</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - login form */}
        <div>
          <Card className="border-0 shadow-card animate-fade-in">
            <CardHeader className="space-y-1">
              <div className="flex items-center md:hidden mb-4">
                <div className="rounded-md bg-cas-primary text-white font-bold text-2xl p-2 mr-2">CAS</div>
                <h2 className="text-xl font-medium">Admin Portal</h2>
              </div>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the CAS Admin Portal
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicianId" className="cas-label">Clinician ID</Label>
                    <Input
                      id="clinicianId"
                      type="text"
                      placeholder="Enter 4-6 digit ID"
                      value={clinicianId}
                      onChange={(e) => setClinicianId(e.target.value)}
                      className="cas-input"
                      required
                      pattern="\d{4,6}"
                      title="Please enter a 4-6 digit number"
                    />
                    <p className="text-xs text-gray-500">For demo, use any 4-6 digit ID (e.g. 1234)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientId" className="cas-label">Patient ID</Label>
                    <Input
                      id="patientId"
                      type="text"
                      placeholder="Enter patient ID"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="cas-input"
                      required
                    />
                    <p className="text-xs text-gray-500">Enter any patient identifier for the demo</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full cas-btn-primary group relative overflow-hidden transition-all duration-200"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative">{isLoading ? 'Connecting...' : 'Connect'}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact <a href="#" className="text-cas-primary hover:underline">technical support</a>
            </p>
          </div>
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
