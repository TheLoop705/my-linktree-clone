// Component types as string constants (since SQLite doesn't support enums)
export const ComponentType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  ICON: "ICON",
  LINK: "LINK",
  HEADER: "HEADER",
  BUTTON: "BUTTON",
  SOCIALS: "SOCIALS",
  SPACER: "SPACER",
  DIVIDER: "DIVIDER",
  EMBED: "EMBED",
} as const;

export type ComponentType = (typeof ComponentType)[keyof typeof ComponentType];

// Defines the structure for a PageComponent on the frontend
export interface PageComponent {
  id: string;
  pageId: string;
  type: ComponentType;
  order: number;
  content: any; // Will be parsed JSON from the string field
  styles?: any | null; // Will be parsed JSON from the string field
  createdAt: Date;
  updatedAt: Date;
}

// Example of how you might define specific content structures for different component types
// This can be expanded as you define more components

export interface TextComponentContent {
  textValue: string;
  alignment?: "left" | "center" | "right";
}

export interface ImageComponentContent {
  imageUrl: string;
  altText?: string;
  caption?: string;
  linkUrl?: string;
}

export interface VideoComponentContent {
  videoUrl: string; // e.g., YouTube embed URL
  caption?: string;
}

export interface LinkComponentContent {
  url: string;
  title?: string;
  displayText: string;
  icon?: string; // e.g., name of an icon or URL to an icon image
}

export interface SocialsComponentContent {
  platform: string; // e.g., 'twitter', 'facebook', 'instagram'
  profileUrl: string;
  displayText?: string;
}

// Example of how you might define specific style structures
export interface ComponentStyles {
  gridColumnSpan?: number;
  gridRowSpan?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: "normal" | "bold" | "semibold";
  // ... other common style properties
}
