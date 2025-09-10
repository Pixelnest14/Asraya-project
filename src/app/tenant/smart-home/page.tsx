"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Lightbulb, Car, ShieldCheck, CheckCircle, Clock, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SmartHomePage() {
    const { toast } = useToast();

    const handleRegisterGuest = () => {
        toast({
            title: "Guest Vehicle Registered",
            description: "An entry pass has been sent to your guest for today.",
        });
    }

    const lightZones = [
        { name: "Lobby & Entrance", status: "On", icon: Lightbulb },
        { name: "Corridors - Block A", status: "Off", icon: Lightbulb },
        { name: "Corridors - Block B", status: "On", icon: Lightbulb },
        { name: "Garden & Pathway", status: "On (Auto)", icon: Lightbulb },
        { name: "Clubhouse Exterior", status: "Off", icon: Lightbulb },
        { name: "Parking Lot", status: "On (Auto)", icon: Lightbulb },
    ];

  return (
    <>
      <PageHeader
        title="My Smart Home"
        description="Control your home's smart devices from anywhere."
      />
      <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold font-headline mb-4">Smart Light System</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Lights Active</CardTitle>
                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3 / 6 Zones</div>
                        <p className="text-xs text-muted-foreground">Currently powered on</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Scenes</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2 Active</div>
                        <p className="text-xs text-muted-foreground">Evening & Night</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Global Control</CardTitle>
                        <Sun className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button className="flex-1" variant="outline">All On</Button>
                        <Button className="flex-1" variant="destructive">All Off</Button>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Light Zones</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {lightZones.map((zone) => (
                            <Card key={zone.name}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                         <zone.icon className={`h-6 w-6 ${zone.status.includes("On") ? "text-yellow-400" : "text-muted-foreground"}`} />
                                         <CardTitle className="text-base">{zone.name}</CardTitle>
                                    </div>
                                    <Switch checked={zone.status.includes("On")} />
                                </CardHeader>
                                <CardFooter>
                                    <p className="text-xs text-muted-foreground">{zone.status}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>

         <div>
            <h2 className="text-xl font-bold font-headline mb-4">Smart Parking System</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Car className="h-6 w-6" /> My Parking Slot
                        </CardTitle>
                        <CardDescription>
                            Your allotted parking slot status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">A-101</p>
                        <div className="flex items-center gap-2 text-green-500 mt-2">
                            <CheckCircle className="h-5 w-5" />
                            <p className="font-semibold">Vehicle Present</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <ShieldCheck className="h-6 w-6" /> Guest Parking
                        </CardTitle>
                        <CardDescription>
                            Register a guest's vehicle for temporary parking access.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Button className="w-full" onClick={handleRegisterGuest}>
                           Register Guest Vehicle
                       </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}
