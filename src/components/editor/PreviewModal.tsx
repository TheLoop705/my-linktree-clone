"use client";

import React, { useState, useEffect } from "react";
import { BaseComponent } from "@/types/pageComponents";
import { ComponentRenderer } from "./ComponentRenderer";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Monitor, ExternalLink } from "lucide-react";

interface PreviewModalProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
  previewMode: "mobile" | "desktop";
}

export function PreviewModal({
  pageId,
  isOpen,
  onClose,
  previewMode: initialPreviewMode,
}: PreviewModalProps) {
  const [components, setComponents] = useState<BaseComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    initialPreviewMode
  );

  useEffect(() => {
    if (isOpen) {
      loadComponents();
    }
  }, [isOpen, pageId]);

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
        createdAt: new Date(comp.createdAt),
        updatedAt: new Date(comp.updatedAt),
      }));

      setComponents(parsedComponents);
    } catch (error) {
      console.error("Error loading components:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openInNewTab = () => {
    // This would open the actual public page URL
    window.open(`/p/${pageId}`, "_blank");
  };

  if (!isOpen) return null;

  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Preview</h2>

            {/* Preview Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={previewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className="px-3"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
              <Button
                variant={previewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className="px-3"
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={openInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading preview...</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto flex items-start justify-center p-4">
              {/* Mobile Frame */}
              {previewMode === "mobile" ? (
                <div className="relative">
                  {/* Mobile Device Frame */}
                  <div
                    className="bg-black rounded-3xl p-2 shadow-2xl"
                    style={{ width: "390px", height: "844px" }}
                  >
                    {/* Screen */}
                    <div className="bg-white rounded-2xl h-full overflow-hidden flex flex-col">
                      {/* Status Bar */}
                      <div className="bg-white h-6 flex items-center justify-center relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-20 h-1 bg-black rounded-full"></div>
                      </div>

                      {/* Page Content */}
                      <div className="flex-1 overflow-auto">
                        <PreviewContent components={sortedComponents} />
                      </div>

                      {/* Home Indicator */}
                      <div className="h-8 flex items-center justify-center">
                        <div className="w-32 h-1 bg-black rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Frame */
                <div className="w-full max-w-4xl">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Browser Bar */}
                    <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-500">
                        https://yourdomain.com/p/{pageId}
                      </div>
                    </div>

                    {/* Page Content */}
                    <div className="min-h-[600px] max-h-[600px] overflow-auto">
                      <PreviewContent components={sortedComponents} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {components.length} component{components.length !== 1 ? "s" : ""}{" "}
              • Preview updated in real-time
            </div>
            <div className="flex items-center space-x-4">
              <span>
                Resolution: {previewMode === "mobile" ? "375×812" : "1024×768"}
              </span>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to render the actual page content
function PreviewContent({ components }: { components: BaseComponent[] }) {
  if (components.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">Empty Page</h3>
          <p className="text-sm">Add some components to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {components.map((component) => (
        <div key={component.id} className="transition-all duration-200">
          <ComponentRenderer
            component={component}
            isSelected={false}
            isPreview={true}
          />
        </div>
      ))}
    </div>
  );
}
