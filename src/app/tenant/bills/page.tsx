
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase-provider";
import { collection, addDoc, Timestamp, doc, onSnapshot, query, where, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Bill = {
  id: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'Due' | 'Pending Verification' | 'Paid';
};

const pastBills = [
    { invoice: "INV-2023-010", date: "2023-10-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-009", date: "2023-09-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-008", date: "2023-08-01", amount: "Rs 2,500", status: "Paid" },
];

export default function TenantBillsPage() {
  const { toast } = useToast();
  const { db, user } = useFirebase();
  const [open, setOpen] = useState(false);
  const [outstandingBill, setOutstandingBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Example user data
  const userFlat = "A-101";
  const userName = "Mr. Raj (Tenant)";

  useEffect(() => {
    if (!db || !user) return;
    
    setIsLoading(true);
    // Listen to changes for this user's specific bill
    const billRef = doc(db, "bills", userFlat);

    const unsubscribe = onSnapshot(billRef, (doc) => {
        if (doc.exists() && doc.data().status === 'Due') {
            setOutstandingBill({ id: doc.id, ...doc.data() } as Bill);
        } else {
            setOutstandingBill(null);
        }
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching bill:", error);
        toast({ title: "Could not fetch billing information", variant: "destructive" });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, userFlat, toast]);


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'destructive';
      case 'Due': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSubmitProof = async () => {
    if (!outstandingBill) return;

    if (!db) {
      toast({
        title: "Database Error",
        description: "Could not connect to the database. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      // 1. Submit proof for verification
      await addDoc(collection(db, "paymentProofs"), {
        name: userName,
        flat: userFlat,
        paymentFor: outstandingBill.description,
        amount: outstandingBill.amount,
        submittedAt: Timestamp.now(),
        status: "Pending Verification"
      });
      
      // 2. Update the bill status
      const billRef = doc(db, "bills", userFlat);
      await updateDoc(billRef, {
        status: "Pending Verification"
      });

      toast({
          title: "Proof Submitted!",
          description: "Your payment proof has been submitted for verification.",
      });
      setOpen(false);

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
                    {pastBills.map((bill) => (
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
        
        {isLoading ? (
            <div className="md:col-span-1">
                <Skeleton className="h-48 w-full" />
            </div>
        ) : outstandingBill ? (
          <div className="md:col-span-1">
              <Card>
                  <CardHeader>
                      <CardTitle>Current Outstanding Bill</CardTitle>
                      <CardDescription>Due: {outstandingBill.dueDate}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex justify-between items-baseline text-lg">
                          <span className="font-semibold">{outstandingBill.description}</span>
                          <span className="font-bold text-primary">Rs {outstandingBill.amount}</span>
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
                              <Input id="name" value={userName} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="flat">Flat No.</Label>
                              <Input id="flat" value={userFlat} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paymentFor">Payment For</Label>
                              <Input id="paymentFor" value={outstandingBill.description} disabled />
                            </div>
                            <div className="space-y-2">
                               <Label htmlFor="amount">Amount</Label>
                              <Input id="amount" value={`Rs ${outstandingBill.amount}`} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                              <Input id="screenshot" type="file" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="w-full" onClick={handleSubmitProof}>
                              <Upload className="mr-2 h-4 w-4" />
                              Submit for Verification
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </CardFooter>
              </Card>
          </div>
        ) : (
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>No Outstanding Bills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">All your bills are paid. Thank you!</p>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </>
  );
}
