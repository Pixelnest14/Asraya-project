
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

type Complaint = {
  id: string;
  category: string;
  description: string;
  date: string;
  raisedBy: string;
  status: string;
};

export default function AdminComplaintsPage() {
  const { db } = useFirebase();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!db) return;
    setIsLoading(true);
    const unsubscribe = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const complaintsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          category: data.category,
          description: data.description,
          date: (data.date as Timestamp).toDate().toLocaleDateString(),
          raisedBy: data.userFlat || 'N/A', // Assuming userFlat is stored
          status: data.status,
        };
      });
      setComplaints(complaintsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [db]);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'destructive';
      case 'In Progress': return 'default';
      case 'Resolved': return 'secondary';
      default: return 'outline';
    }
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDialogOpen(true);
  };

  return (
    <>
      <PageHeader 
        title="Complaints Management"
        description="View, track, and manage all complaints raised by residents."
      >
        <div className="flex gap-2">
            <Input placeholder="Search complaints..." className="w-64" />
            <Button>Search</Button>
        </div>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Raised By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : (
                complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono">{complaint.id.substring(0, 6)}...</TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>{complaint.date}</TableCell>
                    <TableCell>{complaint.raisedBy}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              Full details of complaint ID: {selectedComplaint?.id.substring(0, 6)}...
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <Label className="font-semibold">Category:</Label>
                <p className="col-span-2">{selectedComplaint.category}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Label className="font-semibold">Date Raised:</Label>
                <p className="col-span-2">{selectedComplaint.date}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Label className="font-semibold">Raised By:</Label>
                <p className="col-span-2">{selectedComplaint.raisedBy}</p>
              </div>
               <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="font-semibold">Status:</Label>
                <p className="col-span-2">
                  <Badge variant={getStatusVariant(selectedComplaint.status)}>{selectedComplaint.status}</Badge>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Label className="font-semibold">Description:</Label>
                <p className="col-span-2 text-sm bg-muted p-2 rounded-md">{selectedComplaint.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            <Button>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
