
import type { LucideIcon } from 'lucide-react';
import {
  HomeIcon,
  LayoutDashboardIcon,
  UsersIcon,
  BriefcaseIcon,
  FileTextIcon,
  CalendarDaysIcon,
  Share2Icon,
  BarChartBigIcon,
  BanknoteIcon,
  StickyNoteIcon,
  BellIcon,
  NetworkIcon,
  ListTodoIcon, // Added for Tasks
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  variant?: "default" | "ghost";
  subItems?: NavItem[];
  tooltip?: string;
}

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: HomeIcon,
    variant: 'default',
    tooltip: 'Home',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon,
    variant: 'ghost',
    tooltip: 'Dashboard',
  },
  {
    title: 'Leads',
    href: '/leads',
    icon: UsersIcon,
    variant: 'ghost',
    tooltip: 'Leads',
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: BriefcaseIcon,
    variant: 'ghost',
    tooltip: 'Clients',
  },
   {
    title: 'Tasks', // Added Tasks
    href: '/tasks',
    icon: ListTodoIcon,
    variant: 'ghost',
    tooltip: 'Tasks',
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileTextIcon,
    variant: 'ghost',
    tooltip: 'Invoices',
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: CalendarDaysIcon,
    variant: 'ghost',
    tooltip: 'Calendar',
  },
  {
    title: 'Social Media',
    href: '/social-media',
    icon: Share2Icon,
    variant: 'ghost',
    tooltip: 'Social Media',
  },
  {
    title: 'Statistics',
    href: '/stats',
    icon: BarChartBigIcon,
    variant: 'ghost',
    tooltip: 'Statistics',
  },
  {
    title: 'Finances',
    href: '/finances',
    icon: BanknoteIcon,
    variant: 'ghost',
    tooltip: 'Finances',
  },
  {
    title: 'Notes',
    href: '/notes',
    icon: StickyNoteIcon,
    variant: 'ghost',
    tooltip: 'Notes',
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: BellIcon,
    variant: 'ghost',
    label: '3', // Example notification count
    tooltip: 'Notifications',
  },
];

export const AppLogo = NetworkIcon;
export const AppName = "NexusFlow CRM";
