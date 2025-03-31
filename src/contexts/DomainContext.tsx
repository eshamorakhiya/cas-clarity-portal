import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Domain {
  id: string;
  name: string;
  description: string;
}

interface DomainContextType {
  availableDomains: Domain[];
  selectedDomains: Domain[];
  selectDomain: (domain: Domain) => void;
  removeDomain: (domainId: string) => void;
  reorderDomains: (startIndex: number, endIndex: number) => void;
  clearSelection: () => void;
  resetOrder: () => void;
  maxDomains: number;
}

const initialDomains: Domain[] = [
  { id: 'history', name: 'History', description: 'Medical history and background' },
  { id: 'sleep', name: 'Sleep', description: 'Sleep patterns and issues' },
  { id: 'mood', name: 'Mood', description: 'Emotional state assessment' },
  { id: 'coping', name: 'Coping', description: 'Stress management techniques' },
  { id: 'social', name: 'Social', description: 'Relationships and support systems' },
  { id: 'physical', name: 'Physical', description: 'Physical health and symptoms' },
  { id: 'substance', name: 'Substance Use', description: 'Alcohol, tobacco, drug usage' },
  { id: 'functioning', name: 'Functioning', description: 'Daily activities and limitations' }
];

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableDomains, setAvailableDomains] = useState<Domain[]>(initialDomains);
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([]);
  const maxDomains = 5;

  const selectDomain = (domain: Domain) => {
    if (selectedDomains.length < maxDomains) {
      setSelectedDomains([...selectedDomains, domain]);
      setAvailableDomains(availableDomains.filter(d => d.id !== domain.id));
    }
  };

  const removeDomain = (domainId: string) => {
    const domain = selectedDomains.find(d => d.id === domainId);
    if (domain) {
      setSelectedDomains(selectedDomains.filter(d => d.id !== domainId));
      setAvailableDomains([...availableDomains, domain]);
    }
  };

  const reorderDomains = (startIndex: number, endIndex: number) => {
    const result = Array.from(selectedDomains);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setSelectedDomains(result);
  };

  const clearSelection = () => {
    setAvailableDomains([...initialDomains]);
    setSelectedDomains([]);
  };

  const resetOrder = () => {
    // Keep the same domains selected but reset to original order
    const originalOrder = initialDomains.filter(domain => 
      selectedDomains.some(selected => selected.id === domain.id)
    );
    setSelectedDomains(originalOrder);
  };

  return (
    <DomainContext.Provider
      value={{
        availableDomains,
        selectedDomains,
        selectDomain,
        removeDomain,
        reorderDomains,
        clearSelection,
        resetOrder,
        maxDomains
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomains = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomains must be used within a DomainProvider');
  }
  return context;
};
