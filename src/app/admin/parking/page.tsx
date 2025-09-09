
"use client";

import { PageHeader } from "@/components/page-header";
import { parkingSlots } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Car, PlusCircle } from "lucide-react";
import { useMemo } from "react";

type ParkingSlot = (typeof parkingSlots)[0];

export default function ParkingPage() {
  
  const getStatusInfo = (slot: ParkingSlot) => {
    switch (slot.status) {
      case 'Available':
        return {
          cardClass: 'bg-green-900/30 border-green-500/50',
          iconClass: 'text-green-400',
          badgeVariant: 'secondary',
          badgeText: 'Available',
          button: <Button><PlusCircle /> Allot</Button>,
        };
      case 'Allotted':
        return {
          cardClass: 'bg-muted/50',
          iconClass: 'text-red-500',
          badgeVariant: 'outline',
          badgeText: 'Allotted',
          button: <Button variant="outline">Details</Button>,
        };
      case 'Occupied':
        return {
            cardClass: 'bg-muted/50',
            iconClass: 'text-red-500',
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
      { available: 0, allotted: 0, occupied: 0 }
    );
  }, []);

  return (
    <>
      <PageHeader
        title="Parking Slot Management"
        description="A real-time overview of the society's parking lot."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Parking Slots Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {parkingSlots.map(slot => {
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
                        <div className="text-xs text-muted-foreground">
                            <p>To: {slot.allottedTo}</p>
                            {slot.status === 'Occupied' && <p>Vehicle Present</p>}
                        </div>
                    )}
                </CardContent>
                <div className="mt-auto w-full">
                    {button}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Parking Overview */}
        <div className="lg:col-span-1 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>Parking Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
