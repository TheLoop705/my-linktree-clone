"use client";

import React, { useState } from "react";
import {
  BaseComponent,
  ComponentType,
  ComponentContent,
  ComponentStyles,
} from "@/types/pageComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Type, Palette, Layout, Settings, Eye, EyeOff } from "lucide-react";
import {
  COLOR_PALETTE,
  SPACING_OPTIONS,
  FONT_SIZES,
} from "@/config/componentTemplates";

interface PropertiesPanelProps {
  selectedComponent: BaseComponent | null;
  onUpdateComponent: (
    componentId: string,
    updates: Partial<BaseComponent>
  ) => void;
  onDeselectComponent: () => void;
}

export function PropertiesPanel({
  selectedComponent,
  onUpdateComponent,
  onDeselectComponent,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "spacing">(
    "content"
  );

  if (!selectedComponent) {
    return (
      <div className="h-full bg-white border-l border-gray-200 lg:border-l-0 lg:border-t flex items-center justify-center">
        <div className="text-center text-gray-500 p-6">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
          <p className="text-sm">
            Select a component on the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }
  const updateContent = (updates: Partial<ComponentContent>) => {
    onUpdateComponent(selectedComponent.id, {
      content: { ...selectedComponent.content, ...updates } as ComponentContent,
    });
  };

  const updateStyles = (updates: Partial<ComponentStyles>) => {
    onUpdateComponent(selectedComponent.id, {
      styles: { ...selectedComponent.styles, ...updates },
    });
  };

  const tabs = [
    { id: "content", label: "Content", icon: Type },
    { id: "style", label: "Style", icon: Palette },
    { id: "spacing", label: "Spacing", icon: Layout },
  ];

  return (
    <div className="h-full bg-white border-l border-gray-200 lg:border-l-0 lg:border-t flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Properties</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{selectedComponent.type}</Badge>
              <span className="text-xs text-gray-500">
                #{selectedComponent.id.slice(-6)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectComponent}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "content" && (
          <ContentPanel
            component={selectedComponent}
            onUpdateContent={updateContent}
          />
        )}
        {activeTab === "style" && (
          <StylePanel
            component={selectedComponent}
            onUpdateStyles={updateStyles}
          />
        )}
        {activeTab === "spacing" && (
          <SpacingPanel
            component={selectedComponent}
            onUpdateStyles={updateStyles}
          />
        )}
      </div>
    </div>
  );
}

// Content Panel for different component types
function ContentPanel({
  component,
  onUpdateContent,
}: {
  component: BaseComponent;
  onUpdateContent: (updates: Partial<ComponentContent>) => void;
}) {
  const renderContentFields = () => {
    switch (component.type) {
      case ComponentType.TEXT:
        return (
          <TextContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.HEADER:
        return (
          <HeaderContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.IMAGE:
        return (
          <ImageContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.LINK:
        return (
          <LinkContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.BUTTON:
        return (
          <ButtonContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.VIDEO:
        return (
          <VideoContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.SPACER:
        return (
          <SpacerContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      case ComponentType.DIVIDER:
        return (
          <DividerContentFields
            content={component.content as any}
            onUpdate={onUpdateContent}
          />
        );
      default:
        return (
          <div className="p-4 text-sm text-gray-500">
            No content options for this component type.
          </div>
        );
    }
  };

  return <div className="p-4">{renderContentFields()}</div>;
}

// Individual content field components
function TextContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          value={content.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter your text..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="alignment">Alignment</Label>
        <select
          id="alignment"
          value={content.alignment || "left"}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <Label htmlFor="fontSize">Font Size</Label>
        <select
          id="fontSize"
          value={content.fontSize || "md"}
          onChange={(e) => onUpdate({ fontSize: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
          <option value="2xl">2X Large</option>
        </select>
      </div>

      <div>
        <Label htmlFor="fontWeight">Font Weight</Label>
        <select
          id="fontWeight"
          value={content.fontWeight || "normal"}
          onChange={(e) => onUpdate({ fontWeight: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semibold</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div>
        <Label htmlFor="color">Text Color</Label>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ color })}
              className={`w-8 h-8 rounded-full border-2 ${
                content.color === color ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Header Text</Label>
        <Input
          id="text"
          value={content.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter header text..."
        />
      </div>

      <div>
        <Label htmlFor="level">Header Level</Label>
        <select
          id="level"
          value={content.level || 2}
          onChange={(e) => onUpdate({ level: parseInt(e.target.value) })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>H1 - Largest</option>
          <option value={2}>H2 - Large</option>
          <option value={3}>H3 - Medium</option>
          <option value={4}>H4 - Small</option>
          <option value={5}>H5 - Smaller</option>
          <option value={6}>H6 - Smallest</option>
        </select>
      </div>

      <div>
        <Label htmlFor="alignment">Alignment</Label>
        <select
          id="alignment"
          value={content.alignment || "center"}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <Label htmlFor="color">Text Color</Label>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ color })}
              className={`w-8 h-8 rounded-full border-2 ${
                content.color === color ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="src">Image URL</Label>
        <Input
          id="src"
          value={content.src || ""}
          onChange={(e) => onUpdate({ src: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="alt">Alt Text</Label>
        <Input
          id="alt"
          value={content.alt || ""}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          placeholder="Describe the image..."
        />
      </div>

      <div>
        <Label htmlFor="borderRadius">Border Radius</Label>
        <select
          id="borderRadius"
          value={content.borderRadius || "md"}
          onChange={(e) => onUpdate({ borderRadius: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="full">Round</option>
        </select>
      </div>

      <div>
        <Label htmlFor="objectFit">Object Fit</Label>
        <select
          id="objectFit"
          value={content.objectFit || "cover"}
          onChange={(e) => onUpdate({ objectFit: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
        </select>
      </div>
    </div>
  );
}

function LinkContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Link Title</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Link title..."
        />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={content.url || ""}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={content.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Link description..."
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="openInNewTab"
          checked={content.openInNewTab || false}
          onChange={(e) => onUpdate({ openInNewTab: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="openInNewTab">Open in new tab</Label>
      </div>
    </div>
  );
}

function ButtonContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Button Text</Label>
        <Input
          id="text"
          value={content.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Button text..."
        />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={content.url || ""}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label htmlFor="variant">Button Style</Label>
        <select
          id="variant"
          value={content.variant || "primary"}
          onChange={(e) => onUpdate({ variant: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="ghost">Ghost</option>
          <option value="destructive">Destructive</option>
        </select>
      </div>

      <div>
        <Label htmlFor="size">Button Size</Label>
        <select
          id="size"
          value={content.size || "md"}
          onChange={(e) => onUpdate({ size: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="fullWidth"
          checked={content.fullWidth || false}
          onChange={(e) => onUpdate({ fullWidth: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="fullWidth">Full width</Label>
      </div>
    </div>
  );
}

function VideoContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url">Video URL</Label>
        <Input
          id="url"
          value={content.url || ""}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="YouTube, Vimeo, or direct video URL"
        />
      </div>

      <div>
        <Label htmlFor="title">Title (Optional)</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Video title..."
        />
      </div>

      <div>
        <Label htmlFor="provider">Provider</Label>
        <select
          id="provider"
          value={content.provider || "youtube"}
          onChange={(e) => onUpdate({ provider: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="direct">Direct Link</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="controls"
          checked={content.controls !== false}
          onChange={(e) => onUpdate({ controls: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="controls">Show controls</Label>
      </div>
    </div>
  );
}

function SpacerContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="height">Height</Label>
        <select
          id="height"
          value={content.height || "2rem"}
          onChange={(e) => onUpdate({ height: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SPACING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.value})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function DividerContentFields({
  content,
  onUpdate,
}: {
  content: any;
  onUpdate: (updates: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="style">Line Style</Label>
        <select
          id="style"
          value={content.style || "solid"}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>

      <div>
        <Label htmlFor="thickness">Thickness</Label>
        <select
          id="thickness"
          value={content.thickness || "1px"}
          onChange={(e) => onUpdate({ thickness: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1px">Thin (1px)</option>
          <option value="2px">Medium (2px)</option>
          <option value="3px">Thick (3px)</option>
          <option value="4px">Extra Thick (4px)</option>
        </select>
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ color })}
              className={`w-8 h-8 rounded-full border-2 ${
                content.color === color ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Style Panel Component
function StylePanel({
  component,
  onUpdateStyles,
}: {
  component: BaseComponent;
  onUpdateStyles: (updates: Partial<ComponentStyles>) => void;
}) {
  const styles = component.styles || {};

  return (
    <div className="p-4 space-y-6">
      <div>
        <Label>Background Color</Label>
        <div className="mt-2 grid grid-cols-8 gap-2">
          <button
            onClick={() => onUpdateStyles({ backgroundColor: undefined })}
            className={`w-8 h-8 rounded-full border-2 ${
              !styles.backgroundColor ? "border-blue-500" : "border-gray-300"
            } bg-white relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-200 rounded-full" />
          </button>
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => onUpdateStyles({ backgroundColor: color })}
              className={`w-8 h-8 rounded-full border-2 ${
                styles.backgroundColor === color
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="borderRadius">Border Radius</Label>
        <select
          id="borderRadius"
          value={styles.borderRadius || ""}
          onChange={(e) =>
            onUpdateStyles({ borderRadius: e.target.value || undefined })
          }
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">None</option>
          <option value="0.125rem">Small</option>
          <option value="0.375rem">Medium</option>
          <option value="0.5rem">Large</option>
          <option value="9999px">Full</option>
        </select>
      </div>

      <div>
        <Label htmlFor="boxShadow">Shadow</Label>
        <select
          id="boxShadow"
          value={styles.boxShadow || ""}
          onChange={(e) =>
            onUpdateStyles({ boxShadow: e.target.value || undefined })
          }
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">None</option>
          <option value="0 1px 3px 0 rgba(0, 0, 0, 0.1)">Small</option>
          <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium</option>
          <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Large</option>
          <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">
            Extra Large
          </option>
        </select>
      </div>
    </div>
  );
}

// Spacing Panel Component
function SpacingPanel({
  component,
  onUpdateStyles,
}: {
  component: BaseComponent;
  onUpdateStyles: (updates: Partial<ComponentStyles>) => void;
}) {
  const styles = component.styles || {};
  const margin = styles.margin || {};
  const padding = styles.padding || {};

  const updateMargin = (side: string, value: string) => {
    onUpdateStyles({
      margin: {
        ...margin,
        [side]: value || undefined,
      },
    });
  };

  const updatePadding = (side: string, value: string) => {
    onUpdateStyles({
      padding: {
        ...padding,
        [side]: value || undefined,
      },
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Margin (External Spacing)</h4>
        <div className="grid grid-cols-2 gap-4">
          {["top", "bottom", "left", "right"].map((side) => (
            <div key={side}>
              <Label htmlFor={`margin-${side}`} className="text-xs">
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </Label>
              <select
                id={`margin-${side}`}
                value={(margin as any)[side] || ""}
                onChange={(e) => updateMargin(side, e.target.value)}
                className="w-full mt-1 p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {SPACING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Padding (Internal Spacing)</h4>
        <div className="grid grid-cols-2 gap-4">
          {["top", "bottom", "left", "right"].map((side) => (
            <div key={side}>
              <Label htmlFor={`padding-${side}`} className="text-xs">
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </Label>
              <select
                id={`padding-${side}`}
                value={(padding as any)[side] || ""}
                onChange={(e) => updatePadding(side, e.target.value)}
                className="w-full mt-1 p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {SPACING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
