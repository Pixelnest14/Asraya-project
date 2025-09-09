import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { dashboardStats, recentComplaints } from "@/lib/mock-data";
import { Building2, Users, Wrench, ParkingCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
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
        <StatCard title="Open Complaints" value={dashboardStats.openComplaints} icon={Wrench} />
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
                {recentComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>{complaint.date}</TableCell>
                    <TableCell>{complaint.raisedBy}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
