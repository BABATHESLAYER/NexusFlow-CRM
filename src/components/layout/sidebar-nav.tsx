"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import type { NavItem } from './sidebar-nav-items';

interface SidebarNavProps {
  items: NavItem[];
  isMobile?: boolean;
}

export function SidebarNav({ items, isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
        
        if (isMobile) {
          return (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                "flex items-center gap-4 px-2.5",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
              {item.label && (
                <span className="ml-auto inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {item.label}
                </span>
              )}
            </Link>
          );
        }

        return (
          <SidebarMenuItem key={index}>
            <Link href={item.disabled ? '#' : item.href} legacyBehavior passHref>
              <SidebarMenuButton
                variant={item.variant}
                isActive={isActive}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                className="w-full"
                tooltip={item.tooltip || item.title}
              >
                <Icon />
                <span>{item.title}</span>
                {item.label && <SidebarMenuBadge>{item.label}</SidebarMenuBadge>}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
