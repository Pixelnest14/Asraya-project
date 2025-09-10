
"use client"

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase-provider";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const bills = [
    { invoice: "INV-2023-010", date: "2023-10-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-009", date: "2023-09-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-008", date: "2023-08-01", amount: "Rs 2,500", status: "Paid" },
];

export default function TenantBillsPage() {
  const { toast } = useToast();
  const { db } = useFirebase();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Mr. Raj (Tenant)");
  const [flat, setFlat] = useState("A-101");
  const [paymentFor, setPaymentFor] = useState("Maintenance Charges - Q2 2024");
  const [isBillPaid, setIsBillPaid] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSubmit = async () => {
    if (!name || !flat || !paymentFor) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }

    if (!db) {
      toast({
        title: "Database Error",
        description: "Could not connect to the database. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, "paymentProofs"), {
        name,
        flat,
        paymentFor,
        submittedAt: Timestamp.now(),
        status: "Pending Verification"
      });

      toast({
          title: "Proof Submitted!",
          description: "Your payment proof has been submitted for verification.",
      });
      setOpen(false);
      setIsBillPaid(true);

    } catch (error) {
      console.error("Error submitting payment proof: ", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your proof. Please try again.",
        variant: "destructive"
      });
    }
  }

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
        {!isBillPaid && (
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
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Pay Now</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                          <DialogHeader>
                            <DialogTitle>Submit Payment Proof</DialogTitle>
                            <p className="text-sm text-muted-foreground pt-2">
                              Pay via PhonePe/GPay to UPI ID: <strong className="text-foreground">society-upi@bank</strong>. Then, upload the payment screenshot below.
                            </p>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="flat">Flat No.</Label>
                              <Input id="flat" value={flat} onChange={(e) => setFlat(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paymentFor">Payment For</Label>
                              <Input id="paymentFor" value={paymentFor} onChange={(e) => setPaymentFor(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                              <Input id="screenshot" type="file" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="w-full" onClick={handleSubmit}>
                              <Upload className="mr-2 h-4 w-4" />
                              Submit for Verification
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </CardFooter>
              </Card>
          </div>
        )}
      </div>
    </>
  );
}
