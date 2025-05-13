"use client";

import React from 'react';
import { PageComponent } from '@/types/pageComponents'; // Import the PageComponent type

interface PropertiesInspectorPanelProps {
  selectedComponent: PageComponent | null; // Use the PageComponent type
  onUpdateComponent: (updatedData: Partial<PageComponent>) => void; // Allow partial updates
  // TODO: Add props for deleting the component
}

const PropertiesInspectorPanel: React.FC<PropertiesInspectorPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
}) => {
  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select a component on the canvas to edit its properties.</p>
      </div>
    );
  }

  // Handler for changes in the content textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const newContent = JSON.parse(e.target.value);
      onUpdateComponent({ content: newContent });
    } catch (err) {
      // TODO: Provide user feedback for invalid JSON
      console.error("Invalid JSON content", err);
    }
  };

  // Handler for changes in the styles textarea
  const handleStylesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const newStyles = JSON.parse(e.target.value);
      onUpdateComponent({ styles: newStyles });
    } catch (err) {
      // TODO: Provide user feedback for invalid JSON
      console.error("Invalid JSON styles", err);
    }
  };
  
  // Handler for changes in the order input
  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrder = parseInt(e.target.value, 10);
    if (!isNaN(newOrder)) {
      onUpdateComponent({ order: newOrder });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Edit: {selectedComponent.type || 'Component'} (ID: {selectedComponent.id})
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="componentOrder" className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <input
            type="number"
            id="componentOrder"
            name="order"
            value={selectedComponent.order ?? ''} // Use selectedComponent.order
            onChange={handleOrderChange} // Use defined handler
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="componentContent" className="block text-sm font-medium text-gray-700">
            Content (JSON)
          </label>
          <textarea
            id="componentContent"
            name="content"
            rows={6}
            value={JSON.stringify(selectedComponent.content, null, 2) ?? ''} // Use selectedComponent.content
            onChange={handleContentChange} // Use defined handler
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor="componentStyles" className="block text-sm font-medium text-gray-700">
            Styles (JSON)
          </label>
          <textarea
            id="componentStyles"
            name="styles"
            rows={6}
            value={JSON.stringify(selectedComponent.styles, null, 2) ?? ''} // Use selectedComponent.styles
            onChange={handleStylesChange} // Use defined handler
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
          />
        </div>

        {/* TODO: Add more specific input fields based on component type */}
        {/* For example, for a TEXT component, show a simple text input for 'textValue' */}
        {/* For an IMAGE component, show an upload field for 'src' and text input for 'alt' */}

        <button
          onClick={() => {
            // This button is more for a conceptual "Apply" if direct binding isn't fully implemented
            // The actual update is happening onChange of the fields for now
            console.log("Applied changes for:", selectedComponent);
            // Potentially trigger a save to backend here if not done onChange
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow mt-4"
        >
          Apply Changes (Currently updates on field change)
        </button>
      </div>
    </div>
  );
};

export default PropertiesInspectorPanel;
