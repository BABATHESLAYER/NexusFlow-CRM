import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontalIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockLeads = [
  { id: '1', name: 'Alice Wonderland', company: 'Wonderland Inc.', email: 'alice@wonder.land', phone: '555-0101', status: 'New', lastContact: '2023-10-01', source: 'Website' },
  { id: '2', name: 'Bob The Builder', company: 'BuildIt LLC', email: 'bob@build.it', phone: '555-0102', status: 'Contacted', lastContact: '2023-10-05', source: 'Referral' },
  { id: '3', name: 'Charlie Chaplin', company: 'Silent Films Co.', email: 'charlie@silent.co', phone: '555-0103', status: 'Qualified', lastContact: '2023-09-20', source: 'Event' },
  { id: '4', name: 'Diana Prince', company: 'Themyscira Exports', email: 'diana@themyscira.com', phone: '555-0104', status: 'Proposal Sent', lastContact: '2023-10-10', source: 'Cold Email' },
  { id: '5', name: 'Edward Elric', company: 'Alchemy Solutions', email: 'ed@alchemy.fm', phone: '555-0105', status: 'Negotiation', lastContact: '2023-10-12', source: 'LinkedIn' },
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'default',
  'Contacted': 'secondary',
  'Qualified': 'outline',
  'Proposal Sent': 'default', // using primary color
  'Negotiation': 'secondary',
  'Lost': 'destructive',
  'Won': 'default' // using primary color
};


export default function LeadsPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageTitle title="Leads" description="Manage your potential customers and track their progress." />
        <Button asChild>
          <Link href="/leads/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Lead
          </Link>
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[lead.status] || 'default'}>{lead.status}</Badge>
                </TableCell>
                <TableCell>{lead.lastContact}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Lead</DropdownMenuItem>
                      <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                      <DropdownMenuItem>Convert to Client</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {mockLeads.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No leads found. <Link href="/leads/new" className="text-primary hover:underline">Add your first lead!</Link>
        </div>
      )}
    </AppLayout>
  );
}
