
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Trash2 } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { collection, addDoc, onSnapshot, Timestamp, doc, updateDoc, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Alert = {
    id: string;
    message: string;
    timestamp: Timestamp;
    active: boolean;
};

export default function EmergencyAlertPage() {
    const { toast } = useToast();
    const { db } = useFirebase();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
    const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);

    useEffect(() => {
        if (!db) return;
        
        const q = query(collection(db, "emergencyAlerts"), where("active", "==", true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
            setActiveAlerts(alertsData);
            setIsLoadingAlerts(false);
        });

        return () => unsubscribe();
    }, [db]);

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

    const handleDeactivateAlert = async (alertId: string) => {
        if (!db) return;
        try {
            const alertRef = doc(db, "emergencyAlerts", alertId);
            await updateDoc(alertRef, { active: false });
            toast({
                title: "Alert Deactivated",
                description: "The emergency alert has been cleared.",
            });
        } catch (error) {
            console.error("Error deactivating alert: ", error);
            toast({ title: "Failed to deactivate alert.", variant: "destructive" });
        }
    };

    return (
        <>
            <PageHeader
                title="Emergency Alert System"
                description="Broadcast and manage urgent alerts for all residents."
            />
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <Card>
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Active Alerts</CardTitle>
                        <CardDescription>View and manage currently active alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingAlerts ? (
                            <Skeleton className="h-20" />
                        ) : activeAlerts.length > 0 ? (
                            activeAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border bg-destructive/10">
                                    <div>
                                        <p className="font-semibold text-destructive-foreground">{alert.message}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Sent: {alert.timestamp.toDate().toLocaleString()}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleDeactivateAlert(alert.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Deactivate
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-4">No active alerts.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
