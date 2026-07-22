import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/shared/layouts/app-sidebar";
import { NavBar } from "@/shared/layouts/navbar";
import { SidebarProvider, SidebarTrigger } from "@/shared/components/sidebar";
import { getSession } from "@/shared/lib/server-session";

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
  description: "Next.js migration of TaskMaster Pro with Redux Saga and Shadcn UI",
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
