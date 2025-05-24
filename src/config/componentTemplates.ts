import {
  ComponentType,
  ComponentTemplate,
  TextContent,
  ImageContent,
  LinkContent,
  HeaderContent,
  ButtonContent,
  VideoContent,
  IconContent,
  SocialsContent,
  SpacerContent,
  DividerContent,
} from "@/types/pageComponents";

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // Content Components
  {
    type: ComponentType.TEXT,
    name: "Text",
    description: "Add text content with formatting options",
    icon: "Type",
    category: "content",
    defaultContent: {
      text: "Your text here...",
      alignment: "left",
      fontSize: "md",
      fontWeight: "normal",
    } as TextContent,
    defaultStyles: {
      margin: { top: "0.5rem", bottom: "0.5rem" },
      padding: { top: "0.5rem", bottom: "0.5rem" },
    },
  },
  {
    type: ComponentType.HEADER,
    name: "Header",
    description: "Add a heading with different sizes",
    icon: "Heading",
    category: "content",
    defaultContent: {
      text: "Your Heading",
      level: 2,
      alignment: "center",
    } as HeaderContent,
    defaultStyles: {
      margin: { top: "1rem", bottom: "1rem" },
    },
  },

  // Media Components
  {
    type: ComponentType.IMAGE,
    name: "Image",
    description: "Add images with customizable styling",
    icon: "Image",
    category: "media",
    defaultContent: {
      src: "https://via.placeholder.com/400x200?text=Your+Image",
      alt: "Image description",
      width: "100%",
      objectFit: "cover",
      borderRadius: "md",
    } as ImageContent,
    defaultStyles: {
      margin: { top: "0.5rem", bottom: "0.5rem" },
    },
  },
  {
    type: ComponentType.VIDEO,
    name: "Video",
    description: "Embed videos from YouTube, Vimeo, or direct links",
    icon: "Video",
    category: "media",
    defaultContent: {
      url: "",
      title: "Video Title",
      controls: true,
      provider: "youtube",
    } as VideoContent,
    defaultStyles: {
      margin: { top: "0.5rem", bottom: "0.5rem" },
    },
  },
  {
    type: ComponentType.ICON,
    name: "Icon",
    description: "Add decorative or functional icons",
    icon: "Star",
    category: "media",
    defaultContent: {
      iconName: "Star",
      iconLibrary: "lucide",
      size: "lg",
      color: "#3b82f6",
    } as IconContent,
    defaultStyles: {
      margin: { top: "0.5rem", bottom: "0.5rem" },
    },
  },

  // Interactive Components
  {
    type: ComponentType.LINK,
    name: "Link",
    description: "Create clickable links with custom styling",
    icon: "Link",
    category: "interactive",
    defaultContent: {
      title: "My Link",
      url: "https://example.com",
      description: "Link description",
      openInNewTab: true,
      buttonStyle: "filled",
    } as LinkContent,
    defaultStyles: {
      margin: { top: "0.5rem", bottom: "0.5rem" },
    },
  },
  {
    type: ComponentType.BUTTON,
    name: "Button",
    description: "Add call-to-action buttons",
    icon: "MousePointer",
    category: "interactive",
    defaultContent: {
      text: "Click Me",
      url: "https://example.com",
      variant: "primary",
      size: "md",
      fullWidth: true,
    } as ButtonContent,
    defaultStyles: {
      margin: { top: "0.5rem", bottom: "0.5rem" },
    },
  },
  {
    type: ComponentType.SOCIALS,
    name: "Social Links",
    description: "Add social media platform links",
    icon: "Share2",
    category: "interactive",
    defaultContent: {
      platforms: [
        { platform: "twitter", url: "https://twitter.com/yourusername" },
        { platform: "instagram", url: "https://instagram.com/yourusername" },
        { platform: "github", url: "https://github.com/yourusername" },
      ],
      layout: "horizontal",
      iconSize: "md",
    } as SocialsContent,
    defaultStyles: {
      margin: { top: "1rem", bottom: "1rem" },
    },
  },

  // Layout Components
  {
    type: ComponentType.SPACER,
    name: "Spacer",
    description: "Add vertical spacing between components",
    icon: "Move",
    category: "layout",
    defaultContent: {
      height: "2rem",
    } as SpacerContent,
  },
  {
    type: ComponentType.DIVIDER,
    name: "Divider",
    description: "Add visual separation between sections",
    icon: "Minus",
    category: "layout",
    defaultContent: {
      style: "solid",
      color: "#e5e7eb",
      thickness: "1px",
      width: "100%",
    } as DividerContent,
    defaultStyles: {
      margin: { top: "1rem", bottom: "1rem" },
    },
  },
];

export const COMPONENT_CATEGORIES = [
  {
    id: "content",
    name: "Content",
    description: "Text and content components",
    icon: "FileText",
  },
  {
    id: "media",
    name: "Media",
    description: "Images, videos, and visual elements",
    icon: "Image",
  },
  {
    id: "interactive",
    name: "Interactive",
    description: "Links, buttons, and clickable elements",
    icon: "MousePointer",
  },
  {
    id: "layout",
    name: "Layout",
    description: "Spacing and structural elements",
    icon: "Layout",
  },
] as const;

export const MOBILE_BREAKPOINTS = {
  mobile: "320px",
  tablet: "768px",
  desktop: "1024px",
} as const;

export const FONT_SIZES = {
  sm: { mobile: "14px", tablet: "14px", desktop: "14px" },
  md: { mobile: "16px", tablet: "16px", desktop: "16px" },
  lg: { mobile: "18px", tablet: "20px", desktop: "20px" },
  xl: { mobile: "20px", tablet: "24px", desktop: "24px" },
  "2xl": { mobile: "24px", tablet: "30px", desktop: "30px" },
} as const;

export const SPACING_OPTIONS = [
  { label: "None", value: "0" },
  { label: "XS", value: "0.25rem" },
  { label: "SM", value: "0.5rem" },
  { label: "MD", value: "1rem" },
  { label: "LG", value: "1.5rem" },
  { label: "XL", value: "2rem" },
  { label: "2XL", value: "3rem" },
] as const;

export const COLOR_PALETTE = [
  "#000000",
  "#ffffff",
  "#f3f4f6",
  "#e5e7eb",
  "#9ca3af",
  "#6b7280",
  "#374151",
  "#1f2937",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
] as const;
