
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Domain } from '@/contexts/DomainContext';
import { Clock, AlertCircle } from 'lucide-react';

// Mock previous sessions
const mockPreviousSessions = [
  {
    id: '1',
    date: new Date(2023, 9, 15), // October 15, 2023
    domains: ['mood', 'sleep', 'coping'],
    summary: 'Initial assessment showing moderate depression symptoms with sleep onset issues.'
  },
  {
    id: '2',
    date: new Date(2023, 10, 1), // November 1, 2023
    domains: ['mood', 'functioning', 'social'],
    summary: 'Follow-up showing improvement in mood but continued challenges with social engagement.'
  },
  {
    id: '3',
    date: new Date(2023, 10, 20), // November 20, 2023
    domains: ['physical', 'functioning', 'substance'],
    summary: 'Physical symptoms reducing, daily functioning improving. Substance use concerns addressed.'
  }
];

// Mock domain completion tracking
const mockDomainCompletionData = [
  { id: 'mood', name: 'Mood', completed: 2, total: 3 },
  { id: 'sleep', name: 'Sleep', completed: 1, total: 3 },
  { id: 'functioning', name: 'Functioning', completed: 2, total: 2 },
  { id: 'coping', name: 'Coping', completed: 1, total: 3 },
  { id: 'social', name: 'Social', completed: 1, total: 2 },
  { id: 'physical', name: 'Physical', completed: 1, total: 1 },
  { id: 'substance', name: 'Substance Use', completed: 1, total: 1 },
  { id: 'history', name: 'History', completed: 0, total: 1 },
];

const MultiSessionView = () => {
  const { isAuthenticated, patientId } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Calculate recommended domains based on completion
  const recommendedDomains = mockDomainCompletionData
    .filter(domain => domain.completed < domain.total)
    .sort((a, b) => (a.completed / a.total) - (b.completed / b.total))
    .slice(0, 3);

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Session History</h1>
          <p className="text-gray-600 mt-2">
            Patient ID: {patientId} • {mockPreviousSessions.length} Previous Sessions
          </p>
        </div>
        <Button 
          onClick={() => navigate('/domains')}
          className="bg-cas-primary hover:bg-cas-dark"
        >
          Start New Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Previous Sessions</CardTitle>
              <CardDescription>
                Assessment history for this patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockPreviousSessions.map((session, index) => (
                <div key={session.id} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Session #{mockPreviousSessions.length - index}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {session.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/summary')}
                    >
                      View Details
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {session.domains.map(domainId => {
                      const domain = mockDomainCompletionData.find(d => d.id === domainId);
                      return domain ? (
                        <div 
                          key={domainId}
                          className="bg-cas-light text-cas-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {domain.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <p className="text-gray-700 text-sm">{session.summary}</p>
                  
                  {index < mockPreviousSessions.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Domain Completion</CardTitle>
              <CardDescription>
                Progress across required assessment domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDomainCompletionData.map(domain => (
                <div key={domain.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{domain.name}</span>
                    <span className="text-sm text-gray-500">
                      {domain.completed}/{domain.total}
                    </span>
                  </div>
                  <Progress 
                    value={(domain.completed / domain.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                Recommended Domains
              </CardTitle>
              <CardDescription>
                Suggested focus for next assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendedDomains.map(domain => (
                  <li key={domain.id} className="flex items-center bg-amber-50 p-2 rounded-md">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-gray-700">{domain.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {domain.completed}/{domain.total} completed
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-4 bg-cas-primary hover:bg-cas-dark"
                onClick={() => navigate('/domains')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Schedule Next Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiSessionView;
