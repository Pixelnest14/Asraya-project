
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { billings as mockBillings } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase-provider";
import { collection, addDoc, onSnapshot, query, where, getDocs, setDoc, doc } from "firebase/firestore";

type Billing = {
  id: string;
  flat: string;
  block: string;
  status: 'Paid' | 'Pending Verification' | 'Due';
};

export default function BillingPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const [billings, setBillings] = useState<Billing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    // A simple representation of all apartments
    const allApartments = [
        { flat: "A-101", block: "A" }, { flat: "A-102", block: "A" },
        { flat: "B-201", block: "B" }, { flat: "B-202", block: "B" },
        { flat: "C-301", block: "C" }, { flat: "C-302", block: "C" },
    ];

    const unsubscribe = onSnapshot(collection(db, "bills"), (snapshot) => {
        const billsData = new Map(snapshot.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as Billing]));
        
        const combinedBillings = allApartments.map(apt => {
            const bill = billsData.get(apt.flat);
            return {
                id: apt.flat,
                flat: apt.flat,
                block: apt.block,
                status: bill ? bill.status : 'Due',
            };
        });

        setBillings(combinedBillings);
        setIsLoading(false);
    });

    return () => unsubscribe();

  }, [db]);


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending Verification': return 'secondary';
      case 'Due': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSendReminder = async (flat: string) => {
    if (!db) {
        toast({ title: "Database error", variant: "destructive" });
        return;
    }

    try {
        // This ensures a bill document exists for the tenant to see.
        // If it already exists, this does nothing, which is fine.
        const billRef = doc(db, "bills", flat);
        await setDoc(billRef, {
            flat: flat,
            amount: 2500,
            description: "Quarterly Maintenance Fee",
            dueDate: "End of the Month",
            status: "Due"
        }, { merge: true });

        toast({
            title: "Reminder Sent!",
            description: `A payment reminder has been sent to flat ${flat}.`,
        });
    } catch (error) {
        console.error("Error sending reminder:", error);
        toast({ title: "Failed to send reminder", variant: "destructive" });
    }
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
                      disabled={billing.status !== 'Due'}
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
