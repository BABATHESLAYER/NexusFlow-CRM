"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircleIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
});

const invoiceSchema = z.object({
  logo: z.any().optional(), // Placeholder for file upload
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyGstin: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientGstin: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.date({ required_error: "Invoice date is required." }),
  dueDate: z.date({ required_error: "Due date is required." }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  gstType: z.enum(["none", "igst", "cgst_sgst"]).default("none"),
  gstRate: z.coerce.number().min(0).max(100).optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function InvoiceForm() {
  const { toast } = useToast();
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default due date 30 days from now
      items: [{ description: "", quantity: 1, rate: 0 }],
      gstType: "none",
      gstRate: 18,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(data: InvoiceFormValues) {
    console.log(data);
    toast({
      title: "Invoice Submitted!",
      description: "The invoice has been processed (mock).",
    });
  }

  // Calculate totals
  const subtotal = form.watch("items").reduce((acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0);
  const gstType = form.watch("gstType");
  const gstRate = form.watch("gstRate") || 0;
  let gstAmount = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (gstType !== "none" && gstRate > 0) {
    gstAmount = (subtotal * gstRate) / 100;
    if (gstType === "igst") {
      igst = gstAmount;
    } else if (gstType === "cgst_sgst") {
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    }
  }
  const totalAmount = subtotal + gstAmount;


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Details */}
          <Card>
            <CardHeader><CardTitle className="font-headline">Your Company</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <Button variant="outline" type="button" className="w-full flex items-center gap-2">
                        <UploadIcon className="h-4 w-4" /> Upload Logo
                        {/* Actual file input would be hidden and triggered by this button */}
                      </Button>
                    </FormControl>
                    <FormDescription>Optional. Recommended size: 200x100px.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="companyAddress" render={({ field }) => (
                <FormItem><FormLabel>Company Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="companyGstin" render={({ field }) => (
                <FormItem><FormLabel>Company GSTIN (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Client Details */}
          <Card>
            <CardHeader><CardTitle className="font-headline">Client Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="clientName" render={({ field }) => (
                <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="clientAddress" render={({ field }) => (
                <FormItem><FormLabel>Client Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="clientGstin" render={({ field }) => (
                <FormItem><FormLabel>Client GSTIN (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
        </div>

        {/* Invoice Meta */}
        <Card>
          <CardHeader><CardTitle className="font-headline">Invoice Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
              <FormItem><FormLabel>Invoice Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                        >
                          {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                        >
                          {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        {/* Items */}
        <Card>
          <CardHeader><CardTitle className="font-headline">Items</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-2 items-start border p-4 rounded-md">
                <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                  <FormItem className="flex-grow"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                  <FormItem className="w-full md:w-24"><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.rate`} render={({ field }) => (
                  <FormItem className="w-full md:w-32"><FormLabel>Rate</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="w-full md:w-auto md:mt-7">
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="mt-2 md:mt-0">
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ description: "", quantity: 1, rate: 0 })}>
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>

        {/* GST and Totals */}
        <Card>
          <CardHeader><CardTitle className="font-headline">Tax & Totals</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="gstType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>GST Application</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="none" /></FormControl>
                        <FormLabel className="font-normal">None</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="igst" /></FormControl>
                        <FormLabel className="font-normal">IGST</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="cgst_sgst" /></FormControl>
                        <FormLabel className="font-normal">CGST + SGST</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("gstType") !== "none" && (
              <FormField control={form.control} name="gstRate" render={({ field }) => (
                <FormItem><FormLabel>GST Rate (%)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            )}
            <Separator />
            <div className="space-y-2 text-right">
              <p>Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span></p>
              {gstType === "igst" && <p>IGST ({gstRate}%): <span className="font-medium">${igst.toFixed(2)}</span></p>}
              {gstType === "cgst_sgst" && (
                <>
                  <p>CGST ({gstRate/2}%): <span className="font-medium">${cgst.toFixed(2)}</span></p>
                  <p>SGST ({gstRate/2}%): <span className="font-medium">${sgst.toFixed(2)}</span></p>
                </>
              )}
              <p className="text-lg font-bold">Total: <span className="font-bold">${totalAmount.toFixed(2)}</span></p>
            </div>
          </CardContent>
        </Card>
        
        {/* Notes & Terms */}
         <Card>
            <CardHeader><CardTitle className="font-headline">Additional Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Any additional notes for the client..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="terms" render={({ field }) => (
                    <FormItem><FormLabel>Terms & Conditions (Optional)</FormLabel><FormControl><Textarea placeholder="Payment terms, etc." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
        </Card>


        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline">Save Draft</Button>
          <Button type="submit">Generate Invoice</Button>
        </CardFooter>
      </form>
    </Form>
  );
}
