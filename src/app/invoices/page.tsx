"use client";

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
import jsPDF from 'jspdf';

const mockInvoices = [
  { id: 'INV-001', clientName: 'Globex Corporation', date: '2023-10-01', dueDate: '2023-10-31', amount: '$1,200.00', status: 'Paid' },
  { id: 'INV-002', clientName: 'Stark Industries', date: '2023-10-05', dueDate: '2023-11-04', amount: '$3,500.00', status: 'Sent' },
  { id: 'INV-003', clientName: 'Wayne Enterprises', date: '2023-09-20', dueDate: '2023-10-20', amount: '$800.00', status: 'Overdue' },
  { id: 'INV-004', clientName: 'Pied Piper', date: '2023-10-10', dueDate: '2023-11-09', amount: '$5,000.00', status: 'Draft' },
];

const invoiceStatusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Paid': 'default', // Using primary color for positive status
  'Sent': 'secondary',
  'Overdue': 'destructive',
  'Draft': 'outline',
  'Partial': 'default', // Using primary color as it's progressing
};


export default function InvoicesPage() {

  const handleDownloadPdf = (invoice: typeof mockInvoices[0]) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Invoice", 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 14, 40);
    doc.text(`Client: ${invoice.clientName}`, 14, 50);
    doc.text(`Date: ${invoice.date}`, 14, 60);
    doc.text(`Due Date: ${invoice.dueDate}`, 14, 70);
    doc.text(`Amount: ${invoice.amount}`, 14, 80);
    doc.text(`Status: ${invoice.status}`, 14, 90);
    
    // Add a line for separation
    doc.line(14, 100, 196, 100); 

    // Example of adding more details or a table - keep it simple for now
    doc.text("Thank you for your business!", 105, 120, { align: 'center'});

    doc.save(`${invoice.id}.pdf`);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageTitle title="Invoices" description="Manage and track your invoices." />
        <Button asChild>
          <Link href="/invoices/create">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Create Invoice
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={invoiceStatusVariantMap[invoice.status] || 'default'}>{invoice.status}</Badge>
                </TableCell>
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
                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadPdf(invoice)}>Download PDF</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {mockInvoices.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No invoices found. <Link href="/invoices/create" className="text-primary hover:underline">Create your first invoice!</Link>
        </div>
      )}
    </AppLayout>
  );
}
