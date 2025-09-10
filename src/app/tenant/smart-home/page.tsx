"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Lightbulb, Car, ShieldCheck, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function SmartHomePage() {
    const { toast } = useToast();

    const handleRegisterGuest = () => {
        toast({
            title: "Guest Vehicle Registered",
            description: "An entry pass has been sent to your guest for today.",
        });
    }

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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lightbulb className="h-6 w-6 text-yellow-400" />
                            <CardTitle className="text-lg">Living Room</CardTitle>
                        </div>
                        <Switch defaultChecked />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Brightness</label>
                            <Slider defaultValue={[75]} max={100} step={1} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lightbulb className="h-6 w-6 text-muted-foreground" />
                            <CardTitle className="text-lg">Bedroom</CardTitle>
                        </div>
                        <Switch />
                    </CardHeader>
                     <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Brightness</label>
                            <Slider defaultValue={[0]} max={100} step={1} disabled />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lightbulb className="h-6 w-6 text-yellow-400" />
                            <CardTitle className="text-lg">Kitchen</CardTitle>
                        </div>
                        <Switch defaultChecked />
                    </CardHeader>
                     <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Brightness</label>
                            <Slider defaultValue={[50]} max={100} step={1} />
                        </div>
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
