'use client';

import { useState } from 'react';
import { GripHorizontal } from 'lucide-react';

interface DraggableProductProps {
  id: string;
  name: string;
  description: string;
}

export function DraggableProduct({ id, name, description }: DraggableProductProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('product', JSON.stringify({ id, name, description }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing transition-all whitespace-nowrap ${
        isDragging
          ? 'opacity-50 scale-95 shadow-lg'
          : 'hover:border-primary hover:shadow-md'
      }`}
    >
      <GripHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-foreground text-sm">{name}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}
