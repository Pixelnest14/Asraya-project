import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const bills = [
    { invoice: "INV-2023-010", date: "2023-10-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-009", date: "2023-09-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-008", date: "2023-08-01", amount: "Rs 2,500", status: "Paid" },
];

export default function TenantBillsPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader
        title="My Bills"
        description="View your maintenance bills and payment history."
      />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {bills.map((bill) => (
                        <TableRow key={bill.invoice}>
                        <TableCell>{bill.invoice}</TableCell>
                        <TableCell>{bill.date}</TableCell>
                        <TableCell>{bill.amount}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm">Download</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Current Outstanding Bill</CardTitle>
                    <CardDescription>Due by November 30, 2023</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Maintenance Fee:</span>
                        <span className="font-bold">Rs 2,000</span>
                    </div>
                     <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Sinking Fund:</span>
                        <span className="font-bold">Rs 500</span>
                    </div>
                     <div className="border-t my-2"></div>
                     <div className="flex justify-between items-baseline text-lg">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-primary">Rs 2,500</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Pay Now</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </>
  );
}
