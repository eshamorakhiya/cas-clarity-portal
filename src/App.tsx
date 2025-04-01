import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DomainSelection from "./pages/DomainSelection";
import SessionMonitoring from "./pages/SessionMonitoring";
import SessionSummary from "./pages/SessionSummary";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { DomainProvider } from "./contexts/DomainContext";
import { SessionProvider } from "./contexts/SessionContext";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [timeOfDay, setTimeOfDay] = useState('day');
  
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
        document.body.classList.add('time-morning');
        document.body.classList.remove('time-afternoon', 'time-evening');
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('afternoon');
        document.body.classList.add('time-afternoon');
        document.body.classList.remove('time-morning', 'time-evening');
      } else {
        setTimeOfDay('evening');
        document.body.classList.add('time-evening');
        document.body.classList.remove('time-morning', 'time-afternoon');
      }
    };
    
    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DomainProvider>
            <SessionProvider>
              <Toaster />
              <Sonner 
                position="bottom-right"
                expand={false}
                richColors
                toastOptions={{
                  duration: 4000,
                  className: "rounded-lg border border-cas-border text-sm animate-scale-in",
                }}
              />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <Layout>
                        <Dashboard />
                      </Layout>
                    }
                  />
                  <Route 
                    path="/domains" 
                    element={
                      <Layout>
                        <DomainSelection />
                      </Layout>
                    }
                  />
                  <Route 
                    path="/monitoring" 
                    element={
                      <Layout>
                        <SessionMonitoring />
                      </Layout>
                    }
                  />
                  <Route 
                    path="/summary" 
                    element={
                      <Layout>
                        <SessionSummary />
                      </Layout>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SessionProvider>
          </DomainProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
