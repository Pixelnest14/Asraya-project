import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Clock, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SmartLightsPage() {
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
        </>
    );
}
