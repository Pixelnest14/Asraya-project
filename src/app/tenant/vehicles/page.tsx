import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const vehicles = [
    { number: "MH 12 AB 1234", type: "Car", sticker: "Issued" },
    { number: "MH 12 CD 5678", type: "Bike", sticker: "Pending" },
];

export default function VehiclesPage() {
  return (
    <>
      <PageHeader
        title="My Vehicles"
        description="Manage your registered vehicles and parking stickers."
      >
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Vehicle
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Registered Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vehicle Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Sticker Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.map(vehicle => (
                        <TableRow key={vehicle.number}>
                            <TableCell className="font-mono">{vehicle.number}</TableCell>
                            <TableCell>{vehicle.type}</TableCell>
                            <TableCell>{vehicle.sticker}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm">Remove</Button>
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
