import { PageHeader } from "@/components/page-header";
import { recentComplaints } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminComplaintsPage() {
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
              {recentComplaints.concat(recentComplaints).map((complaint, index) => (
                <TableRow key={`${complaint.id}-${index}`}>
                  <TableCell>C{String(index + 1).padStart(3, '0')}</TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>{complaint.date}</TableCell>
                  <TableCell>{complaint.raisedBy}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
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
