import type { Metadata } from "next";
import "@/styles/main.scss";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "LinkHub — One tap. Every link.",
  description:
    "LinkHub is the link-in-bio for creators, networkers and brands, paired with a physical NFC wristband that shares your whole world with a single tap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
