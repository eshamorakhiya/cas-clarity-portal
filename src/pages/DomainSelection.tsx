
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useDomains, Domain } from '@/contexts/DomainContext';
import { useToast } from "@/components/ui/use-toast";

const DomainSelection = () => {
  const { isAuthenticated, userId } = useAuth();
  const { createSession } = useSession();
  const { 
    availableDomains, 
    selectedDomains, 
    selectDomain, 
    removeDomain, 
    reorderDomains, 
    clearSelection, 
    resetOrder,
    maxDomains 
  } = useDomains();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Moving within the selected domains list
    if (source.droppableId === 'selected-domains' && destination.droppableId === 'selected-domains') {
      reorderDomains(source.index, destination.index);
      return;
    }

    // Moving from available to selected
    if (source.droppableId === 'available-domains' && destination.droppableId === 'selected-domains') {
      if (selectedDomains.length >= maxDomains) {
        toast({
          title: "Selection limit reached",
          description: `You can only select up to ${maxDomains} domains`,
          variant: "destructive"
        });
        return;
      }
      
      const domain = availableDomains[source.index];
      selectDomain(domain);
      return;
    }

    // Moving from selected to available (removing)
    if (source.droppableId === 'selected-domains' && destination.droppableId === 'available-domains') {
      const domain = selectedDomains[source.index];
      removeDomain(domain.id);
      return;
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

  const DomainCard = ({ domain, index, isSelected }: { domain: Domain; index: number; isSelected: boolean }) => (
    <Draggable draggableId={domain.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 rounded-lg border shadow-sm ${
            isSelected ? 'bg-cas-light border-cas-primary' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{domain.name}</h3>
              <p className="text-sm text-gray-600">{domain.description}</p>
            </div>
            {isSelected && (
              <div className="bg-cas-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                #{index + 1}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assessment Domain Selection</h1>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select and prioritize up to {maxDomains} domains for this assessment session. Drag domains between lists to select,
        and reorder within the selected list to prioritize importance.
      </p>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Domains */}
          <Card>
            <CardHeader>
              <CardTitle>Available Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="available-domains">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[300px]"
                  >
                    {availableDomains.map((domain, index) => (
                      <DomainCard 
                        key={domain.id} 
                        domain={domain} 
                        index={index} 
                        isSelected={false} 
                      />
                    ))}
                    {provided.placeholder}
                    {availableDomains.length === 0 && (
                      <p className="text-gray-500 text-center p-4">
                        All domains have been selected
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
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
              <Droppable droppableId="selected-domains">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
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
                    {provided.placeholder}
                    {selectedDomains.length === 0 && (
                      <p className="text-gray-500 text-center p-4">
                        Drag domains here to select them
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
              
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
      </DragDropContext>
    </div>
  );
};

export default DomainSelection;
