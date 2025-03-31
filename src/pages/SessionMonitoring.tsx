
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Clock, FileText, BarChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

enum SessionStatus {
  InProgress = 'In Progress',
  GeneratingTranscript = 'Generating Transcript',
  GeneratingReport = 'Generating Report',
  Complete = 'Complete'
}

const SessionMonitoring = () => {
  const { isAuthenticated, patientId } = useAuth();
  const { sessionSummary } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.InProgress);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    // Simulate session progression
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      if (elapsedTime < 20) {
        setProgress(Math.min(100, elapsedTime * 5));
        setStatus(SessionStatus.InProgress);
      } else if (elapsedTime < 30) {
        setStatus(SessionStatus.GeneratingTranscript);
      } else if (elapsedTime < 40) {
        setStatus(SessionStatus.GeneratingReport);
      } else {
        setStatus(SessionStatus.Complete);
        clearInterval(timer);
        
        toast({
          title: "Session Complete",
          description: "The assessment has been completed and report is ready",
        });
        
        // Automatically navigate to report after a delay
        setTimeout(() => {
          navigate('/summary');
        }, 3000);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [elapsedTime, navigate, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!sessionSummary) {
    return <Navigate to="/domains" />;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case SessionStatus.InProgress:
        return <Clock className="h-6 w-6 text-blue-500" />;
      case SessionStatus.GeneratingTranscript:
        return <FileText className="h-6 w-6 text-amber-500" />;
      case SessionStatus.GeneratingReport:
      case SessionStatus.Complete:
        return <BarChart className="h-6 w-6 text-green-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Session Monitoring</h1>
        <p className="text-gray-600 mt-2">
          Patient ID: {patientId} • Session #{sessionSummary.sessionNumber}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2">Session Status: {status}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Elapsed Time</p>
                <p className="text-lg font-medium">{formatTime(elapsedTime)}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Patient ID</p>
                <p className="text-lg font-medium">{patientId}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Domains</p>
                <p className="text-lg font-medium">{sessionSummary.domains.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={showTranscript} 
                onCheckedChange={setShowTranscript} 
                id="transcript-toggle"
              />
              <label htmlFor="transcript-toggle" className="cursor-pointer">
                Show Real-time Transcript
              </label>
            </div>
            
            {showTranscript && (
              <div className="mt-4">
                <Separator className="my-4" />
                <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono text-gray-700">
                    {sessionSummary.transcript}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => navigate('/domains')}
          className="mr-4"
        >
          Cancel Session
        </Button>
        <Button
          disabled={status !== SessionStatus.Complete}
          onClick={() => navigate('/summary')}
        >
          {status === SessionStatus.Complete ? 'View Report' : 'Processing...'}
        </Button>
      </div>
    </div>
  );
};

export default SessionMonitoring;
