// Page Component Types for LinkHub Editor
export enum ComponentType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  ICON = "ICON",
  LINK = "LINK",
  HEADER = "HEADER",
  BUTTON = "BUTTON",
  SOCIALS = "SOCIALS",
  SPACER = "SPACER",
  DIVIDER = "DIVIDER",
  EMBED = "EMBED",
}

// Base component interface
export interface BaseComponent {
  id: string;
  pageId: string;
  type: ComponentType;
  order: number;
  content: ComponentContent;
  styles?: ComponentStyles;
  createdAt: Date;
  updatedAt: Date;
}

// Content types for different components
export interface TextContent {
  text: string;
  alignment?: "left" | "center" | "right";
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  color?: string;
}

export interface ImageContent {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
}

export interface VideoContent {
  url: string;
  thumbnail?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  provider?: "youtube" | "vimeo" | "direct";
}

export interface IconContent {
  iconName: string;
  iconLibrary?: "lucide" | "heroicons" | "feather";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
}

export interface LinkContent {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  openInNewTab?: boolean;
  buttonStyle?: "filled" | "outlined" | "minimal";
}

export interface HeaderContent {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: "left" | "center" | "right";
  color?: string;
}

export interface ButtonContent {
  text: string;
  url: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: string;
}

export interface SocialsContent {
  platforms: Array<{
    platform: string;
    url: string;
    username?: string;
  }>;
  layout?: "horizontal" | "vertical" | "grid";
  iconSize?: "sm" | "md" | "lg";
}

export interface SpacerContent {
  height: string;
}

export interface DividerContent {
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  thickness?: string;
  width?: string;
}

export interface EmbedContent {
  embedCode: string;
  provider?: string;
  height?: string;
}

// Union type for all content types
export type ComponentContent =
  | TextContent
  | ImageContent
  | VideoContent
  | IconContent
  | LinkContent
  | HeaderContent
  | ButtonContent
  | SocialsContent
  | SpacerContent
  | DividerContent
  | EmbedContent;

// Styles interface for component customization
export interface ComponentStyles {
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  padding?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  animation?: string;
  customClasses?: string;
  mobileStyles?: {
    [key: string]: string;
  };
}

// Component template for adding new components
export interface ComponentTemplate {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  category: "content" | "media" | "interactive" | "layout";
  defaultContent: ComponentContent;
  defaultStyles?: ComponentStyles;
}

// Editor state interfaces
export interface EditorState {
  selectedComponentId: string | null;
  isDragging: boolean;
  draggedComponentId: string | null;
  previewMode: "mobile" | "tablet" | "desktop";
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

export interface DragDropResult {
  sourceIndex: number;
  destinationIndex: number;
  componentId: string;
}

// API interfaces
export interface CreateComponentRequest {
  pageId: string;
  type: ComponentType;
  content: ComponentContent;
  styles?: ComponentStyles;
  order?: number;
}

export interface UpdateComponentRequest {
  content?: ComponentContent;
  styles?: ComponentStyles;
  order?: number;
}

export interface ReorderComponentsRequest {
  pageId: string;
  componentOrders: Array<{
    componentId: string;
    order: number;
  }>;
}
