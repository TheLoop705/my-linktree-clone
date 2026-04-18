// Abstract NFC wristband illustration; pairs with the .nfc-band SCSS.
import * as React from "react";
import { Icon } from "./Icon";

interface NFCBandProps {
  size?: number;
  glow?: boolean;
  floating?: boolean;
  className?: string;
}

export function NFCBand({
  size = 320,
  glow = true,
  floating = false,
  className,
}: NFCBandProps) {
  const chipIconSize = Math.round(size * 0.11);
  return (
    <div
      className={`nfc-band${className ? ` ${className}` : ""}`}
      style={{ ["--size" as string]: `${size}px` }}
      data-floating={floating ? "true" : "false"}
    >
      {glow && <div className="nfc-band__glow" aria-hidden="true" />}
      <div className="nfc-band__body">
        <div className="nfc-band__shine" aria-hidden="true" />
        <div className="nfc-band__chip">
          <Icon.NFC size={chipIconSize} />
        </div>
        <div className="nfc-band__stitch" aria-hidden="true" />
      </div>
    </div>
  );
}
