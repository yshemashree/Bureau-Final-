'use client';

import { useState, useRef } from 'react';
import { GripHorizontal, Trash2 } from 'lucide-react';

interface WorkflowStep {
  id: string;
  productName: string;
  order: number;
}

export function WorkflowBuilder() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    
    const productData = e.dataTransfer.getData('product');
    if (productData) {
      const product = JSON.parse(productData);
      const newStep: WorkflowStep = {
        id: `${product.id}-${Date.now()}`,
        productName: product.name,
        order: workflowSteps.length + 1,
      };
      setWorkflowSteps([...workflowSteps, newStep]);
    }
  };

  const removeStep = (id: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== id));
  };

  const clearWorkflow = () => {
    setWorkflowSteps([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Build Your Workflow</h2>
        <p className="text-muted-foreground">Drag products from below to create your verification workflow</p>
      </div>

      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 transition-all min-h-[200px] flex items-center justify-center ${
          draggedOver
            ? 'border-primary bg-blue-50'
            : 'border-border bg-card'
        }`}
      >
        {workflowSteps.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Drop products here to build your workflow</p>
            <p className="text-sm text-muted-foreground">Start → {workflowSteps.map(s => s.productName).join(' → ')} → Stop</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
                Start
              </div>
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="group relative">
                    <div className="px-4 py-2 bg-card border border-border rounded-lg font-medium text-foreground flex items-center gap-2 hover:shadow-md transition-shadow">
                      <GripHorizontal className="w-4 h-4 text-muted-foreground" />
                      {step.productName}
                    </div>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
                Stop
              </div>
            </div>
            {workflowSteps.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={clearWorkflow}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Clear Workflow
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
