"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AppHeader } from './app-header';
import { navItems, AppLogo, AppName } from './sidebar-nav-items';
import { SidebarNav } from './sidebar-nav';
import { SettingsIcon } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  
  // Determine page title (simple example, can be more sophisticated)
  const currentPage = navItems.find(item => item.href === '/' ? pathname === item.href : pathname.startsWith(item.href));
  const pageTitle = currentPage?.title || AppName;

  return (
    <SidebarProvider defaultOpen={true} open={true}>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <AppLogo className="h-6 w-6" />
            </Button>
            <span className="text-lg font-semibold font-headline group-data-[collapsible=icon]:hidden">
              {AppName}
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav items={navItems} />
        </SidebarContent>
        <SidebarFooter className="p-2">
           <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center">
            <SettingsIcon className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader navItems={navItems} pageTitle={pageTitle} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
