
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useDomains, Domain } from '@/contexts/DomainContext';
import { useToast } from "@/components/ui/use-toast";
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

const DomainSelection = () => {
  const { isAuthenticated, userId } = useAuth();
  const { createSession } = useSession();
  const { 
    availableDomains, 
    selectedDomains, 
    selectDomain, 
    removeDomain, 
    moveUp,
    moveDown,
    clearSelection, 
    resetOrder,
    maxDomains 
  } = useDomains();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleDomainSelect = (domain: Domain) => {
    if (selectedDomains.some(d => d.id === domain.id)) {
      removeDomain(domain.id);
    } else if (selectedDomains.length < maxDomains) {
      selectDomain(domain);
    } else {
      toast({
        title: "Selection limit reached",
        description: `You can only select up to ${maxDomains} domains`,
        variant: "destructive"
      });
    }
  };

  const handleStartSession = () => {
    if (selectedDomains.length === 0) {
      toast({
        title: "No domains selected",
        description: "Please select at least one domain before starting the session",
        variant: "destructive"
      });
      return;
    }

    createSession(userId!, selectedDomains);
    toast({
      title: "Session created",
      description: "Your assessment session has been created"
    });
    navigate('/summary');
  };

  const DomainCard = ({ domain, isSelected, index }: { domain: Domain; isSelected: boolean; index?: number }) => (
    <div
      className={`p-4 mb-3 rounded-lg border shadow-sm cursor-pointer ${
        isSelected ? 'bg-cas-light border-cas-primary' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={() => !isSelected && handleDomainSelect(domain)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{domain.name}</h3>
          <p className="text-sm text-gray-600">{domain.description}</p>
        </div>
        {isSelected ? (
          <div className="flex items-center">
            <div className="bg-cas-primary text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
              #{index! + 1}
            </div>
            <div className="flex flex-col">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  moveUp(index!);
                }}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  moveDown(index!);
                }}
                disabled={index === selectedDomains.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 h-6 w-6 text-red-500" 
              onClick={(e) => {
                e.stopPropagation();
                removeDomain(domain.id);
              }}
            >
              <span className="sr-only">Remove</span>
              ×
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleDomainSelect(domain);
            }}
            disabled={selectedDomains.length >= maxDomains}
            className="rounded-full"
          >
            Select
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assessment Domain Selection</h1>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select and prioritize up to {maxDomains} domains for this assessment session. Click domains to select them,
        and use the arrows to reorder importance.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Domains */}
        <Card>
          <CardHeader>
            <CardTitle>Available Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px]">
              {availableDomains.map((domain) => (
                <DomainCard 
                  key={domain.id} 
                  domain={domain}
                  isSelected={false}
                />
              ))}
              {availableDomains.length === 0 && (
                <p className="text-gray-500 text-center p-4">
                  All domains have been selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Selected Domains */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Selected Domains ({selectedDomains.length}/{maxDomains})</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetOrder}
                disabled={selectedDomains.length <= 1}
              >
                Reset Order
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelection}
                disabled={selectedDomains.length === 0}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`min-h-[300px] border-2 border-dashed rounded-lg p-4 ${
                selectedDomains.length === 0 ? 'border-gray-300' : 'border-cas-secondary'
              }`}
            >
              {selectedDomains.map((domain, index) => (
                <DomainCard 
                  key={domain.id} 
                  domain={domain}
                  index={index}
                  isSelected={true}
                />
              ))}
              {selectedDomains.length === 0 && (
                <p className="text-gray-500 text-center p-4">
                  Click domains from the left panel to select them
                </p>
              )}
            </div>
            
            <div className="mt-6">
              <Button
                className="w-full bg-cas-primary hover:bg-cas-dark"
                disabled={selectedDomains.length === 0}
                onClick={handleStartSession}
              >
                Start Assessment Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainSelection;
