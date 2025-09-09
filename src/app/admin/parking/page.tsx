
import { PageHeader } from "@/components/page-header";
import { parkingSlots } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

export default function ParkingPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400';
      case 'Occupied':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-400';
      case 'Allotted':
        return 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-muted';
    }
  };

  const legendItems = [
    { status: 'Available', className: 'bg-green-500' },
    { status: 'Occupied', className: 'bg-yellow-500' },
    { status: 'Allotted', className: 'bg-blue-500' },
  ];

  return (
    <>
      <PageHeader
        title="Parking Management"
        description="A real-time map of the society's parking lot."
      />
      <Card>
        <CardHeader>
          <CardTitle>Parking Lot Status</CardTitle>
          <CardDescription>Click on an available slot to allot it to a resident.</CardDescription>
          <div className="flex items-center space-x-4 pt-4">
            {legendItems.map(item => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={cn("h-4 w-4 rounded-sm", item.className)}></div>
                <span className="text-sm text-muted-foreground">{item.status}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 md:gap-4">
            {parkingSlots.map(slot => (
              <div
                key={slot.id}
                className={cn(
                  "flex flex-col items-center justify-center p-2 border-2 rounded-lg aspect-square text-center cursor-pointer transition-colors hover:bg-muted/50",
                  getStatusClass(slot.status)
                )}
              >
                <div className="font-bold text-lg">{slot.id}</div>
                <Car className="h-5 w-5 my-1" />
                <div className="text-xs truncate">
                  {slot.status === 'Available' ? 'Available' : slot.allottedTo || slot.vehicle || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
