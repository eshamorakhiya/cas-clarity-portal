import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useDomains, Domain } from '@/contexts/DomainContext';
import { ChevronUp, ChevronDown, Check, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { 
  S3Client, 
  PutObjectCommand,
  S3ServiceException 
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  }
});

const DomainSelection = () => {
  const { isAuthenticated, patientId } = useAuth();
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);

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

  const saveDomainsToS3 = async (domains: Domain[], patientId: string): Promise<string> => {
    const sessionId = uuidv4();
    
    const csvContent = domains.map(domain => domain.name).join('\n');
    
    const s3Path = `sessions/${patientId}/${sessionId}/domains.csv`;
    
    try {
      const command = new PutObjectCommand({
        Bucket: 'augmend-llm-inputs-dev',
        Key: s3Path,
        Body: csvContent,
        ContentType: 'text/csv',
      });
      
      await s3Client.send(command);
      console.log(`Successfully uploaded domain data to S3: ${s3Path}`);
      
      return sessionId;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      
      localStorage.setItem(`domain-data-${sessionId}`, csvContent);
      localStorage.setItem(`domain-data-${sessionId}-pendingUpload`, 'true');
      
      if (error instanceof S3ServiceException) {
        throw new Error(`S3 error (${error.name}): ${error.message}`);
      } else {
        throw new Error(`Failed to save domains: ${(error as Error).message}`);
      }
    }
  };

  const retryPendingUploads = async () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('-pendingUpload')) {
        const dataKey = key.replace('-pendingUpload', '');
        const data = localStorage.getItem(dataKey);
        const sessionId = dataKey.split('-').pop();
        
        if (data && sessionId) {
          try {
            const command = new PutObjectCommand({
              Bucket: 'augmend-llm-inputs-dev',
              Key: `sessions/${patientId}/${sessionId}/domains.csv`,
              Body: data,
              ContentType: 'text/csv',
            });
            
            await s3Client.send(command);
            
            localStorage.removeItem(key);
            localStorage.removeItem(dataKey);
            
            toast.success("Successfully uploaded pending data to S3");
          } catch (error) {
            console.error("Failed to upload pending data:", error);
          }
        }
      }
    }
  };

  const handleStartSession = async () => {
    if (selectedDomains.length === 0) {
      toast({
        title: "No domains selected",
        description: "Please select at least one domain before starting the session",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    let sessionId: string | null = null;

    try {
      await retryPendingUploads();
      
      sessionId = await saveDomainsToS3(selectedDomains, patientId!);
      setSavedSessionId(sessionId);
      
      createSession(patientId!, selectedDomains);
      
      toast.success("Domains saved", {
        description: `Session ID: ${sessionId}`,
        position: "bottom-right"
      });
      
      navigate(`/summary?sessionId=${sessionId}`);
    } catch (error) {
      console.error("Error saving domains:", error);
      toast.error("Error saving domains", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
        position: "bottom-right"
      });
      
      if (sessionId) {
        createSession(patientId!, selectedDomains);
        navigate(`/summary?sessionId=${sessionId}&localOnly=true`);
      }
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-800">{domain.name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1">
                    <Info className="h-4 w-4 text-gray-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{domain.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
            <Check className="mr-1 h-3 w-3" />
            Select
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Domain Selection</h1>
          <p className="text-gray-600">
            Patient ID: {patientId}
          </p>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select and prioritize up to {maxDomains} domains for this assessment session.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                disabled={selectedDomains.length === 0 || isLoading}
                onClick={handleStartSession}
              >
                {isLoading ? 'Saving to S3...' : 'Save and Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainSelection;
