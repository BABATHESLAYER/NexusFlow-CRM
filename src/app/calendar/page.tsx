"use client"; // Required for Calendar component and useState

import * as React from "react";
import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListIcon, PlusCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock events data
const mockEvents = [
  { date: new Date(2024, 6, 15), title: "Team Meeting", type: "meeting" }, // July 15, 2024
  { date: new Date(2024, 6, 15), title: "Project Deadline", type: "task" },
  { date: new Date(2024, 6, 20), title: "Client Call - Acme Corp", type: "meeting" },
  { date: new Date(2024, 7, 1), title: "Product Launch", type: "event" },
];


export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState(mockEvents);

  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );

  return (
    <AppLayout>
      <PageTitle title="Calendar" description="Manage your events, meetings, and tasks." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Monthly View</CardTitle>
             <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">Sync with Google Calendar</Button>
              <Button variant="outline" size="sm">Sync with Outlook Calendar</Button>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                events: events.map(e => e.date)
              }}
              modifiersClassNames={{
                events: "bg-primary/20 text-primary rounded-full"
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">
              Events for {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Today"}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length > 0 ? `You have ${selectedDateEvents.length} event(s).` : "No events scheduled."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDateEvents.length > 0 ? selectedDateEvents.map((event, index) => (
              <div key={index} className="p-3 bg-muted rounded-md">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{event.title}</p>
                  <Badge variant={event.type === 'meeting' ? 'default' : 'secondary'}>{event.type}</Badge>
                </div>
                 {/* Add more event details here if needed, e.g., time */}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Select a date to see events or add a new one.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
