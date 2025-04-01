
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Headset, BarChart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const SidebarCollapsible = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const location = useLocation();
  const { clinicianId, patientId, logout } = useAuth();

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial render
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links: SidebarLink[] = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/domains', label: 'Domain Selection', icon: <Headset size={20} /> },
    { to: '/summary', label: 'Session Summary', icon: <BarChart size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/domains') {
      return ['/domains', '/monitoring'].includes(location.pathname);
    }
    return location.pathname === path;
  };

  return (
    <div 
      className={cn(
        "h-full bg-white border-r border-cas-border flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo and Header */}
      <div className={cn(
        "p-4 border-b border-cas-border flex items-center transition-all duration-300",
        collapsed ? "justify-center" : "px-6"
      )}>
        {collapsed ? (
          <div className="rounded-md bg-cas-primary text-white font-bold text-xl p-2">CAS</div>
        ) : (
          <div className="flex items-center">
            <div className="rounded-md bg-cas-primary text-white font-bold text-xl p-2 mr-2">CAS</div>
            <div className="text-gray-700 font-medium">Admin Portal</div>
          </div>
        )}
      </div>
      
      {/* User Info - Only shown when expanded */}
      {!collapsed && (
        <div className="px-6 py-3 border-b border-cas-border">
          <div className="text-xs text-gray-500">
            Clinician ID: {clinicianId} | Patient: {patientId}
          </div>
        </div>
      )}
      
      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <TooltipProvider delayDuration={300}>
          {links.map((link) => (
            <Tooltip key={link.to}>
              <TooltipTrigger asChild>
                <div>
                  {link.disabled ? (
                    <div
                      className={cn(
                        "flex items-center text-gray-400 cursor-not-allowed opacity-50 px-4 py-3 my-1",
                        collapsed ? "justify-center mx-2 rounded-md" : "mx-3 px-3 rounded-md"
                      )}
                    >
                      <span className="shrink-0">{link.icon}</span>
                      {!collapsed && <span className="ml-3">{link.label}</span>}
                    </div>
                  ) : (
                    <Link
                      to={link.to}
                      className={cn(
                        "flex items-center px-4 py-3 my-1 text-gray-700 transition-colors duration-200",
                        isActive(link.to) 
                          ? "bg-cas-light text-cas-primary font-medium" 
                          : "hover:bg-gray-50",
                        collapsed 
                          ? "justify-center mx-2 rounded-md" 
                          : "mx-3 px-3 rounded-md",
                        isActive(link.to) && !collapsed && "border-r-4 border-cas-primary"
                      )}
                    >
                      <span className="shrink-0">{link.icon}</span>
                      {!collapsed && <span className="ml-3">{link.label}</span>}
                    </Link>
                  )}
                </div>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-gray-800 text-white border-none py-1 px-2">
                  {link.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      
      {/* Logout */}
      <div className={cn(
        "border-t border-cas-border p-4",
        collapsed ? "flex justify-center" : ""
      )}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200",
                  collapsed ? "w-10 h-10 p-0" : "w-full justify-start"
                )}
                onClick={logout}
              >
                <LogOut size={20} className={collapsed ? "" : "mr-2"} />
                {!collapsed && "Logout"}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-gray-800 text-white border-none py-1 px-2">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Collapse/Expand Button */}
      <div className={cn(
        "border-t border-cas-border p-2 flex justify-end",
        collapsed ? "justify-center" : ""
      )}>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default SidebarCollapsible;
