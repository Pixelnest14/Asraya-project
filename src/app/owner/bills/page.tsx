import { PageHeader } from "@/components/page-header";
import { tenantRentStatus } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OwnerBillingsPage() {

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
        title="Tenant Billings"
        description="Track rent payments from your tenants."
      />

      <Card>
        <CardHeader>
          <CardTitle>Rent Status</CardTitle>
          <CardDescription>
            A summary of rent payment statuses for the current month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantRentStatus.map((tenant) => (
                <TableRow key={tenant.tenant}>
                  <TableCell className="font-medium">{tenant.tenant}</TableCell>
                  <TableCell>{tenant.property}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(tenant.status)}>{tenant.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {tenant.status === 'Pending' && <Button variant="outline" size="sm">Send Reminder</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
