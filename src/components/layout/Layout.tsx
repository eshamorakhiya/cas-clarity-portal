
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from "sonner";
import SidebarCollapsible from './SidebarCollapsible';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const DemoIndicator = () => (
  <div className="fixed top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
    Demo Mode
  </div>
);

const NotificationBell = () => {
  const handleNotificationClick = () => {
    toast.info("No new notifications", {
      position: "bottom-right"
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative animate-micro" 
      onClick={handleNotificationClick}
    >
      <Bell size={20} className="text-gray-600" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-cas-primary rounded-full"></span>
    </Button>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, patientId, clinicianId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const getBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbMap: Record<string, { label: string, link: string }> = {
      'dashboard': { label: 'Dashboard', link: '/dashboard' },
      'assessment-type': { label: 'Assessment Type', link: '/assessment-type' },
      'domains': { label: 'Domain Selection', link: '/domains' },
      'monitoring': { label: 'Session Monitoring', link: '/monitoring' },
      'summary': { label: 'Session Summary', link: '/summary' },
      'multi-session': { label: 'Session History', link: '/multi-session' }
    };
    
    return pathnames.map((path, i) => {
      const routeInfo = breadcrumbMap[path] || { label: path.charAt(0).toUpperCase() + path.slice(1), link: `/${path}` };
      const isLast = i === pathnames.length - 1;
      
      return {
        label: routeInfo.label,
        link: routeInfo.link,
        isLast
      };
    });
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="min-h-screen bg-cas-background flex">
      {/* Sidebar Navigation */}
      <SidebarCollapsible />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-cas-border sticky top-0 z-10 shadow-sm">
          <div className="px-6 h-full flex items-center justify-between">
            <div className="flex-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  {breadcrumbItems.map((item, i) => (
                    <React.Fragment key={i}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {item.isLast ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-gray-600 animate-micro">
                  <Search size={20} />
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 animate-micro"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              
              <NotificationBell />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium text-gray-700 flex items-center gap-2 animate-micro"
              >
                <div className="w-8 h-8 rounded-full bg-cas-primary/10 text-cas-primary flex items-center justify-center">
                  {clinicianId?.substring(0, 2) || "C"}
                </div>
                <span>Clinician</span>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Demo Mode Indicator */}
      <DemoIndicator />
    </div>
  );
};

export default Layout;
