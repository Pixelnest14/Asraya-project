
"use client";

import { PageHeader } from "@/components/page-header";
import { initialParkingSlots } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Car, PlusCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useFirebase } from "@/components/firebase-provider";
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type ParkingSlot = {
  id: string;
  status: 'Available' | 'Allotted' | 'Occupied';
  allottedTo: string | null;
};

export default function ParkingPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [flatNumber, setFlatNumber] = useState("");

  useEffect(() => {
    if (!db) return;

    const setupAndFetchSlots = async () => {
      setIsLoading(true);
      const slotsCollection = collection(db, "parkingSlots");
      try {
        for (const slotData of initialParkingSlots) {
          const docRef = doc(db, "parkingSlots", slotData.id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              status: slotData.status,
              allottedTo: slotData.allottedTo
            });
          }
        }
      } catch (error) {
        console.error("Error initializing parking slots:", error);
      }

      const unsubscribe = onSnapshot(slotsCollection, (snapshot) => {
        const slotsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParkingSlot));
        setParkingSlots(slotsData.sort((a,b) => a.id.localeCompare(b.id)));
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching parking slots:", error);
        setIsLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribePromise = setupAndFetchSlots();
    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [db]);

  const handleAllotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setFlatNumber("");
    setIsDialogOpen(true);
  };
  
  const handleConfirmAllotment = async () => {
    if (!db || !selectedSlot || !flatNumber.trim()) {
      toast({ title: "Please enter a flat number.", variant: "destructive" });
      return;
    }
    
    try {
      const slotRef = doc(db, "parkingSlots", selectedSlot.id);
      await updateDoc(slotRef, {
        status: "Allotted",
        allottedTo: flatNumber.trim().toUpperCase()
      });
      toast({ title: "Slot Allotted!", description: `Parking slot ${selectedSlot.id} has been allotted to ${flatNumber}.` });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error allotting slot:", error);
      toast({ title: "Failed to allot slot.", variant: "destructive" });
    }
  };

  const getStatusInfo = (slot: ParkingSlot) => {
    switch (slot.status) {
      case 'Available':
        return {
          cardClass: 'bg-green-900/30 border-green-500/50',
          iconClass: 'text-green-400',
          badgeVariant: 'secondary',
          badgeText: 'Available',
          button: <Button onClick={() => handleAllotClick(slot)}><PlusCircle /> Allot</Button>,
        };
      case 'Allotted':
      case 'Occupied':
        return {
          cardClass: 'bg-muted/50',
          iconClass: slot.status === 'Occupied' ? 'text-yellow-400' : 'text-primary',
          badgeVariant: 'outline',
          badgeText: 'Allotted',
          button: <Button variant="outline">Details</Button>,
        };
      default:
        return {
          cardClass: 'bg-muted/50',
          iconClass: '',
          badgeVariant: 'outline',
          badgeText: 'N/A',
          button: <Button variant="outline">Details</Button>,
        };
    }
  };

  const parkingOverview = useMemo(() => {
    return parkingSlots.reduce(
      (acc, slot) => {
        if (slot.status === 'Available') acc.available++;
        if (slot.status === 'Allotted') acc.allotted++;
        if (slot.status === 'Occupied') {
            acc.allotted++;
            acc.occupied++;
        }
        return acc;
      },
      { available: 0, allotted: 0, occupied: 0, total: parkingSlots.length }
    );
  }, [parkingSlots]);

  return (
    <>
      <PageHeader
        title="Parking Slot Management"
        description="A real-time overview of the society's parking lot."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)
          ) : (
            parkingSlots.map(slot => {
              const { cardClass, iconClass, badgeVariant, badgeText, button } = getStatusInfo(slot);
              return (
                <Card key={slot.id} className={cn("flex flex-col items-center justify-center p-4 text-center transition-colors", cardClass)}>
                  <CardHeader className="p-2">
                      <CardTitle className="text-2xl font-bold tracking-wider">{slot.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-3 p-2">
                      <Car className={cn("h-12 w-12", iconClass)} />
                      <Badge variant={badgeVariant}>{badgeText}</Badge>
                      {(slot.status === 'Allotted' || slot.status === 'Occupied') && (
                          <div className="text-xs text-muted-foreground h-8">
                              <p>To: {slot.allottedTo}</p>
                              {slot.status === 'Occupied' && <p>Vehicle Present</p>}
                          </div>
                      )}
                      {slot.status === 'Available' && <div className="h-8" />}
                  </CardContent>
                  <CardFooter className="p-0 mt-auto w-full">
                      {button}
                  </CardFooter>
                </Card>
              )
            })
          )}
        </div>

        <div className="lg:col-span-1 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>Parking Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">Available for Allotment:</span>
                      <span className="font-bold">{parkingOverview.available}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">Total Allotted:</span>
                      <span className="font-bold">{parkingOverview.allotted}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">Currently Occupied:</span>
                      <span className="font-bold">{parkingOverview.occupied}</span>
                  </div>
                   <div className="flex justify-between items-center text-lg border-t pt-4 mt-4">
                      <span className="text-muted-foreground">Total Slots:</span>
                      <span className="font-bold">{parkingOverview.total}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allot Parking Slot {selectedSlot?.id}</DialogTitle>
            <DialogDescription>
              Assign this parking slot to a resident by entering their flat number.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="flat-number">Flat Number</Label>
              <Input 
                id="flat-number" 
                placeholder="e.g., A-101" 
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAllotment}>Confirm Allotment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
