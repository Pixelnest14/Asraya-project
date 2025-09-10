
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function EmergencyAlertPage() {
    const { toast } = useToast();
    const { db } = useFirebase();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendAlert = async () => {
        if (!message.trim()) {
            toast({ title: "Please enter an alert message.", variant: "destructive" });
            return;
        }
        if (!db) {
            toast({ title: "Database not available.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            await addDoc(collection(db, "emergencyAlerts"), {
                message,
                timestamp: Timestamp.now(),
                active: true,
            });
            toast({
                title: "Emergency Alert Sent!",
                description: "The alert has been broadcast to all residents.",
                variant: "destructive",
            });
            setMessage("");
        } catch (error) {
            console.error("Error sending alert: ", error);
            toast({ title: "Failed to send alert.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
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
                        <Textarea 
                            placeholder="Type your alert message here." 
                            id="message" 
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSendAlert} variant="destructive" className="w-full" disabled={isLoading}>
                        {isLoading ? "Broadcasting..." : "Broadcast Alert Now"}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
