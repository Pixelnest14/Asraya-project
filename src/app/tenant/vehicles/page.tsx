
"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Trash2 } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, where, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Vehicle = {
  id: string;
  number: string;
  type: string;
  userId?: string;
};

export default function VehiclesPage() {
  const { db, user, isLoading: isAuthLoading } = useFirebase();
  const { toast } = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  useEffect(() => {
    if (!db || isAuthLoading) return;
    setIsLoading(true);

    const q = user
      ? query(collection(db, "vehicles"), where("userId", "==", user.uid))
      : collection(db, "vehicles");

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vehiclesData: Vehicle[] = [];
      querySnapshot.forEach((doc) => {
        vehiclesData.push({ id: doc.id, ...doc.data() } as Vehicle);
      });
      setVehicles(vehiclesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Could not fetch vehicle data.",
        variant: "destructive"
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isAuthLoading, toast]);

  const handleRegisterVehicle = async () => {
    if (!vehicleType || !vehicleNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a vehicle type and enter a number.",
        variant: "destructive",
      });
      return;
    }
    if (!db) {
        toast({ title: "Database not ready", variant: "destructive" });
        return;
    }

    try {
      await addDoc(collection(db, "vehicles"), {
        type: vehicleType,
        number: vehicleNumber,
        userId: user ? user.uid : "anonymous",
        createdAt: Timestamp.now(),
      });
      toast({
        title: "Vehicle Registered!",
        description: `${vehicleNumber} has been added to your list.`,
      });
      setVehicleNumber("");
      setVehicleType("");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Registration Failed",
        description: "Could not save your vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "vehicles", vehicleId));
      toast({
        title: "Vehicle Removed",
        description: "The vehicle has been removed from your list.",
      });
    } catch (error) {
        console.error("Error deleting vehicle: ", error);
        toast({
            title: "Error",
            description: "Could not remove the vehicle.",
            variant: "destructive"
        })
    }
  };


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
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger id="vehicle-type">
                            <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vehicle-number">Vehicle Number</Label>
                    <Input 
                        id="vehicle-number" 
                        placeholder="e.g., KA14AB1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                </div>
                <Button onClick={handleRegisterVehicle}>
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    <Skeleton className="w-full h-8" />
                                </TableCell>
                            </TableRow>
                        ) : vehicles.length > 0 ? (
                            vehicles.map(vehicle => (
                                <TableRow key={vehicle.id}>
                                    <TableCell className="font-mono">{vehicle.number}</TableCell>
                                    <TableCell>{vehicle.type}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(vehicle.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    You have not registered any vehicles.
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
