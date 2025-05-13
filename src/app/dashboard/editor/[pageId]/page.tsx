"use client";

import React, { useState, useEffect } from 'react';
import PageComponentCanvas from '@/app/components/editor/PageComponentCanvas';
import ComponentLibraryPanel from '@/app/components/editor/ComponentLibraryPanel';
import PropertiesInspectorPanel from '@/app/components/editor/PropertiesInspectorPanel';
import { PageComponent, TextComponentContent } from '@/types/pageComponents'; // Import the new types
import { ComponentType } from '@prisma/client';

interface PageEditorProps {
  params: {
    pageId: string;
  };
}

// Mock data for initial setup
const mockComponents: PageComponent[] = [
  {
    id: 'comp1',
    pageId: 'mockPage',
    type: ComponentType.TEXT,
    order: 1,
    content: { textValue: 'Welcome to your page!' } as TextComponentContent,
    styles: { textAlign: 'center', fontSize: '24px' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'comp2',
    pageId: 'mockPage',
    type: ComponentType.LINK,
    order: 2,
    content: { displayText: 'My Portfolio', url: 'https://example.com' },
    styles: { backgroundColor: '#007bff', textColor: '#ffffff' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function PageEditor({ params }: PageEditorProps) {
  const { pageId } = params;
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch components for pageId
    console.log(`Fetching components for page: ${pageId}`);
    // Simulate API call
    setComponents(mockComponents.map(c => ({...c, pageId }))); // Assign current pageId to mock components
  }, [pageId]);

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar placeholder (e.g., for page title, save button, preview toggle) */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Page Editor: {pageId}</h1>
          <div>
            {/* Add buttons like Save, Preview, etc. here */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Library Panel (Left Sidebar) */}
        <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto shadow">
          <ComponentLibraryPanel onSelectComponentType={(type) => console.log("Add component:", type)} />
        </aside>

        {/* Page Component Canvas (Main Area) */}
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          <PageComponentCanvas
            pageId={pageId}
            components={components} // Pass the fetched/mocked components
            onSelectComponent={setSelectedComponent}
          />
        </main>

        {/* Properties Inspector Panel (Right Sidebar) */}
        <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto shadow">
          <PropertiesInspectorPanel
            selectedComponent={selectedComponent} // Pass the selected component
            onUpdateComponent={(updatedData) => {
              console.log("Update component:", updatedData);
              // TODO: Implement actual update logic (API call and local state update)
              if (selectedComponent) {
                setComponents(prev => prev.map(c => c.id === selectedComponent.id ? {...c, ...updatedData} : c));
                setSelectedComponent(null); // Deselect after update or keep selected based on UX preference
              }
            }}
          />
        </aside>
      </div>
    </div>
  );
}
