// Mobile status bar; pairs with .mobile-status SCSS.
import * as React from "react";

interface MobileStatusProps {
  dark?: boolean;
  time?: string;
}

export function MobileStatus({ dark = false, time = "9:41" }: MobileStatusProps) {
  return (
    <div
      className={`mobile-status${dark ? " mobile-status--dark" : ""}`}
      aria-hidden="true"
    >
      <span>{time}</span>
      <span className="right">
        <span className="sig">
          <span />
          <span />
          <span />
          <span />
        </span>
        <svg viewBox="0 0 20 16" width="16" height="12" fill="currentColor">
          <path d="M10 4c2.7 0 5.2 1 7 2.7l-1.4 1.4A8 8 0 0 0 10 6a8 8 0 0 0-5.6 2.1L3 6.7A10 10 0 0 1 10 4zm0-4c4 0 7.6 1.4 10.3 3.8l-1.4 1.4A12 12 0 0 0 10 2C6.3 2 3 3.3 0.7 5.2L-0.7 3.8A14 14 0 0 1 10 0zM10 8c1.4 0 2.6.5 3.5 1.3l-1.4 1.4A4 4 0 0 0 10 10a4 4 0 0 0-2.1.7L6.5 9.3A6 6 0 0 1 10 8z" />
        </svg>
        <span className="bat">
          <i />
        </span>
      </span>
    </div>
  );
}
