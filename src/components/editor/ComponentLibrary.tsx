"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search } from "lucide-react";
import { ComponentTemplate } from "@/types/pageComponents";
import {
  COMPONENT_TEMPLATES,
  COMPONENT_CATEGORIES,
} from "@/config/componentTemplates";

interface ComponentLibraryProps {
  onAddComponent: (template: ComponentTemplate) => void;
  isMobile?: boolean;
}

export function ComponentLibrary({
  onAddComponent,
  isMobile = false,
}: ComponentLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = COMPONENT_TEMPLATES.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddComponent = (template: ComponentTemplate) => {
    onAddComponent(template);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile FAB version
  if (isMobile) {
    return (
      <>
        {/* Floating Action Button */}
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Mobile Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
            <div className="w-full bg-white rounded-t-xl max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Add Component</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="p-4 border-b space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </Button>
                  {COMPONENT_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Component Grid */}
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.type}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAddComponent(template)}
                    >
                      <CardContent className="p-3">
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {getIconForTemplate(template)}
                          </div>
                          <h3 className="font-medium text-sm">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar version
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Components</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setSelectedCategory("all")}
          >
            All Components
          </Button>
          {COMPONENT_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredTemplates.map((template) => (
            <Card
              key={template.type}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAddComponent(template)}
            >
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <div className="text-xl">{getIconForTemplate(template)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {template.description}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get appropriate icon for each template
function getIconForTemplate(template: ComponentTemplate): string {
  const iconMap: Record<string, string> = {
    TEXT: "📝",
    IMAGE: "🖼️",
    VIDEO: "🎥",
    ICON: "⭐",
    LINK: "🔗",
    HEADER: "📋",
    BUTTON: "🔘",
    SOCIALS: "📱",
    SPACER: "⬜",
    DIVIDER: "➖",
    EMBED: "🔗",
  };

  return iconMap[template.type] || "📦";
}
