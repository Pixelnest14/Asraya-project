
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShieldAlert, Phone, Siren } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, query, where, orderBy, limit, addDoc, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type Alert = {
    id: string;
    message: string;
    timestamp: any;
};

export default function TenantEmergencyPage() {
    const { db, user } = useFirebase();
    const { toast } = useToast();
    const [alert, setAlert] = useState<Alert | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tenantMessage, setTenantMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emergencyContacts = [
        { name: "Society Security", number: "+91 45638724419" },
        { name: "Local Police", number: "100" },
        { name: "Fire Department", number: "101" },
        { name: "Ambulance", number: "102" },
    ];

    useEffect(() => {
        if (!db) return;

        setIsLoading(true);
        const alertsQuery = query(
            collection(db, "emergencyAlerts"),
            where("active", "==", true),
            limit(1)
        );

        const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
            if (!snapshot.empty) {
                const latestAlert = snapshot.docs[0];
                setAlert({ id: latestAlert.id, ...latestAlert.data() } as Alert);
            } else {
                setAlert(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching emergency alerts: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const handleSendAlert = async () => {
        if (!tenantMessage.trim()) {
            toast({ title: "Please enter a message for your alert.", variant: "destructive" });
            return;
        }
        if (!db || !user) {
            toast({ title: "You must be logged in to send an alert.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "emergencyAlerts"), {
                message: tenantMessage,
                timestamp: Timestamp.now(),
                active: true,
                raisedBy: {
                    uid: user.uid,
                    name: user.displayName || 'Unknown Tenant',
                    flat: 'A-101' // Example data
                }
            });
            toast({
                title: "Emergency Alert Sent!",
                description: "The society administration has been notified.",
                variant: "destructive",
            });
            setTenantMessage("");
        } catch (error) {
            console.error("Error sending tenant alert:", error);
            toast({ title: "Failed to send alert.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <PageHeader
                title="Emergency Hub"
                description="Raise alerts and find important contacts."
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Siren className="h-6 w-6" />
                                Raise an Alert
                            </CardTitle>
                            <CardDescription>
                                Need immediate help? Send an alert to the society office. For use in genuine emergencies only.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid w-full gap-1.5">
                                <Label htmlFor="message">Your Emergency Message</Label>
                                <Textarea 
                                    placeholder="e.g., Fire detected in Block C, 2nd floor." 
                                    id="message" 
                                    rows={4}
                                    value={tenantMessage}
                                    onChange={(e) => setTenantMessage(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSendAlert} variant="destructive" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Emergency Alert"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-6 w-6" />
                                Emergency Contacts
                            </CardTitle>
                            <CardDescription>
                                Quick access to important numbers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {emergencyContacts.map(contact => (
                                <div key={contact.name} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <span className="font-medium">{contact.name}</span>
                                    <a href={`tel:${contact.number}`} className="font-mono text-primary font-semibold tracking-wider">{contact.number}</a>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Siren className="h-6 w-6" />
                                Active Admin Alerts
                            </CardTitle>
                            <CardDescription>
                                {isLoading ? "Checking for active alerts..." : alert ? "A high-priority alert has been issued by the admin." : "No active alerts from the admin."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-24" />
                            ) : alert ? (
                                <div className="text-center p-8 bg-destructive/10 rounded-lg">
                                    <p className="text-lg font-semibold text-destructive-foreground">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Issued on: {new Date(alert.timestamp.seconds * 1000).toLocaleString()}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground p-8">
                                    <ShieldAlert className="mx-auto h-12 w-12 mb-4" />
                                    <p>All Clear</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
