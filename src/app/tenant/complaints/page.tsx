
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { useFirebase } from "@/components/firebase-provider";

type Complaint = {
  id: string;
  category: string;
  description: string;
  date: string;
  status: string;
  userId?: string;
};

export default function TenantComplaintsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { db, user, isLoading: isAuthLoading } = useFirebase();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!db || isAuthLoading || !user) {
        setComplaints([]);
        return;
    };

    const q = query(collection(db, "complaints"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const complaintsData: Complaint[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        complaintsData.push({
          id: doc.id,
          category: data.category,
          description: data.description,
          date: (data.date as Timestamp).toDate().toLocaleDateString(),
          status: data.status,
          userId: data.userId,
        });
      });
      setComplaints(complaintsData);
    });

    return () => unsubscribe();
  }, [db, user, isAuthLoading]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'destructive';
      case 'In Progress': return 'default';
      case 'Resolved': return 'secondary';
      default: return 'outline';
    }
  };
  
  const handleSubmit = async () => {
    if (!category || !description) {
        toast({ title: "Please fill out all fields.", variant: "destructive" });
        return;
    }
    
    if (!db || !user) {
        toast({ title: "You must be logged in to file a complaint.", variant: "destructive" });
        return;
    }

    try {
      await addDoc(collection(db, "complaints"), {
        category,
        description,
        date: Timestamp.now(),
        status: "New",
        userId: user.uid,
        userFlat: "A-101" // Example, ideally this comes from user profile
      });

      toast({
          title: "Complaint Filed!",
          description: "Your complaint has been submitted and will be reviewed shortly.",
      });
      setOpen(false);
      setCategory("");
      setDescription("");
    } catch (error) {
       toast({
          title: "Error",
          description: "There was an error submitting your complaint.",
          variant: "destructive"
      });
      console.error("Error adding document: ", error);
    }
  }

  return (
    <>
      <PageHeader
        title="Complaints & Help Desk"
        description="File new complaints and track their status."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              File New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Complaint</DialogTitle>
              <DialogDescription>
                Describe your issue in detail. Our team will get back to you shortly.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="internet">Internet</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea 
                    id="description" 
                    placeholder="Please describe the issue." 
                    className="col-span-3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                 />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>Submit Complaint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>My Complaint History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAuthLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading complaints...</TableCell>
                </TableRow>
              ) : complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono">{complaint.id.substring(0, 6)}...</TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>{complaint.date}</TableCell>
                    <TableCell className="max-w-sm truncate">{complaint.description}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">You have not filed any complaints yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
