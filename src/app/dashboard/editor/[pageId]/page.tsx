"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Smartphone, Monitor, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Import editor components (to be created)
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { ComponentLibrary } from "@/components/editor/ComponentLibrary";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { PreviewModal } from "@/components/editor/PreviewModal";

// Types
import { BaseComponent, ComponentType } from "@/types/pageComponents";
import { ComponentTemplate } from "@/types/pageComponents";

export default function EditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  const { toast } = useToast();

  // State
  const [components, setComponents] = useState<BaseComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<BaseComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "mobile"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileView, setIsMobileView] = useState(true);

  // Load components on mount
  useEffect(() => {
    loadComponents();
  }, [pageId]);

  const loadComponents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/pages/${pageId}/components`);
      if (!response.ok) throw new Error("Failed to load components");

      const data = await response.json();

      // Parse JSON strings back to objects
      const parsedComponents = data.map((comp: any) => ({
        ...comp,
        content:
          typeof comp.content === "string"
            ? JSON.parse(comp.content)
            : comp.content,
        styles:
          comp.styles && typeof comp.styles === "string"
            ? JSON.parse(comp.styles)
            : comp.styles,
      }));

      setComponents(parsedComponents);
    } catch (error) {
      console.error("Error loading components:", error);
      toast({
        title: "Error",
        description: "Failed to load page components",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addComponent = async (template: ComponentTemplate) => {
    try {
      const response = await fetch(`/api/pages/${pageId}/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: template.type,
          content: template.defaultContent,
          styles: template.defaultStyles,
        }),
      });

      if (!response.ok) throw new Error("Failed to add component");

      const newComponent = await response.json();

      // Parse the JSON strings
      const parsedComponent = {
        ...newComponent,
        content:
          typeof newComponent.content === "string"
            ? JSON.parse(newComponent.content)
            : newComponent.content,
        styles:
          newComponent.styles && typeof newComponent.styles === "string"
            ? JSON.parse(newComponent.styles)
            : newComponent.styles,
      };

      setComponents([...components, parsedComponent]);
      setSelectedComponent(parsedComponent);

      toast({
        title: "Success",
        description: `${template.name} component added`,
      });
    } catch (error) {
      console.error("Error adding component:", error);
      toast({
        title: "Error",
        description: "Failed to add component",
        variant: "destructive",
      });
    }
  };

  const updateComponent = async (
    componentId: string,
    updates: Partial<BaseComponent>
  ) => {
    try {
      const response = await fetch(
        `/api/pages/${pageId}/components/${componentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error("Failed to update component");

      const updatedComponent = await response.json();

      // Parse JSON strings
      const parsedComponent = {
        ...updatedComponent,
        content:
          typeof updatedComponent.content === "string"
            ? JSON.parse(updatedComponent.content)
            : updatedComponent.content,
        styles:
          updatedComponent.styles && typeof updatedComponent.styles === "string"
            ? JSON.parse(updatedComponent.styles)
            : updatedComponent.styles,
      };

      setComponents(
        components.map((comp) =>
          comp.id === componentId ? parsedComponent : comp
        )
      );
      setSelectedComponent(parsedComponent);
    } catch (error) {
      console.error("Error updating component:", error);
      toast({
        title: "Error",
        description: "Failed to update component",
        variant: "destructive",
      });
    }
  };

  const deleteComponent = async (componentId: string) => {
    try {
      const response = await fetch(
        `/api/pages/${pageId}/components/${componentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete component");

      setComponents(components.filter((comp) => comp.id !== componentId));
      setSelectedComponent(null);

      toast({
        title: "Success",
        description: "Component deleted",
      });
    } catch (error) {
      console.error("Error deleting component:", error);
      toast({
        title: "Error",
        description: "Failed to delete component",
        variant: "destructive",
      });
    }
  };

  const reorderComponents = async (newOrder: string[]) => {
    try {
      const response = await fetch(`/api/pages/${pageId}/components/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentIds: newOrder }),
      });

      if (!response.ok) throw new Error("Failed to reorder components");

      // Update local state to reflect new order
      const reorderedComponents = newOrder.map((id, index) => {
        const component = components.find((c) => c.id === id)!;
        return { ...component, order: index + 1 };
      });

      setComponents(reorderedComponents);
    } catch (error) {
      console.error("Error reordering components:", error);
      toast({
        title: "Error",
        description: "Failed to reorder components",
        variant: "destructive",
      });
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    // Components are saved automatically on each change
    // This is just for user feedback
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Success",
        description: "All changes saved",
      });
    }, 500);
  };

  // Choose appropriate DnD backend
  const dndBackend = isMobile ? TouchBackend : HTML5Backend;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">Page Editor</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPreviewMode(
                    previewMode === "mobile" ? "desktop" : "mobile"
                  )
                }
              >
                {previewMode === "mobile" ? (
                  <Smartphone className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={saveChanges} disabled={isSaving}>
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Page Editor</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveChanges} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Layout */}
        <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
          {/* Component Library - Hidden on mobile, shown in modal */}
          <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <ComponentLibrary onAddComponent={addComponent} />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Main Canvas */}
            <div className="flex-1 bg-gray-100 overflow-auto">
              <EditorCanvas
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                onReorderComponents={reorderComponents}
                onDeleteComponent={deleteComponent}
                previewMode={previewMode}
              />
            </div>

            {/* Properties Panel - Bottom on mobile, right on desktop */}
            <div
              className={`${
                selectedComponent ? "block" : "hidden lg:block"
              } w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 ${
                selectedComponent ? "h-1/2 lg:h-full" : "h-0 lg:h-full"
              } overflow-y-auto`}
            >
              <PropertiesPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={updateComponent}
                onDeselectComponent={() => setSelectedComponent(null)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Component Library FAB */}
        <div className="lg:hidden fixed bottom-6 right-6">
          <ComponentLibrary onAddComponent={addComponent} isMobile={true} />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            pageId={pageId}
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            previewMode={previewMode}
          />
        )}
      </div>
    </DndProvider>
  );
}
