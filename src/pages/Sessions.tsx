
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

const Sessions = () => {
  const { isAuthenticated, patientId } = useAuth();
  const { sessionSummary, hasActiveSession } = useSession();
  const [showTranscript, setShowTranscript] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract session ID and local flag from URL
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId');
  const localOnly = queryParams.get('localOnly') === 'true';

  useEffect(() => {
    // Log the session ID when component mounts
    if (sessionId) {
      console.log(`Session ID: ${sessionId}`);
    }
  }, [sessionId]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!hasActiveSession || !sessionSummary) {
    return <Navigate to="/domains" />;
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sessions</h1>
          <p className="text-gray-600">
            Patient ID: {sessionSummary.patientId}
            {sessionId && <span className="ml-2">• Session ID: {sessionId}</span>}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/domains')}
        >
          Select New Domains
        </Button>
      </div>
      
      {localOnly && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>S3 Storage Failed</AlertTitle>
          <AlertDescription>
            Your domain selections were saved locally only. The data will be uploaded to S3 automatically when connectivity is restored.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sessionSummary.domains.map((domainSummary) => (
              <div key={domainSummary.domain.id} className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-cas-dark mb-2">
                  {domainSummary.domain.name}
                </h3>
                <p className="text-gray-700">{domainSummary.findings}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transcript</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {showTranscript ? 'Hide' : 'Show'} raw transcript
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
        <CardFooter>
          <Button
            variant="outline"
            className="w-full" 
            onClick={() => navigate('/domains')}
          >
            Start New Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Sessions;
