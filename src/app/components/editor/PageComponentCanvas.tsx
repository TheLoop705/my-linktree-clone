"use client";

import React from "react";
import { PageComponent } from "@/types/pageComponents"; // Import the PageComponent type

interface PageComponentCanvasProps {
  pageId: string;
  components: PageComponent[]; // Use the PageComponent type
  onSelectComponent: (component: PageComponent) => void; // Use the PageComponent type
  // TODO: Add props for reordering, deleting components
}

const PageComponentCanvas: React.FC<PageComponentCanvasProps> = ({
  pageId,
  components,
  onSelectComponent,
}) => {
  // TODO: Implement fetching components for the pageId
  // TODO: Implement rendering of components based on their type, content, and styles
  // TODO: Implement drag and drop for reordering components
  // TODO: Implement click to select a component for editing

  if (!components || components.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">
          Your page is empty. Drag components from the library to start
          building.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Canvas for Page: {pageId}
      </h2>
      {components.map((component) => (
        <div
          key={component.id}
          className="p-4 border border-gray-200 rounded-md hover:shadow-lg cursor-pointer transition-shadow bg-slate-50"
          onClick={() => onSelectComponent(component)}
        >
          <p className="font-medium text-sm text-gray-800">
            Type: {component.type}
          </p>
          <p className="text-xs text-gray-600 mt-1">Order: {component.order}</p>
          <pre className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
            {JSON.stringify(component.content, null, 2)}
          </pre>
          {component.styles && (
            <pre className="text-xs text-gray-500 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
              {JSON.stringify(component.styles, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default PageComponentCanvas;
