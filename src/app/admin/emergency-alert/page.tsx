"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";

export default function EmergencyAlertPage() {
    const { toast } = useToast();

    const handleSendAlert = () => {
        toast({
            title: "Emergency Alert Sent!",
            description: "The alert has been broadcast to all residents.",
            variant: "destructive",
        });
    }

    return (
        <>
            <PageHeader
                title="Emergency Alert System"
                description="Broadcast urgent alerts to all residents instantly."
            />
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="text-destructive h-6 w-6" />
                        Compose Alert
                    </CardTitle>
                    <CardDescription>
                        This message will be sent as a high-priority notification to all residents. Use with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Alert Message</Label>
                        <Textarea placeholder="Type your alert message here." id="message" rows={5} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSendAlert} variant="destructive" className="w-full">
                        Broadcast Alert Now
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
