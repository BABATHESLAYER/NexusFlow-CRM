import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { InvoiceForm } from '@/components/invoice-form';

export default function CreateInvoicePage() {
  return (
    <AppLayout>
      <PageTitle title="Create New Invoice" description="Fill in the details below to generate a new invoice." />
      <InvoiceForm />
    </AppLayout>
  );
}
