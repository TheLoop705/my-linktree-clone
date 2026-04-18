// Brand mark; pairs with the .lh-logo SCSS.
import * as React from "react";

interface LogoProps {
  size?: number;
  label?: boolean;
  labelColor?: string;
  className?: string;
}

export function Logo({
  size = 28,
  label = true,
  labelColor,
  className,
}: LogoProps) {
  return (
    <span
      className={`lh-logo${className ? ` ${className}` : ""}`}
      style={{ ["--size" as string]: `${size}px` }}
    >
      <span className="lh-logo__mark" aria-hidden="true" />
      {label && (
        <span className="lh-logo__label" style={{ color: labelColor }}>
          LinkHub
        </span>
      )}
    </span>
  );
}
