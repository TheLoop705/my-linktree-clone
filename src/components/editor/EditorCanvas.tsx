"use client";

import * as React from "react";
import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { BaseComponent } from "@/types/pageComponents";
import { ComponentRenderer } from "./ComponentRenderer";
import { DraggableComponent } from "./DraggableComponent";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";

interface EditorCanvasProps {
  components: BaseComponent[];
  selectedComponent: BaseComponent | null;
  onSelectComponent: (component: BaseComponent | null) => void;
  onReorderComponents: (newOrder: string[]) => void;
  onDeleteComponent: (componentId: string) => void;
  previewMode: "mobile" | "desktop";
}

export function EditorCanvas({
  components,
  selectedComponent,
  onSelectComponent,
  onReorderComponents,
  onDeleteComponent,
  previewMode,
}: EditorCanvasProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item: { id: string; index: number }, monitor) => {
      if (!monitor.didDrop()) {
        // Handle drop logic here if needed
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveComponent = useCallback(
    (dragIndex: number, dropIndex: number) => {
      const draggedComponent = components[dragIndex];
      const newComponents = [...components];

      // Remove the dragged component from its original position
      newComponents.splice(dragIndex, 1);

      // Insert it at the new position
      newComponents.splice(dropIndex, 0, draggedComponent);

      // Update the order based on new array positions
      const newOrder = newComponents.map((component) => component.id);
      onReorderComponents(newOrder);
    },
    [components, onReorderComponents]
  );

  const handleCanvasClick = () => {
    onSelectComponent(null);
  };

  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  const canvasClasses = `
    min-h-full p-4 transition-colors duration-200
    ${isOver ? "bg-blue-50" : "bg-white"}
    ${previewMode === "mobile" ? "max-w-sm mx-auto" : "max-w-4xl mx-auto"}
  `;
  return (
    <div className="h-full overflow-auto bg-gray-100">
      <div className="min-h-full flex items-start justify-center p-4">
        <div
          ref={drop as any}
          className={canvasClasses}
          onClick={handleCanvasClick}
          style={{
            minHeight: "calc(100vh - 200px)",
            width: previewMode === "mobile" ? "375px" : "100%",
            maxWidth: previewMode === "mobile" ? "375px" : "768px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {sortedComponents.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-medium mb-2">
                  Start building your page
                </h3>
                <p className="text-sm">
                  {previewMode === "mobile"
                    ? "Tap the + button to add your first component"
                    : "Choose a component from the library to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedComponents.map((component, index) => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  index={index}
                  isSelected={selectedComponent?.id === component.id}
                  onSelect={() => onSelectComponent(component)}
                  onDelete={() => onDeleteComponent(component.id)}
                  onMove={moveComponent}
                />
              ))}
            </div>
          )}

          {/* Drop zone at the bottom */}
          {sortedComponents.length > 0 && (
            <div className="h-8 mt-4 border-2 border-dashed border-transparent hover:border-blue-300 transition-colors duration-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity duration-200">
                Drop component here
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
