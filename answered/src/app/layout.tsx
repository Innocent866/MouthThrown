import type { Metadata, Viewport } from "next";
import * as React from "react";
import ThemeRegistry from "@/components/ThemeRegistry";
import { AppHeader, DisclaimerFooter } from "@/components/AppChrome";
import { DISCLAIMER, JURISDICTION } from "@/config/jurisdiction";
import "./globals.css";

export const metadata: Metadata = {
  title: `Answered — Respond to a debt lawsuit in ${JURISDICTION.stateName}`,
  description: `Sued for a debt in ${JURISDICTION.stateName}? Prepare a court-ready Answer and filing instructions before your deadline. ${DISCLAIMER}`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <ThemeRegistry>
          <AppHeader />
          {children}
          <DisclaimerFooter />
        </ThemeRegistry>
      </body>
    </html>
  );
}
