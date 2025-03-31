
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const login = async (id: string): Promise<boolean> => {
    // For prototype, we're just checking if ID is valid format
    // and specifically allowing "1234" as demo patient
    if (/^\d{4,6}$/.test(id)) {
      setIsAuthenticated(true);
      setUserId(id);
      toast({
        title: "Login Successful",
        description: `Welcome to CAS Admin Portal. User ID: ${id}`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter a valid 4-6 digit user ID",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
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
