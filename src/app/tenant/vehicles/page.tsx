
"use client"

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Trash2 } from "lucide-react";

const vehicles = [
    { number: "MH 12 AB 1234", type: "Car" },
    { number: "MH 12 CD 5678", type: "Motorcycle" },
];

export default function VehiclesPage() {
  return (
    <>
      <PageHeader
        title="Vehicle Registration"
        description="Add and manage your vehicles for parking access."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Register a New Vehicle</CardTitle>
                <CardDescription>Add your vehicle details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select>
                        <SelectTrigger id="vehicle-type">
                            <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vehicle-number">Vehicle Number</Label>
                    <Input id="vehicle-number" placeholder="e.g., MH14AB1234" />
                </div>
                <Button>
                    <Car className="mr-2 h-4 w-4" />
                    Register Vehicle
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Your Registered Vehicles</CardTitle>
                <CardDescription>Manage your registered vehicles.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle Number</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.map(vehicle => (
                            <TableRow key={vehicle.number}>
                                <TableCell className="font-mono">{vehicle.number}</TableCell>
                                <TableCell>{vehicle.type}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
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
