import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecksIcon, CalendarClockIcon, HistoryIcon, PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mockWorkItems = {
  ongoing: [
    { id: '1', title: 'Follow up with Lead A', dueDate: 'Tomorrow' },
    { id: '2', title: 'Prepare Q3 Sales Report', dueDate: 'In 3 days' },
    { id: '3', title: 'Client Meeting - Acme Corp', dueDate: 'Today, 2 PM' },
  ],
  future: [
    { id: '4', title: 'Plan Marketing Campaign for New Product', startDate: 'Next Week' },
    { id: '5', title: 'Team Strategy Session', startDate: 'Oct 15th' },
  ],
  past: [
    { id: '6', title: 'Onboarded Client B', completedDate: 'Last week' },
    { id: '7', title: 'Submitted Q2 Financials', completedDate: 'Sep 20th' },
  ],
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageTitle title="Dashboard" description="Overview of your work status and key activities." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold font-headline flex items-center">
              <ListChecksIcon className="mr-2 h-5 w-5 text-primary" />
              Ongoing Work
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks/new"><PlusCircleIcon className="mr-1 h-4 w-4" /> Add Task</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mockWorkItems.ongoing.length > 0 ? (
              <ul className="space-y-2">
                {mockWorkItems.ongoing.map(item => (
                  <li key={item.id} className="text-sm p-2 bg-muted/50 rounded-md">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No ongoing tasks.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold font-headline flex items-center">
              <CalendarClockIcon className="mr-2 h-5 w-5 text-accent" />
              Future Work
            </CardTitle>
             <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks/new?status=future"><PlusCircleIcon className="mr-1 h-4 w-4" /> Schedule</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mockWorkItems.future.length > 0 ? (
              <ul className="space-y-2">
                {mockWorkItems.future.map(item => (
                  <li key={item.id} className="text-sm p-2 bg-muted/50 rounded-md">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Starts: {item.startDate}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No future work scheduled.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-headline flex items-center">
              <HistoryIcon className="mr-2 h-5 w-5 text-destructive" />
              Past Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockWorkItems.past.length > 0 ? (
              <ul className="space-y-2">
                {mockWorkItems.past.map(item => (
                  <li key={item.id} className="text-sm p-2 bg-muted/50 rounded-md">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Completed: {item.completedDate}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No past work to display.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline">Quick Stats</CardTitle>
          <CardDescription>A brief look at your performance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-medium text-secondary-foreground">Active Leads</h3>
                <p className="text-2xl font-bold">25</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-medium text-secondary-foreground">Clients</h3>
                <p className="text-2xl font-bold">150</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-medium text-secondary-foreground">Pending Invoices</h3>
                <p className="text-2xl font-bold">5</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-medium text-secondary-foreground">Upcoming Meetings</h3>
                <p className="text-2xl font-bold">3</p>
            </div>
        </CardContent>
      </Card>

    </AppLayout>
  );
}
