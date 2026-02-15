import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { Toaster } from "@/components/ui/toaster";
import BootstrapClient from "@/components/BootstrapClient";

export const metadata: Metadata = {
  title: "LinkHub - One Link to Rule Them All",
  description:
    "Share all your important links in one beautiful, customizable page.",
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
        <BootstrapClient />
      </body>
    </html>
  );
}
