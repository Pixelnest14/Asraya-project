
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { dashboardStats } from "@/lib/mock-data";
import { Building2, Users, Wrench, ParkingCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Complaint = {
  id: string;
  category: string;
  date: string;
  raisedBy: string;
  status: string;
};

export default function AdminDashboard() {
  const { db } = useFirebase();
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [openComplaintsCount, setOpenComplaintsCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    setIsLoading(true);

    const complaintsQuery = query(
        collection(db, "complaints"),
        orderBy("date", "desc"),
        limit(5)
    );

    const unsubscribeComplaints = onSnapshot(complaintsQuery, (snapshot) => {
      const complaintsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          category: data.category,
          date: (data.date as Timestamp).toDate().toLocaleDateString(),
          raisedBy: data.userFlat || 'N/A',
          status: data.status,
        };
      });
      setRecentComplaints(complaintsData);
      setIsLoading(false);
    });
    
    // Query for open complaints count
    const openComplaintsQuery = query(collection(db, "complaints"), where("status", "in", ["New", "In Progress"]));
    
    const unsubscribeCount = onSnapshot(openComplaintsQuery, (snapshot) => {
        setOpenComplaintsCount(snapshot.size);
    });

    return () => {
        unsubscribeComplaints();
        unsubscribeCount();
    }
  }, [db]);


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'destructive';
      case 'In Progress': return 'default';
      case 'Resolved': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader title="Admin Dashboard" description="A high-level overview of critical society metrics." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Apartments" value={dashboardStats.totalApartments} icon={Building2} />
        <StatCard title="Resident Count" value={dashboardStats.residentCount} icon={Users} />
        <StatCard title="Open Complaints" value={openComplaintsCount === null ? "..." : openComplaintsCount} icon={Wrench} />
        <StatCard title="Parking Available" value={`${dashboardStats.parkingAvailable} Slots`} icon={ParkingCircle} />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : recentComplaints.length > 0 ? (
                  recentComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-mono">{complaint.id.substring(0,6)}...</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell>{complaint.raisedBy}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No complaints have been filed yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
