"use client";

import * as React from "react";
import { BaseComponent, ComponentType } from "@/types/pageComponents";
import {
  TextContent,
  ImageContent,
  VideoContent,
  IconContent,
  LinkContent,
  HeaderContent,
  ButtonContent,
  SocialsContent,
  SpacerContent,
  DividerContent,
  EmbedContent,
} from "@/types/pageComponents";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import Lucide icons
import * as LucideIcons from "lucide-react";

interface ComponentRendererProps {
  component: BaseComponent;
  isSelected?: boolean;
  isPreview?: boolean;
  className?: string;
}

export function ComponentRenderer({
  component,
  isSelected = false,
  isPreview = false,
  className = "",
}: ComponentRendererProps) {
  const baseClasses = `
    relative transition-all duration-200
    ${isSelected && !isPreview ? "ring-2 ring-blue-500 ring-offset-2" : ""}
    ${!isPreview ? "hover:ring-1 hover:ring-gray-300 cursor-pointer" : ""}
    ${className}
  `;

  const renderContent = () => {
    switch (component.type) {
      case ComponentType.TEXT:
        return (
          <TextRenderer
            content={component.content as TextContent}
            styles={component.styles}
          />
        );

      case ComponentType.HEADER:
        return (
          <HeaderRenderer
            content={component.content as HeaderContent}
            styles={component.styles}
          />
        );

      case ComponentType.IMAGE:
        return (
          <ImageRenderer
            content={component.content as ImageContent}
            styles={component.styles}
          />
        );

      case ComponentType.VIDEO:
        return (
          <VideoRenderer
            content={component.content as VideoContent}
            styles={component.styles}
          />
        );

      case ComponentType.ICON:
        return (
          <IconRenderer
            content={component.content as IconContent}
            styles={component.styles}
          />
        );

      case ComponentType.LINK:
        return (
          <LinkRenderer
            content={component.content as LinkContent}
            styles={component.styles}
            isPreview={isPreview}
          />
        );

      case ComponentType.BUTTON:
        return (
          <ButtonRenderer
            content={component.content as ButtonContent}
            styles={component.styles}
            isPreview={isPreview}
          />
        );

      case ComponentType.SOCIALS:
        return (
          <SocialsRenderer
            content={component.content as SocialsContent}
            styles={component.styles}
            isPreview={isPreview}
          />
        );

      case ComponentType.SPACER:
        return (
          <SpacerRenderer
            content={component.content as SpacerContent}
            styles={component.styles}
          />
        );

      case ComponentType.DIVIDER:
        return (
          <DividerRenderer
            content={component.content as DividerContent}
            styles={component.styles}
          />
        );

      case ComponentType.EMBED:
        return (
          <EmbedRenderer
            content={component.content as EmbedContent}
            styles={component.styles}
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded text-gray-500">
            Unknown component type
          </div>
        );
    }
  };

  return (
    <div className={baseClasses} style={getStylesObject(component.styles)}>
      {renderContent()}
    </div>
  );
}

// Individual component renderers
function TextRenderer({
  content,
  styles,
}: {
  content: TextContent;
  styles?: any;
}) {
  const textStyles = {
    textAlign: content.alignment || "left",
    fontSize: getFontSize(content.fontSize || "md"),
    fontWeight: content.fontWeight || "normal",
    color: content.color || "#000000",
  };

  return (
    <div style={textStyles} className="break-words">
      {content.text}
    </div>
  );
}

function HeaderRenderer({
  content,
  styles,
}: {
  content: HeaderContent;
  styles?: any;
}) {
  const Tag = `h${content.level}` as keyof JSX.IntrinsicElements;
  const headerStyles = {
    textAlign: content.alignment || "left",
    color: content.color || "#000000",
    fontSize: getHeaderSize(content.level),
    fontWeight: "bold",
    lineHeight: "1.2",
  };

  return (
    <Tag style={headerStyles} className="break-words">
      {content.text}
    </Tag>
  );
}

function ImageRenderer({
  content,
  styles,
}: {
  content: ImageContent;
  styles?: any;
}) {
  const imageStyles = {
    width: content.width || "100%",
    height: content.height || "auto",
    objectFit: content.objectFit || "cover",
    borderRadius: getBorderRadius(content.borderRadius || "none"),
  };

  return (
    <img
      src={content.src}
      alt={content.alt}
      style={imageStyles}
      className="max-w-full h-auto"
    />
  );
}

function VideoRenderer({
  content,
  styles,
}: {
  content: VideoContent;
  styles?: any;
}) {
  const getEmbedUrl = (url: string, provider?: string) => {
    if (provider === "youtube") {
      const videoId = extractYouTubeId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (provider === "vimeo") {
      const videoId = extractVimeoId(url);
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  if (content.provider === "direct") {
    return (
      <video
        src={content.url}
        controls={content.controls !== false}
        autoPlay={content.autoplay || false}
        className="w-full h-auto rounded"
        style={{ maxWidth: "100%" }}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={getEmbedUrl(content.url, content.provider)}
        title={content.title || "Video"}
        className="absolute top-0 left-0 w-full h-full rounded"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

function IconRenderer({
  content,
  styles,
}: {
  content: IconContent;
  styles?: any;
}) {
  const IconComponent =
    (LucideIcons as any)[content.iconName] || LucideIcons.Star;

  const iconStyles = {
    color: content.color || "#3b82f6",
    width: getIconSize(content.size || "md"),
    height: getIconSize(content.size || "md"),
  };

  return (
    <div className="flex justify-center">
      <IconComponent style={iconStyles} />
    </div>
  );
}

function LinkRenderer({
  content,
  styles,
  isPreview,
}: {
  content: LinkContent;
  styles?: any;
  isPreview: boolean;
}) {
  const linkContent = (
    <Card
      className={`w-full hover:shadow-md transition-shadow ${content.buttonStyle === "minimal" ? "shadow-none border-0" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {content.icon && (
            <div className="text-xl">{getIconForPlatform(content.icon)}</div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{content.title}</h3>
            {content.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {content.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isPreview) {
    return linkContent;
  }

  return (
    <a
      href={content.url}
      target={content.openInNewTab ? "_blank" : "_self"}
      rel={content.openInNewTab ? "noopener noreferrer" : undefined}
      className="block w-full no-underline"
    >
      {linkContent}
    </a>
  );
}

function ButtonRenderer({
  content,
  styles,
  isPreview,
}: {
  content: ButtonContent;
  styles?: any;
  isPreview: boolean;
}) {
  const buttonContent = (
    <Button
      variant={
        content.variant === "primary" ? "default" : content.variant || "default"
      }
      size={content.size === "md" ? "default" : content.size || "default"}
      className={content.fullWidth ? "w-full" : "inline-flex"}
      disabled={!isPreview}
    >
      {content.icon && (
        <span className="mr-2">{getIconForPlatform(content.icon)}</span>
      )}
      {content.text}
    </Button>
  );

  if (!isPreview) {
    return buttonContent;
  }

  return (
    <a
      href={content.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full no-underline"
    >
      {buttonContent}
    </a>
  );
}

function SocialsRenderer({
  content,
  styles,
  isPreview,
}: {
  content: SocialsContent;
  styles?: any;
  isPreview: boolean;
}) {
  const getLayoutClasses = () => {
    switch (content.layout) {
      case "vertical":
        return "flex flex-col space-y-2";
      case "grid":
        return "grid grid-cols-3 gap-2";
      default:
        return "flex justify-center space-x-4";
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {content.platforms.map((platform, index) => {
        const icon = getSocialIcon(platform.platform);
        const size = getIconSize(content.iconSize || "md");

        const socialContent = (
          <div
            className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ width: size, height: size }}
          >
            {icon}
          </div>
        );

        if (!isPreview) {
          return <div key={index}>{socialContent}</div>;
        }

        return (
          <a
            key={index}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            {socialContent}
          </a>
        );
      })}
    </div>
  );
}

function SpacerRenderer({
  content,
  styles,
}: {
  content: SpacerContent;
  styles?: any;
}) {
  return (
    <div style={{ height: content.height }} className="w-full bg-transparent" />
  );
}

function DividerRenderer({
  content,
  styles,
}: {
  content: DividerContent;
  styles?: any;
}) {
  const dividerStyles = {
    borderTop: `${content.thickness || "1px"} ${content.style || "solid"} ${content.color || "#e5e7eb"}`,
    width: content.width || "100%",
    margin: "0 auto",
  };

  return <hr style={dividerStyles} className="border-0" />;
}

function EmbedRenderer({
  content,
  styles,
}: {
  content: EmbedContent;
  styles?: any;
}) {
  return (
    <div
      style={{ height: content.height || "300px" }}
      className="w-full"
      dangerouslySetInnerHTML={{ __html: content.embedCode }}
    />
  );
}

// Helper functions
function getStylesObject(styles?: any) {
  if (!styles) return {};

  const result: any = {};

  if (styles.margin) {
    if (styles.margin.top) result.marginTop = styles.margin.top;
    if (styles.margin.bottom) result.marginBottom = styles.margin.bottom;
    if (styles.margin.left) result.marginLeft = styles.margin.left;
    if (styles.margin.right) result.marginRight = styles.margin.right;
  }

  if (styles.padding) {
    if (styles.padding.top) result.paddingTop = styles.padding.top;
    if (styles.padding.bottom) result.paddingBottom = styles.padding.bottom;
    if (styles.padding.left) result.paddingLeft = styles.padding.left;
    if (styles.padding.right) result.paddingRight = styles.padding.right;
  }

  if (styles.backgroundColor) result.backgroundColor = styles.backgroundColor;
  if (styles.borderRadius) result.borderRadius = styles.borderRadius;
  if (styles.border) result.border = styles.border;
  if (styles.boxShadow) result.boxShadow = styles.boxShadow;

  return result;
}

function getFontSize(size: string): string {
  const sizes = {
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
  };
  return sizes[size as keyof typeof sizes] || "16px";
}

function getHeaderSize(level: number): string {
  const sizes = {
    1: "2rem",
    2: "1.5rem",
    3: "1.25rem",
    4: "1.125rem",
    5: "1rem",
    6: "0.875rem",
  };
  return sizes[level as keyof typeof sizes] || "1.5rem";
}

function getBorderRadius(radius: string): string {
  const radii = {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  };
  return radii[radius as keyof typeof radii] || "0";
}

function getIconSize(size: string): string {
  const sizes = {
    sm: "20px",
    md: "24px",
    lg: "32px",
    xl: "40px",
    "2xl": "48px",
  };
  return sizes[size as keyof typeof sizes] || "24px";
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getIconForPlatform(platform: string): string {
  const icons: Record<string, string> = {
    twitter: "🐦",
    instagram: "📷",
    facebook: "📘",
    linkedin: "💼",
    github: "🐙",
    youtube: "📺",
    tiktok: "🎵",
    email: "📧",
    website: "🌐",
    phone: "📞",
  };
  return icons[platform.toLowerCase()] || "🔗";
}

function getSocialIcon(platform: string): string {
  return getIconForPlatform(platform);
}
