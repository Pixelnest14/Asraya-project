import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, ShieldCheck, ShieldOff, Video } from "lucide-react";

export default function SmartParkingPage() {
    return (
        <>
            <PageHeader
                title="Smart Parking System"
                description="Manage guest parking barriers and view real-time occupancy."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Car className="h-6 w-6" /> Guest Parking Barrier
                        </CardTitle>
                        <CardDescription>
                            Control the main entry barrier for guest vehicles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Button className="w-full" variant="secondary">
                             <ShieldCheck className="mr-2 h-4 w-4" />
                            Allow Entry
                        </Button>
                        <Button className="w-full" variant="destructive">
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Deny Entry
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Car className="h-6 w-6" /> Occupancy Status
                        </CardTitle>
                        <CardDescription>
                            Real-time guest parking occupancy.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">8 / 15</p>
                        <p className="text-muted-foreground">Slots Occupied</p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
