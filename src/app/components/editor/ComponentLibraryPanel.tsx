"use client";

import React from "react";
import { ComponentType } from "@prisma/client"; // Assuming ComponentType enum is available

interface ComponentLibraryPanelProps {
  onSelectComponentType: (type: ComponentType) => void;
  // TODO: Add more props as needed, e.g., for filtering components
}

// Placeholder for available component types
// In a real app, this might come from a configuration or be dynamically generated
const availableComponentTypes: {
  type: ComponentType;
  name: string;
  description: string;
  icon?: string;
}[] = [
  {
    type: ComponentType.TEXT,
    name: "Text Block",
    description: "Add paragraphs of text.",
  },
  {
    type: ComponentType.LINK,
    name: "Link Button",
    description: "Add a customizable link button.",
  },
  {
    type: ComponentType.IMAGE,
    name: "Image",
    description: "Upload and display an image.",
  },
  { type: ComponentType.VIDEO, name: "Video", description: "Embed a video." },
  {
    type: ComponentType.SOCIALS,
    name: "Social Icons",
    description: "Display social media profile links.",
  },
  // Add more component types as they are developed
];

const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
  onSelectComponentType,
}) => {
  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Component Library
      </h3>
      <div className="space-y-2">
        {availableComponentTypes.map((comp) => (
          <button
            key={comp.type}
            onClick={() => onSelectComponentType(comp.type)}
            className="w-full p-3 text-left bg-white rounded-md shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          >
            <p className="font-medium text-sm text-gray-800">{comp.name}</p>
            <p className="text-xs text-gray-500 mt-1">{comp.description}</p>
          </button>
        ))}
      </div>
      {/* TODO: Add search/filter functionality for components */}
    </div>
  );
};

export default ComponentLibraryPanel;
