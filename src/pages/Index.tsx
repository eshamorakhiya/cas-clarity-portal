
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Headset, Users, Activity, Brain, MessageCircle, Shield } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const [clinicianId, setClinicianId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Determine time of day for greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(clinicianId, patientId);
      if (success) {
        toast.success("Connected Successfully", {
          description: `Welcome, Clinician ${clinicianId}. Connected to Patient ${patientId}.`,
        });
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Simulate subtle background shift based on time
  const gradientStyle = {
    backgroundPosition: timeOfDay === 'morning' ? '0% 0%' : 
                        timeOfDay === 'afternoon' ? '50% 50%' : '100% 100%'
  };

  const features = [
    { 
      title: "Comprehensive Assessment", 
      description: "Conduct thorough evaluations across multiple mental health domains with standardized protocols.",
      icon: <Brain className="h-10 w-10 text-cas-primary" /> 
    },
    { 
      title: "Real-time Monitoring", 
      description: "Monitor assessment progress as patients complete virtual sessions.",
      icon: <Activity className="h-10 w-10 text-cas-primary" /> 
    },
    { 
      title: "Interactive VR Therapy", 
      description: "Connect with the VRAIE system for immersive therapeutic interventions.",
      icon: <Headset className="h-10 w-10 text-cas-primary" /> 
    },
    { 
      title: "Patient Management", 
      description: "Track progress across multiple sessions with comprehensive reporting.",
      icon: <Users className="h-10 w-10 text-cas-primary" /> 
    },
    { 
      title: "Conversational Assessment", 
      description: "Natural language processing for intuitive patient interactions.",
      icon: <MessageCircle className="h-10 w-10 text-cas-primary" /> 
    },
    { 
      title: "Data Security", 
      description: "HIPAA-compliant platform ensuring patient confidentiality and data protection.",
      icon: <Shield className="h-10 w-10 text-cas-primary" /> 
    },
  ];

  return (
    <div className="min-h-screen time-of-day-gradient flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={gradientStyle}>
      <div className="fixed top-4 right-4 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
        Demo Mode
      </div>
      
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-8 items-center">
        <div className="flex-1 max-w-xl">
          <div className="text-center md:text-left mb-8">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="rounded-xl bg-cas-primary text-white font-bold text-2xl p-3 mr-3">CAS</div>
              <h2 className="text-3xl font-bold text-gray-800">Admin Portal</h2>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Good {timeOfDay}, Clinician</h1>
            <p className="text-xl text-gray-600">
              Welcome to the next generation mental health assessment platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-subtle hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="mb-4 p-2 bg-cas-light rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <Card className="card-elevated w-full">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-center font-bold">Connect to Session</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="clinicianId" className="block text-sm font-medium text-gray-700 mb-1">
                    Clinician ID
                  </label>
                  <input
                    id="clinicianId"
                    type="text"
                    placeholder="Enter 4-6 digit ID"
                    className="input-enhanced w-full"
                    value={clinicianId}
                    onChange={(e) => setClinicianId(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Your assigned 4-6 digit clinician identifier
                  </p>
                </div>
                
                <div>
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient ID
                  </label>
                  <input
                    id="patientId"
                    type="text"
                    placeholder="Enter patient identifier"
                    className="input-enhanced w-full"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The patient's unique identifier for this session
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full btn-primary-gradient h-12"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </span>
                    ) : "Connect to Session"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="w-full border-t border-gray-200 my-2"></div>
              <div className="text-sm text-gray-600 text-center">
                <p>Demo credentials: Clinician ID <span className="font-mono">1234</span>, Patient ID <span className="font-mono">P001</span></p>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Having trouble connecting? <a href="#" className="text-cas-primary hover:text-cas-dark">Contact support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
