"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellIcon, CheckCheckIcon, Trash2Icon, CircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'update';

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: NotificationType;
  link?: string;
};

const mockNotifications: Notification[] = [
  { id: '1', title: 'New Lead Assigned', message: 'John Doe from Acme Corp has been assigned to you.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, type: 'info', link: '/leads/john-doe' },
  { id: '2', title: 'Invoice INV-003 Overdue', message: 'Invoice for Wayne Enterprises is 3 days overdue.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: false, type: 'warning', link: '/invoices/inv-003' },
  { id: '3', title: 'Task Completed', message: 'Your task "Prepare Q3 Sales Report" has been marked as complete.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true, type: 'success' },
  { id: '4', title: 'System Update Scheduled', message: 'A system update is scheduled for Oct 25, 2 AM.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true, type: 'update' },
  { id: '5', title: 'Client Meeting Reminder', message: 'Upcoming meeting with Stark Industries in 1 hour.', timestamp: new Date(Date.now() - 1000 * 60 * 15), isRead: false, type: 'info', link: '/calendar' },
];

const notificationIcons: Record<NotificationType, React.ElementType> = {
  info: InfoIcon,
  warning: AlertTriangleIcon,
  success: CheckCheckIcon,
  error: AlertTriangleIcon, // Could use XCircleIcon if available
  update: InfoIcon,
};

const notificationColors: Record<NotificationType, string> = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  success: 'text-green-500',
  error: 'text-red-500',
  update: 'text-purple-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Notifications" description={`You have ${unreadCount} unread notification(s).`} />
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCheckIcon className="mr-2 h-4 w-4" /> Mark all as read
              </Button>
              <Button variant="destructive" onClick={deleteAllNotifications}>
                <Trash2Icon className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="py-10 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You're all caught up!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notificationIcons[notification.type];
            return (
              <Card key={notification.id} className={cn("shadow-md transition-all hover:shadow-lg", !notification.isRead && "bg-secondary border-primary/50")}>
                <CardContent className="p-4 flex items-start gap-4">
                  {!notification.isRead && (
                    <CircleIcon className="h-2 w-2 mt-1.5 fill-primary text-primary flex-shrink-0" />
                  )}
                  <IconComponent className={cn("h-6 w-6 mt-0.5 flex-shrink-0", notificationColors[notification.type])} />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    {notification.link && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                        <a href={notification.link}>View Details</a>
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-center flex-shrink-0">
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(notification.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
