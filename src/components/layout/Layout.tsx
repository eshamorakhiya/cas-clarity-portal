
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  ClipboardList, 
  History, 
  Settings, 
  LogOut, 
  Users, 
  BarChart, 
  Headset,
  ChevronRight,
  Bell
} from 'lucide-react';
import { toast } from "sonner";

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
      className="relative" 
      onClick={handleNotificationClick}
    >
      <Bell size={20} className="text-gray-600" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-cas-primary rounded-full"></span>
    </Button>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout, patientId, clinicianId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      position: "bottom-right"
    });
    navigate('/');
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    let breadcrumbPath = '';
    let breadcrumbLabel = '';
    
    switch(pathnames[0]) {
      case 'dashboard':
        breadcrumbLabel = 'Dashboard';
        break;
      case 'assessment-type':
        breadcrumbLabel = 'Assessment Type';
        break;
      case 'domains':
        breadcrumbLabel = 'Domain Selection';
        break;
      case 'monitoring':
        breadcrumbLabel = 'Session Monitoring';
        break;
      case 'summary':
        breadcrumbLabel = 'Session Summary';
        break;
      case 'multi-session':
        breadcrumbLabel = 'Session History';
        break;
      default:
        breadcrumbLabel = pathnames[0] ? pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1) : '';
    }
    
    return (
      <div className="flex items-center text-sm">
        <Link to="/dashboard" className="text-gray-500 hover:text-cas-primary">Home</Link>
        {breadcrumbLabel && (
          <>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="font-medium">{breadcrumbLabel}</span>
          </>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cas-background flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md flex flex-col border-r border-cas-border">
        <div className="p-6 border-b border-cas-border">
          <div className="flex items-center">
            <div className="rounded-md bg-cas-primary text-white font-bold text-xl p-2 mr-2">CAS</div>
            <div className="text-gray-700 font-medium">Admin Portal</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Clinician ID: {clinicianId} | Patient: {patientId}
          </div>
        </div>
        
        <nav className="flex-1 py-6">
          <NavItem 
            to="/dashboard" 
            label="Dashboard" 
            icon={<Home size={18} />} 
            active={location.pathname === '/dashboard'} 
          />
          <NavItem 
            to="/assessment-type" 
            label="New Assessment" 
            icon={<Headset size={18} />} 
            active={['/assessment-type', '/domains', '/monitoring'].includes(location.pathname)} 
          />
          <NavItem 
            to="/summary" 
            label="Current Session" 
            icon={<BarChart size={18} />} 
            active={location.pathname === '/summary'} 
          />
          <NavItem 
            to="/multi-session" 
            label="Session History" 
            icon={<History size={18} />} 
            active={location.pathname === '/multi-session'} 
          />
          <NavItem 
            to="/patients" 
            label="Patient Records" 
            icon={<ClipboardList size={18} />} 
            active={location.pathname === '/patients'} 
            disabled
          />
          <NavItem 
            to="/settings" 
            label="Settings" 
            icon={<Settings size={18} />} 
            active={location.pathname === '/settings'} 
            disabled
          />
        </nav>
        
        <div className="p-4 border-t border-cas-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-cas-border px-6 flex items-center justify-between">
          <div>
            {getBreadcrumbs()}
          </div>
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-cas-primary/10 text-cas-primary flex items-center justify-center">
                {clinicianId?.substring(0, 2) || "C"}
              </div>
              <span>Clinician</span>
            </Button>
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

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, active, disabled }) => {
  const baseClasses = "flex items-center px-6 py-3 text-gray-700 transition-colors duration-200";
  const activeClasses = active ? "bg-cas-light text-cas-primary font-medium border-r-4 border-cas-primary" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100";
  
  return disabled ? (
    <div className={`${baseClasses} ${disabledClasses}`}>
      <span className="mr-3">{icon}</span>
      {label}
    </div>
  ) : (
    <Link to={to} className={`${baseClasses} ${activeClasses} ${disabledClasses}`}>
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default Layout;
