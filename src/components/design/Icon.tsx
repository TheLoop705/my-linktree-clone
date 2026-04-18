// Mirrors linkedtree/project/components.jsx `Icon` object 1-for-1.
// Every icon is a presentational <svg> accepting { size?, className?, ...rest }.
import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const wrap =
  (paths: React.ReactNode, defaults?: Partial<React.SVGProps<SVGSVGElement>>) =>
  ({ size = 16, ...props }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...defaults}
      {...props}
    >
      {paths}
    </svg>
  );

export const Icon = {
  Plus: wrap(<path d="M12 5v14M5 12h14" />, { strokeWidth: 2 }),
  Check: wrap(<polyline points="20 6 9 17 4 12" />, { strokeWidth: 2.5 }),
  Arrow: wrap(<path d="M5 12h14M13 5l7 7-7 7" />, { strokeWidth: 2 }),
  ArrowUp: wrap(<path d="M7 17L17 7M7 7h10v10" />, { strokeWidth: 2 }),
  Link: wrap(
    <>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </>,
  ),
  Chart: wrap(
    <>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </>,
  ),
  Paint: wrap(
    <>
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 22a10 10 0 1 1 10-10c0 2-2 2-4 2h-2a2 2 0 0 0-1 4 2 2 0 0 1-1 4z" />
    </>,
  ),
  Gear: wrap(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>,
  ),
  Device: wrap(
    <>
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <circle cx="12" cy="18" r="1" />
    </>,
  ),
  Grip: wrap(
    <>
      <circle cx="9" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="18" r="1" />
    </>,
    { strokeWidth: 2 },
  ),
  Eye: wrap(
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>,
  ),
  Copy: wrap(
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>,
  ),
  Sparkle: wrap(
    <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z" />,
  ),
  NFC: wrap(
    <>
      <path d="M4 8.5A12 12 0 0 1 15.5 20" />
      <path d="M7.5 7A8 8 0 0 1 17 16.5" />
      <path d="M11 6a5 5 0 0 1 7 5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </>,
  ),
  Globe: wrap(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </>,
  ),
  Pin: wrap(
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>,
  ),
  Trash: wrap(
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </>,
  ),
  External: wrap(
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </>,
  ),
};

export type IconName = keyof typeof Icon;
