
"use client";

import { PageHeader } from "@/components/page-header";
import { billings } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BillingPage() {
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'destructive';
      case 'Due': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSendReminder = (flat: string) => {
    toast({
      title: "Reminder Sent!",
      description: `A payment reminder has been sent to flat ${flat}.`,
    });
  };

  return (
    <>
      <PageHeader
        title="Billings Overview"
        description="Track and manage maintenance payments from all apartments."
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Dues</CardTitle>
          <CardDescription>
            A summary of payment statuses for the current billing cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flat Number</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billings.map((billing) => (
                <TableRow key={billing.flat}>
                  <TableCell className="font-medium">{billing.flat}</TableCell>
                  <TableCell>{billing.block}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(billing.status)}>{billing.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendReminder(billing.flat)}
                      disabled={billing.status === 'Paid'}
                    >
                      Send Reminder
                    </Button>
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
