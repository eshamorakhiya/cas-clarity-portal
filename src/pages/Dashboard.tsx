
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronRight, 
  Users, 
  Clock, 
  BarChart, 
  CalendarDays, 
  History, 
  Activity, 
  Headset, 
  Zap,
  MessageSquare,
  LineChart,
  Calendar
} from 'lucide-react';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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

  // Activity data
  const activityData = [
    { date: 'Mon', sessions: 3 },
    { date: 'Tue', sessions: 2 },
    { date: 'Wed', sessions: 4 },
    { date: 'Thu', sessions: 3 },
    { date: 'Fri', sessions: 5 },
    { date: 'Sat', sessions: 1 },
    { date: 'Sun', sessions: 2 },
  ];

  // Domain coverage data
  const domainData = [
    { name: 'Sleep', value: 85, color: '#1E88E5' },
    { name: 'Mood', value: 70, color: '#42A5F5' },
    { name: 'Social', value: 60, color: '#64B5F6' },
    { name: 'Physical', value: 75, color: '#90CAF9' },
    { name: 'Functioning', value: 45, color: '#BBDEFB' },
  ];

  // Quick action cards
  const quickActions = [
    { 
      title: 'New Assessment', 
      description: 'Start a new patient assessment session',
      icon: <Headset className="h-8 w-8 text-cas-primary" />,
      action: () => navigate('/assessment-type')
    },
    { 
      title: 'View Reports', 
      description: 'Access comprehensive assessment reports',
      icon: <BarChart className="h-8 w-8 text-cas-primary" />,
      action: () => navigate('/summary')
    },
    { 
      title: 'Session History', 
      description: 'Review past assessment sessions',
      icon: <History className="h-8 w-8 text-cas-primary" />,
      action: () => navigate('/multi-session')
    },
    { 
      title: 'Schedule Session', 
      description: 'Book a future assessment appointment',
      icon: <Calendar className="h-8 w-8 text-cas-primary" />,
      action: () => {}
    },
  ];

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to CAS Admin Portal</h1>
        <p className="text-gray-600 mt-2">
          {formattedDate} • Clinician ID: {clinicianId} • Connected to Patient ID: {patientId}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-elevated hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">1</div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-cas-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Sessions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">3</div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <CalendarDays className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">2</div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">Completed Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">12</div>
              <div className="p-2 bg-green-50 rounded-lg">
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Weekly Activity Chart */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-cas-primary" /> Weekly Activity
            </CardTitle>
            <CardDescription>Sessions conducted over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E88E5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
                            <p className="text-sm text-gray-500">{payload[0].payload.date}</p>
                            <p className="text-sm font-medium text-cas-primary">
                              {payload[0].value} Sessions
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#1E88E5" 
                    fillOpacity={1} 
                    fill="url(#colorSessions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Domain Coverage */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-cas-primary" /> Domain Coverage
            </CardTitle>
            <CardDescription>Assessment completion by domain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {domainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
                            <p className="text-sm font-medium">{payload[0].name}</p>
                            <p className="text-sm text-gray-600">{payload[0].value}% Complete</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {domainData.map((domain, i) => (
                <div key={i} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: domain.color }}></div>
                  <span>{domain.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, i) => (
          <Card key={i} className="card-elevated hover-lift cursor-pointer" onClick={action.action}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-cas-light rounded-lg">
                  {action.icon}
                </div>
                <h3 className="text-lg font-medium mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <Button variant="ghost" size="sm" className="text-cas-primary mt-2">
                  Select <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-elevated hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-cas-primary" /> Patient Assessment
            </CardTitle>
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
              className="w-full btn-primary-gradient" 
              onClick={() => navigate('/assessment-type')}
            >
              Start New Assessment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-elevated hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-cas-primary" /> Recent Sessions
            </CardTitle>
            <CardDescription>
              View and manage previous assessment sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div 
                className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer animate-micro" 
                onClick={() => navigate('/multi-session')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <History className="h-5 w-5 text-cas-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Session History</p>
                    <p className="text-sm text-gray-500">3 previous sessions</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div 
                className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer animate-micro" 
                onClick={() => navigate('/summary')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg mr-3">
                    <BarChart className="h-5 w-5 text-green-500" />
                  </div>
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
              className="w-full btn-secondary-gradient" 
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
