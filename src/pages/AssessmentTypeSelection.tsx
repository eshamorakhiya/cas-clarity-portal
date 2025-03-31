
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headset, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AssessmentTypeSelection = () => {
  const { isAuthenticated, patientId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSelectAssessmentType = (type: 'CAS' | 'VRAIE') => {
    toast({
      title: `${type} Assessment Selected`,
      description: `Preparing ${type} assessment for patient ${patientId}`
    });
    
    // For this prototype, both types lead to the domain selection
    navigate('/domains');
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assessment Type Selection</h1>
        <p className="text-gray-600 mt-2">
          Select the type of assessment you'd like to conduct for Patient ID: {patientId}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border hover:border-cas-primary transition-all hover:shadow-md cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 text-cas-primary" />
              CAS Assessment
            </CardTitle>
            <CardDescription>Conversational Assessment System</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              A structured conversational assessment that guides patients through 
              a dialogue-based evaluation of their mental health status across selected domains.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleSelectAssessmentType('CAS')}
              className="w-full bg-cas-primary hover:bg-cas-dark"
            >
              Select CAS
            </Button>
          </CardFooter>
        </Card>

        <Card className="border hover:border-cas-primary transition-all hover:shadow-md cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headset className="mr-2 text-cas-primary" />
              VRAIE Assessment
            </CardTitle>
            <CardDescription>VR Assessment Interactive Experience</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              An immersive virtual reality assessment that evaluates patient responses
              to simulated environments and scenarios designed to measure mental health across selected domains.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleSelectAssessmentType('VRAIE')}
              className="w-full bg-cas-primary hover:bg-cas-dark"
            >
              Select VRAIE
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentTypeSelection;
