
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
  Headset 
} from 'lucide-react';

const DemoIndicator = () => (
  <div className="fixed top-2 right-2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium animate-pulse">
    Demo Mode
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout, patientId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cas-background flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <div className="rounded-md bg-cas-primary text-white font-bold text-xl p-2 mr-2">CAS</div>
            <div className="text-gray-700 font-medium">Admin Portal</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Connected to Patient: {patientId}
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
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
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
