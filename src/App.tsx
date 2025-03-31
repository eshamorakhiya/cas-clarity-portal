
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AssessmentTypeSelection from "./pages/AssessmentTypeSelection";
import DomainSelection from "./pages/DomainSelection";
import SessionMonitoring from "./pages/SessionMonitoring";
import SessionSummary from "./pages/SessionSummary";
import MultiSessionView from "./pages/MultiSessionView";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { DomainProvider } from "./contexts/DomainContext";
import { SessionProvider } from "./contexts/SessionContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DomainProvider>
          <SessionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  }
                />
                <Route 
                  path="/assessment-type" 
                  element={
                    <Layout>
                      <AssessmentTypeSelection />
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
                <Route 
                  path="/multi-session" 
                  element={
                    <Layout>
                      <MultiSessionView />
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

export default App;
