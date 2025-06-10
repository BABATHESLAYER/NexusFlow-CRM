"use client";

import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from '@/components/ui/badge';
import { PlusCircleIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, CalendarIcon, DollarSignIcon, BarChartIcon, MoreHorizontalIcon, EditIcon, TrashIcon } from 'lucide-react';
import { format } from "date-fns";
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  paymentMethod: 'cash' | 'card' | 'upi' | 'online' | 'netbanking' | 'other';
};

const mockTransactions: Transaction[] = [
  { id: '1', date: new Date(2023, 9, 1), description: 'Client Payment - Project Alpha', amount: 2500, type: 'income', paymentMethod: 'online' },
  { id: '2', date: new Date(2023, 9, 2), description: 'Software Subscription', amount: 49, type: 'expense', paymentMethod: 'card' },
  { id: '3', date: new Date(2023, 9, 5), description: 'Office Supplies', amount: 120, type: 'expense', paymentMethod: 'cash' },
  { id: '4', date: new Date(2023, 9, 10), description: 'Consulting Fee - Beta LLC', amount: 1800, type: 'income', paymentMethod: 'netbanking' },
  { id: '5', date: new Date(2023, 9, 12), description: 'UPI Payment for Lunch', amount: 15, type: 'expense', paymentMethod: 'upi' },
];

const paymentMethodColors: { [key: string]: string } = {
  cash: 'bg-red-500',
  card: 'bg-orange-500',
  upi: 'bg-yellow-500',
  online: 'bg-green-500',
  netbanking: 'bg-blue-500',
  other: 'bg-purple-500',
};


export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>('card');
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount === '' || !date) return;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date,
      description,
      amount: Number(amount),
      type,
      paymentMethod,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setDescription('');
    setAmount('');
  };

  return (
    <AppLayout>
      <PageTitle title="Finances" description="Track your income, expenses, and overall financial health." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircleIcon className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircleIcon className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSignIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${balance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Client Payment" required />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} placeholder="0.00" required />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
               <Popover>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus/>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
             
            </div>
             <div className="lg:col-span-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: Transaction['paymentMethod']) => setPaymentMethod(value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentMethodColors).map(([method]) => (
                      <SelectItem key={method} value={method}>
                        <span className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${paymentMethodColors[method]}`}></span>
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <Button type="submit" className="lg:col-start-5">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${paymentMethodColors[transaction.paymentMethod]}`}></span>
                        {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><EditIcon className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><TrashIcon className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {transactions.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No transactions yet. Add your first one!
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
