
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { tenantRentStatus } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OwnerBillingsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'destructive';
      default: return 'outline';
    }
  };

  const handleAddTenant = () => {
    toast({
        title: "Tenant Added!",
        description: "The new tenant has been added to your list.",
    });
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Tenant Billings"
        description="Track rent payments from your tenants."
      >
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Tenant</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new tenant to your property.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenant-name" className="text-right">Tenant Name</Label>
                        <Input id="tenant-name" placeholder="e.g., John Doe" className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="property" className="text-right">Property</Label>
                        <Input id="property" placeholder="e.g., A-101" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAddTenant}>Add Tenant</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </PageHeader>

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
