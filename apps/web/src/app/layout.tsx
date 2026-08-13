import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/libs/ui/components/src/app-sidebar";
import { NavBar } from "@/libs/ui/components/src/navbar";
import { SidebarProvider, SidebarTrigger } from "@repo/ui";
import { getSession } from "@/libs/utils/src/server-session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskMaster Pro",
  description: "Professional task management — boards, analytics, and more.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TaskMaster",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const sessionUserId = session?.userId;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <Providers sessionUserId={sessionUserId}>
          {sessionUserId ? (
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full overflow-x-hidden">
                <div className="flex items-center h-16 bg-background px-4 gap-2 border-b border-border">
                  <SidebarTrigger />
                  <NavBar />
                </div>
                {children}
              </main>
            </SidebarProvider>
          ) : (
            // Auth pages: full screen, no sidebar
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
