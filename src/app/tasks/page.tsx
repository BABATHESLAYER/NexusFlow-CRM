
"use client";

import React from 'react';
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
import { MoreHorizontalIcon, PlusCircleIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

type TaskStatus = "To Do" | "In Progress" | "Completed" | "Scheduled";
type TaskPriority = "Low" | "Medium" | "High";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: Date;
  priority: TaskPriority;
  description?: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Follow up with Lead A', status: 'In Progress', dueDate: new Date(2024, 6, 20), priority: 'High', description: 'Discuss pricing and next steps.' },
  { id: '2', title: 'Prepare Q3 Sales Report', status: 'To Do', dueDate: new Date(2024, 7, 5), priority: 'Medium', description: 'Compile sales data from all regions.' },
  { id: '3', title: 'Client Meeting - Acme Corp', status: 'Scheduled', dueDate: new Date(2024, 6, 25), priority: 'High', description: 'Agenda: Q3 review and Q4 planning.' },
  { id: '4', title: 'Update Website FAQ', status: 'Completed', dueDate: new Date(2024, 6, 15), priority: 'Low', description: 'Add new questions based on customer feedback.' },
  { id: '5', title: 'Plan Marketing Campaign', status: 'Scheduled', dueDate: new Date(2024, 7, 15), priority: 'High', description: 'For new product launch in Q4.'},
];

const statusVariantMap: { [key in TaskStatus]: "default" | "secondary" | "outline" | "destructive" } = {
  'To Do': 'outline',
  'In Progress': 'secondary',
  'Completed': 'default',
  'Scheduled': 'default', // Using primary as it's an active planned state
};

const priorityVariantMap: { [key in TaskPriority]: "default" | "secondary" | "destructive" } = {
  'Low': 'secondary',
  'Medium': 'default',
  'High': 'destructive',
};

export default function TasksPage() {
  // const [tasks, setTasks] = React.useState<Task[]>(mockTasks);

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageTitle title="Tasks" description="Manage your to-do items and track progress." />
        <Button asChild>
          <Link href="/tasks/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Task
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[task.status] || 'default'}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  {task.dueDate ? format(task.dueDate, "MMM dd, yyyy") : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariantMap[task.priority] || 'default'}>{task.priority}</Badge>
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
                      <DropdownMenuItem>
                        <Edit2Icon className="mr-2 h-4 w-4" /> Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Mark as {task.status === "Completed" ? "Incomplete" : "Complete"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2Icon className="mr-2 h-4 w-4" /> Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {mockTasks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No tasks found. <Link href="/tasks/new" className="text-primary hover:underline">Add your first task!</Link>
        </div>
      )}
    </AppLayout>
  );
}
