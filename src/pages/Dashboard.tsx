
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';

const Dashboard = () => {
  const { isAuthenticated, userId } = useAuth();
  const { sessionSummary, hasActiveSession } = useSession();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleStartNewSession = () => {
    navigate('/domains');
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button 
          onClick={handleStartNewSession}
          className="bg-cas-primary hover:bg-cas-dark text-white"
        >
          Start New Assessment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Patient ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cas-primary">{userId}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assessment Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cas-primary">{hasActiveSession ? '1' : '0'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${hasActiveSession ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <p className="text-lg font-medium">{hasActiveSession ? 'Assessment Completed' : 'Ready for Assessment'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {hasActiveSession && sessionSummary ? (
        <Card className="mb-8 animate-slide-in">
          <CardHeader>
            <CardTitle>Latest Assessment Summary</CardTitle>
            <CardDescription>
              Session #{sessionSummary.sessionNumber} • Completed {sessionSummary.endTime.toLocaleTimeString()} on {sessionSummary.endTime.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionSummary.domains.map((domainSummary) => (
                <div key={domainSummary.domain.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-lg text-cas-dark mb-2">{domainSummary.domain.name}</h3>
                  <p className="text-gray-700">{domainSummary.findings}</p>
                </div>
              ))}
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/summary')}
                  className="w-full"
                >
                  View Full Summary
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Assessment Sessions</CardTitle>
            <CardDescription>
              Start a new assessment to see results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Begin by selecting domains for your patient assessment. You can prioritize up to 5 domains based on clinical relevance.
            </p>
            <Button 
              onClick={handleStartNewSession}
              className="bg-cas-primary hover:bg-cas-dark text-white"
            >
              Start New Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
