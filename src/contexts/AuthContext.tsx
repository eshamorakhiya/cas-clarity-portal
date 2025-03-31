
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  clinicianId: string | null;
  patientId: string | null;
  login: (clinicianId: string, patientId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clinicianId, setClinicianId] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const { toast } = useToast();

  const login = async (cId: string, pId: string): Promise<boolean> => {
    // For prototype, we're just checking if clinician ID is valid format
    if (/^\d{4,6}$/.test(cId) && pId.trim() !== '') {
      setIsAuthenticated(true);
      setClinicianId(cId);
      setPatientId(pId);
      toast({
        title: "Login Successful",
        description: `Welcome to CAS Admin Portal. Connected to Patient ID: ${pId}`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter a valid 4-6 digit clinician ID and patient ID",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setClinicianId(null);
    setPatientId(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, clinicianId, patientId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
