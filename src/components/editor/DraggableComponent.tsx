"use client";

import * as React from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { BaseComponent } from "@/types/pageComponents";
import { ComponentRenderer } from "./ComponentRenderer";

interface DraggableComponentProps {
  component: BaseComponent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (dragIndex: number, dropIndex: number) => void;
}

export function DraggableComponent({
  component,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMove,
}: DraggableComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "component",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag, preview] = useDrag({
    type: "component",
    item: () => {
      return { id: component.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragRef = useRef<HTMLDivElement>(null);
  const opacity = isDragging ? 0.4 : 1;

  // Connect the drag source to the drag handle
  drag(dragRef);
  // Connect the drop target and preview to the main container
  preview(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={`group relative border-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-transparent hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag Handle and Controls */}
      <div
        className={`absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isSelected ? "opacity-100" : ""
        }`}
      >
        {" "}
        <div
          ref={dragRef}
          className="cursor-move p-1 bg-white border rounded shadow-sm hover:bg-gray-50"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3 text-red-500" />
        </Button>
      </div>
      {/* Mobile Controls (shown as overlay) */}
      <div
        className={`lg:hidden absolute top-2 right-2 flex space-x-1 ${
          isSelected ? "block" : "hidden"
        }`}
      >
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 bg-white/90 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3 text-red-500" />
        </Button>
      </div>{" "}
      {/* Component Content */}
      <div className="p-3">
        <ComponentRenderer
          component={component}
          isSelected={isSelected}
          isPreview={false}
        />
      </div>
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
            {component.type}
          </div>
        </div>
      )}
    </div>
  );
}
