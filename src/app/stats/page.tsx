"use client";

import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts";
import { TrendingUpIcon, UsersIcon, DollarSignIcon, CheckCircleIcon, TargetIcon, SmileIcon, ShoppingCartIcon } from 'lucide-react';

const salesData = [
  { month: "Jan", sales: 4000, leads: 24 },
  { month: "Feb", sales: 3000, leads: 18 },
  { month: "Mar", sales: 5000, leads: 32 },
  { month: "Apr", sales: 4500, leads: 28 },
  { month: "May", sales: 6000, leads: 40 },
  { month: "Jun", sales: 5500, leads: 35 },
];

const chartConfig = {
  sales: { label: "Sales ($)", color: "hsl(var(--chart-1))" },
  leads: { label: "Leads", color: "hsl(var(--chart-2))" },
};

const incomeExpenseData = [
  { month: "Jan", income: 5000, expenses: 2000 },
  { month: "Feb", income: 4500, expenses: 1800 },
  { month: "Mar", income: 6000, expenses: 2500 },
  { month: "Apr", income: 5500, expenses: 2200 },
  { month: "May", income: 7000, expenses: 2800 },
  { month: "Jun", income: 6500, expenses: 2600 },
];

const incomeExpenseConfig = {
  income: { label: "Income ($)", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses ($)", color: "hsl(var(--chart-4))" },
};

const summaryStats = [
  { title: "Total Sales", value: "$28,500", icon: ShoppingCartIcon, change: "+12%", changeType: "positive" as const },
  { title: "New Leads", value: "177", icon: UsersIcon, change: "+8%", changeType: "positive" as const },
  { title: "Active Clients", value: "42", icon: TargetIcon, change: "-2%", changeType: "negative" as const },
  { title: "Work Done (Tasks)", value: "256", icon: CheckCircleIcon, change: "+15%", changeType: "positive" as const },
  { title: "Customer Satisfaction", value: "92%", icon: SmileIcon, change: "+1.5%", changeType: "positive" as const },
  { title: "Net Income", value: "$16,100", icon: DollarSignIcon, change: "+10%", changeType: "positive" as const },
];


export default function StatsPage() {
  return (
    <AppLayout>
      <PageTitle title="Statistics Dashboard" description="Key metrics and performance indicators." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <TrendingUpIcon className="mr-2 h-5 w-5 text-primary" /> Sales & Leads Overview
            </CardTitle>
            <CardDescription>Monthly sales performance and lead generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={salesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="sales" fill="var(--color-sales)" radius={4} />
                <Bar yAxisId="right" dataKey="leads" fill="var(--color-leads)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <DollarSignIcon className="mr-2 h-5 w-5 text-primary" /> Income vs Expenses
            </CardTitle>
            <CardDescription>Monthly financial overview.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={incomeExpenseConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={incomeExpenseData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line dataKey="income" type="monotone" stroke="var(--color-income)" strokeWidth={2} dot={false} />
                <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
