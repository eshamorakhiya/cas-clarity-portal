
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headset, MessageSquare, Brain, ThumbsUp, ArrowRight, Activity } from 'lucide-react';
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
        <Card className="card-elevated hover-lift overflow-hidden border-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
          
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <MessageSquare className="text-cas-primary h-5 w-5" />
              </div>
              CAS Assessment
            </CardTitle>
            <CardDescription className="text-sm">
              Conversational Assessment System
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-5">
              <p className="text-gray-600">
                A structured conversational assessment that guides patients through 
                a dialogue-based evaluation of their mental health status across selected domains.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-md mr-2 shrink-0">
                    <Brain className="h-4 w-4 text-cas-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cognitive Assessment</p>
                    <p className="text-xs text-gray-500">Natural language processing</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-md mr-2 shrink-0">
                    <Activity className="h-4 w-4 text-cas-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mood Tracking</p>
                    <p className="text-xs text-gray-500">Sentiment analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-md mr-2 shrink-0">
                    <ThumbsUp className="h-4 w-4 text-cas-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Patient Comfort</p>
                    <p className="text-xs text-gray-500">Lower anxiety format</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-md mr-2 shrink-0">
                    <MessageSquare className="h-4 w-4 text-cas-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rich Transcripts</p>
                    <p className="text-xs text-gray-500">Detailed conversation logs</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-3">
            <Button 
              onClick={() => handleSelectAssessmentType('CAS')}
              className="w-full btn-primary-gradient group"
            >
              Select CAS
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-elevated hover-lift overflow-hidden border-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white -z-10"></div>
          
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Headset className="text-purple-600 h-5 w-5" />
              </div>
              VRAIE Assessment
            </CardTitle>
            <CardDescription className="text-sm">
              VR Assessment Interactive Experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-5">
              <p className="text-gray-600">
                An immersive virtual reality assessment that evaluates patient responses
                to simulated environments and scenarios designed to measure mental health across selected domains.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="flex items-start">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-2 shrink-0">
                    <Headset className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Immersive Experience</p>
                    <p className="text-xs text-gray-500">Real-world simulations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-2 shrink-0">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Behavioral Analysis</p>
                    <p className="text-xs text-gray-500">Action-based insights</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-2 shrink-0">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Physiological Tracking</p>
                    <p className="text-xs text-gray-500">Stress response monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-2 shrink-0">
                    <ThumbsUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Engaging Format</p>
                    <p className="text-xs text-gray-500">Higher patient engagement</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-3">
            <Button 
              onClick={() => handleSelectAssessmentType('VRAIE')}
              className="w-full group"
              style={{ 
                background: "linear-gradient(90deg, rgb(124, 58, 237) 0%, rgb(139, 92, 246) 100%)",
                color: "white"
              }}
            >
              Select VRAIE
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentTypeSelection;
