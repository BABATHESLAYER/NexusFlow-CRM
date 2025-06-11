

import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { CrmAssistantChat } from '@/components/crm-assistant-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon, ZapIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <AppLayout>
      <PageTitle title="Welcome to NexusFlow CRM" description="Your central hub for managing customer relationships and streamlining workflows." />
      
      {/* Get Started Card & CRM Assistant Chat - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Get Started</CardTitle>
            <CardDescription>Explore the core features of NexusFlow CRM.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Navigate through your dashboard, manage leads and clients, create invoices, schedule events,
              and gain valuable insights from your data. The AI Assistant is here to help you along the way!
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default">
                <Link href="/dashboard">Go to Dashboard <ArrowRightIcon className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/leads">Manage Leads</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <CrmAssistantChat />
      </div>

      {/* Quick Actions & Recent Activity grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ZapIcon className="h-6 w-6 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="secondary" className="w-full justify-start text-left h-auto py-3">
              <Link href="/leads/new">
                <div>
                  <p className="font-semibold">Add New Lead</p>
                  <p className="text-xs text-muted-foreground">Quickly capture a new prospect.</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-start text-left h-auto py-3">
              <Link href="/invoices/create">
                <div>
                  <p className="font-semibold">Create Invoice</p>
                  <p className="text-xs text-muted-foreground">Generate a new invoice for a client.</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-start text-left h-auto py-3">
              <Link href="/calendar">
                 <div>
                  <p className="font-semibold">Schedule Event</p>
                  <p className="text-xs text-muted-foreground">Add a meeting or task to your calendar.</p>
                </div>
              </Link>
            </Button>
             <Button asChild variant="secondary" className="w-full justify-start text-left h-auto py-3">
              <Link href="/notes">
                 <div>
                  <p className="font-semibold">Add a Note</p>
                  <p className="text-xs text-muted-foreground">Jot down important reminders.</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
             <CardTitle className="font-headline">Recent Activity</CardTitle>
             <CardDescription>A quick glance at what's new.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">No recent activity to display yet.</li>
              {/* Placeholder for actual recent activity items */}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
