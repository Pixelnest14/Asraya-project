
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
  flat: string;
};

const pastBills = [
    { invoice: "INV-2023-010", date: "2023-10-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-009", date: "2023-09-01", amount: "Rs 2,500", status: "Paid" },
    { invoice: "INV-2023-008", date: "2023-08-01", amount: "Rs 2,500", status: "Paid" },
];

export default function TenantBillsPage() {
  const { toast } = useToast();
  const { db, user, isLoading: isAuthLoading } = useFirebase();
  const [open, setOpen] = useState(false);
  const [outstandingBills, setOutstandingBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Example user data - this should come from a user profile in a real app
  const [userProfile, setUserProfile] = useState({ name: 'Tenant', flat: 'N/A' });

  useEffect(() => {
    if (!db || isAuthLoading || !user) {
        setIsLoading(false);
        return;
    };
    
    setIsLoading(true);
    // In a real app, you'd fetch the user's flat number from a 'users' collection
    // For this prototype, we'll listen to bills for a few potential flats for demo purposes
    const exampleFlats = ["A-101", "B-202"];
    setUserProfile({ name: user.displayName || 'Tenant', flat: exampleFlats[0] });

    const q = query(
        collection(db, "bills"), 
        where("flat", "in", exampleFlats), // In a real app: where("userId", "==", user.uid)
        where("status", "in", ["Due", "Pending Verification"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const billsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
        setOutstandingBills(billsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching bills:", error);
        toast({ title: "Could not fetch billing information", variant: "destructive" });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isAuthLoading, toast]);


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'destructive';
      case 'Due': return 'destructive';
      case 'Pending Verification': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSubmitProof = async (bill: Bill) => {
    if (!bill) return;

    if (!db || !user) {
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
        name: userProfile.name,
        flat: bill.flat,
        paymentFor: bill.description,
        amount: bill.amount,
        submittedAt: Timestamp.now(),
        status: "Pending Verification",
        userId: user.uid
      });
      
      // 2. Update the bill status
      const billRef = doc(db, "bills", bill.flat); // Assuming bill doc ID is the flat number
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
        
        <div className="md:col-span-1 space-y-6">
            {isLoading ? (
                <Skeleton className="h-48 w-full" />
            ) : outstandingBills.length > 0 ? (
                outstandingBills.map(bill => (
                <Card key={bill.id}>
                    <CardHeader>
                        <CardTitle>Outstanding Bill</CardTitle>
                        <CardDescription>Due: {bill.dueDate}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-baseline text-lg">
                            <span className="font-semibold">{bill.description}</span>
                            <span className="font-bold text-primary">Rs {bill.amount}</span>
                        </div>
                         <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
                    </CardContent>
                    <CardFooter>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                            <Button className="w-full" disabled={bill.status === 'Pending Verification'}>
                                {bill.status === 'Pending Verification' ? 'Verification in Progress' : 'Pay Now'}
                            </Button>
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
                                <Input id="name" value={userProfile.name} disabled />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="flat">Flat No.</Label>
                                <Input id="flat" value={bill.flat} disabled />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="paymentFor">Payment For</Label>
                                <Input id="paymentFor" value={bill.description} disabled />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input id="amount" value={`Rs ${bill.amount}`} disabled />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                                <Input id="screenshot" type="file" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full" onClick={() => handleSubmitProof(bill)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Submit for Verification
                                </Button>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
                ))
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Outstanding Bills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">All your bills are paid. Thank you!</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
