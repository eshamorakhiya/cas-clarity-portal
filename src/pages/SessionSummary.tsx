
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/components/ui/use-toast';
import { Share, Calendar, FileUp } from 'lucide-react';

const SessionSummary = () => {
  const { isAuthenticated, patientId } = useAuth();
  const { sessionSummary, hasActiveSession } = useSession();
  const [showTranscript, setShowTranscript] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!hasActiveSession || !sessionSummary) {
    return <Navigate to="/dashboard" />;
  }

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minutes`;
  };

  const handleSendToEHR = () => {
    toast({
      title: "Sent to EHR",
      description: "Assessment report has been sent to the electronic health record system."
    });
  };

  const handleShareWithPatient = () => {
    toast({
      title: "Shared with Patient",
      description: "Assessment report has been shared with the patient portal."
    });
  };

  const handleScheduleFollowup = () => {
    toast({
      title: "Follow-up Scheduling",
      description: "The follow-up scheduling feature will be available in the full version."
    });
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Session Summary</h1>
          <p className="text-gray-600">
            Patient ID: {sessionSummary.patientId} • Session #{sessionSummary.sessionNumber}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>
            Assessment completed on {sessionSummary.endTime.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="text-lg font-medium">
                {sessionSummary.startTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">End Time</p>
              <p className="text-lg font-medium">
                {sessionSummary.endTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-lg font-medium">
                {formatDuration(sessionSummary.startTime, sessionSummary.endTime)}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Domains Assessed</h3>
            <div className="flex flex-wrap gap-2">
              {sessionSummary.domains.map((domainSummary, index) => (
                <div 
                  key={domainSummary.domain.id}
                  className="bg-cas-light text-cas-primary text-sm font-medium px-3 py-1 rounded-full flex items-center"
                >
                  <span className="bg-cas-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-1">
                    {index + 1}
                  </span>
                  {domainSummary.domain.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assessment Findings</CardTitle>
          <CardDescription>
            Summary of key findings across all assessed domains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessionSummary.domains.map((domainSummary) => (
            <div key={domainSummary.domain.id}>
              <h3 className="text-lg font-semibold text-cas-dark mb-2">
                {domainSummary.domain.name}
              </h3>
              <p className="text-gray-700 mb-4">{domainSummary.findings}</p>
              <Separator className="my-4" />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-4">
          <Button className="w-full md:w-auto" onClick={handleSendToEHR}>
            <FileUp className="mr-2 h-4 w-4" />
            Send to EHR
          </Button>
          <Button className="w-full md:w-auto" onClick={handleShareWithPatient}>
            <Share className="mr-2 h-4 w-4" />
            Share with Patient
          </Button>
          <Button className="w-full md:w-auto" variant="outline" onClick={handleScheduleFollowup}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Follow-up
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Full Transcript</CardTitle>
            <CardDescription>
              Complete conversation transcript from the assessment
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </span>
            <Switch 
              checked={showTranscript} 
              onCheckedChange={setShowTranscript} 
            />
          </div>
        </CardHeader>
        {showTranscript && (
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono text-gray-700">
                {sessionSummary.transcript}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SessionSummary;
