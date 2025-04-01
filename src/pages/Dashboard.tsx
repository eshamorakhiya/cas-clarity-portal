
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Headset, BarChart } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, clinicianId, patientId } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Today's date for display
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to CAS Admin Portal</h1>
        <p className="text-gray-600 mt-2">
          {formattedDate} • Clinician ID: {clinicianId} • Connected to Patient ID: {patientId}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-elevated hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headset className="mr-2 h-5 w-5 text-cas-primary" /> Domain Selection
            </CardTitle>
            <CardDescription>
              Start a new assessment session with domain selection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Select and prioritize assessment domains to begin the evaluation process. 
              You can select up to 5 domains and arrange them in order of importance.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full btn-primary-gradient" 
              onClick={() => navigate('/domains')}
            >
              Start Domain Selection
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-elevated hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-cas-primary" /> Session Summary
            </CardTitle>
            <CardDescription>
              View the current session summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have an active assessment session, you can view the summary here.
              This includes findings for each domain and the full conversation transcript.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => navigate('/summary')}
            >
              View Summary
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
