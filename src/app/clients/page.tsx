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
} from "@/components/ui/dropdown-menu";


const mockClients = [
  { id: '1', name: 'Globex Corporation', contactPerson: 'Hank Scorpio', email: 'hank@globex.com', phone: '555-0201', status: 'Active', joinDate: '2022-05-15', industry: 'Technology' },
  { id: '2', name: 'Stark Industries', contactPerson: 'Pepper Potts', email: 'pepper@stark.com', phone: '555-0202', status: 'Active', joinDate: '2021-11-20', industry: 'Manufacturing' },
  { id: '3', name: 'Wayne Enterprises', contactPerson: 'Lucius Fox', email: 'lucius@wayne.com', phone: '555-0203', status: 'Inactive', joinDate: '2020-01-10', industry: 'Conglomerate' },
  { id: '4', name: 'Pied Piper', contactPerson: 'Richard Hendricks', email: 'richard@piedpiper.com', phone: '555-0204', status: 'Active', joinDate: '2023-02-01', industry: 'Software' },
];

const clientStatusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Active': 'default', // using primary color
  'Inactive': 'secondary',
  'On Hold': 'outline',
  'Churned': 'destructive',
};

export default function ClientsPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageTitle title="Clients" description="Manage your existing customers and their information." />
        <Button asChild>
          <Link href="/clients/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Client
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Badge variant={clientStatusVariantMap[client.status] || 'default'}>{client.status}</Badge>
                </TableCell>
                <TableCell>{client.joinDate}</TableCell>
                <TableCell>{client.industry}</TableCell>
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
                      <DropdownMenuItem>View Client</DropdownMenuItem>
                      <DropdownMenuItem>Edit Client</DropdownMenuItem>
                      <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Client</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {mockClients.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No clients found. <Link href="/clients/new" className="text-primary hover:underline">Add your first client!</Link>
        </div>
      )}
    </AppLayout>
  );
}
