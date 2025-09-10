
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Clock, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFirebase } from "@/components/firebase-provider";
import { collection, doc, onSnapshot, updateDoc, setDoc, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type LightZone = {
    id: string;
    name: string;
    status: "On" | "Off" | "On (Auto)";
    icon: "Lightbulb";
};

const initialLightZones: Omit<LightZone, 'id'>[] = [
    { name: "Lobby & Entrance", status: "On", icon: "Lightbulb" },
    { name: "Garden Area", status: "On (Auto)", icon: "Lightbulb" },
    { name: "1st Floor Corridor", status: "Off", icon: "Lightbulb" },
    { name: "2nd Floor Corridor", status: "On", icon: "Lightbulb" },
    { name: "3rd Floor Corridor", status: "Off", icon: "Lightbulb" },
    { name: "Parking Area", status: "On (Auto)", icon: "Lightbulb" },
];

export default function SmartLightsPage() {
    const { db } = useFirebase();
    const { toast } = useToast();
    const [lightZones, setLightZones] = useState<LightZone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        setIsLoading(true);

        const lightZonesCollection = collection(db, "lightZones");

        const unsubscribe = onSnapshot(lightZonesCollection, 
            (snapshot) => {
                if (snapshot.empty) {
                    // Pre-populate if collection is empty
                    const batch = [];
                    for (const zoneData of initialLightZones) {
                        const docRef = doc(lightZonesCollection, zoneData.name.replace(/\s+/g, '-').toLowerCase());
                        batch.push(setDoc(docRef, zoneData));
                    }
                    Promise.all(batch);
                } else {
                    const zonesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LightZone));
                    setLightZones(zonesData.sort((a, b) => a.name.localeCompare(b.name)));
                }
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching light zones:", error);
                toast({ title: "Error", description: "Could not fetch light zone data.", variant: "destructive" });
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [db, toast]);

    const handleToggle = async (id: string, currentStatus: LightZone['status']) => {
        if (!db) return;
        // Don't allow toggling for 'auto' zones in this UI
        if (currentStatus.includes("Auto")) {
            toast({ title: "Auto Zone", description: "This zone is controlled automatically." });
            return;
        }

        const newStatus = currentStatus === "On" ? "Off" : "On";
        const zoneRef = doc(db, "lightZones", id);

        try {
            await updateDoc(zoneRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating light zone:", error);
            toast({ title: "Update Failed", description: "Could not update light status.", variant: "destructive" });
        }
    };
    
    const lightsActiveCount = lightZones.filter(zone => zone.status.includes("On")).length;
    const totalZones = lightZones.length;

    const getIcon = (iconName: "Lightbulb") => {
        if (iconName === 'Lightbulb') return Lightbulb;
        return Lightbulb;
    }

    return (
        <>
            <PageHeader
                title="Smart Light Control"
                description="Remotely control and adjust the brightness of lights in common areas."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Lights Active</CardTitle>
                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{lightsActiveCount} / {totalZones} Zones</div> }
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
                        {isLoading ? (
                            [...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)
                        ) : (
                            lightZones.map((zone) => {
                                const Icon = getIcon(zone.icon);
                                const isChecked = zone.status.includes("On");
                                const isAuto = zone.status.includes("Auto");
                                return (
                                <Card key={zone.id}>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-6 w-6 ${isChecked ? "text-yellow-400" : "text-muted-foreground"}`} />
                                            <CardTitle className="text-base">{zone.name}</CardTitle>
                                        </div>
                                        <Switch 
                                            checked={isChecked} 
                                            onCheckedChange={() => handleToggle(zone.id, zone.status)}
                                            disabled={isAuto}
                                            aria-label={`Toggle ${zone.name}`}
                                        />
                                    </CardHeader>
                                    <CardFooter>
                                        <p className="text-xs text-muted-foreground">{zone.status}</p>
                                    </CardFooter>
                                </Card>
                            )})
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
