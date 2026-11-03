import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import "@fontsource-variable/geist";
import "./globals.css";

import AuthInitializer from "@/components/auth/AuthInitializer";
import { SiteFooter } from "@/components/common/SiteFooter";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Coursify",
    template: "%s | Coursify",
  },
  description:
    "Organise your courses, import YouTube playlists, track progress and keep learning without the tab chaos.",
  icons: {
    icon: "/c-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1a19" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AuthInitializer>
              <div className="flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>

                <SiteFooter />
              </div>
            </AuthInitializer>

            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
