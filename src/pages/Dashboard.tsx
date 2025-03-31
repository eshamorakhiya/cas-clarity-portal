
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Users, Clock, BarChart, CalendarDays, History } from 'lucide-react';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">1</div>
              <Users className="h-8 w-8 text-cas-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Sessions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">3</div>
              <CalendarDays className="h-8 w-8 text-cas-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">2</div>
              <Clock className="h-8 w-8 text-cas-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Completed Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">12</div>
              <BarChart className="h-8 w-8 text-cas-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Assessment</CardTitle>
            <CardDescription>
              Start a new assessment session with the current patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Select the assessment type to begin the evaluation process. 
              You'll be able to select and prioritize assessment domains after choosing a type.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-cas-primary hover:bg-cas-dark" 
              onClick={() => navigate('/assessment-type')}
            >
              Start New Assessment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Sessions</CardTitle>
            <CardDescription>
              View and manage previous assessment sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => navigate('/multi-session')}>
                <div className="flex items-center">
                  <History className="h-5 w-5 text-cas-primary mr-2" />
                  <div>
                    <p className="font-medium">Session History</p>
                    <p className="text-sm text-gray-500">3 previous sessions</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => navigate('/summary')}>
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 text-cas-primary mr-2" />
                  <div>
                    <p className="font-medium">Latest Assessment</p>
                    <p className="text-sm text-gray-500">From today at 10:30 AM</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate('/multi-session')}
            >
              View All Sessions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
