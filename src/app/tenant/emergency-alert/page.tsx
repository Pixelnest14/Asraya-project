
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Phone, Siren } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Alert = {
    id: string;
    message: string;
    timestamp: any;
};

export default function TenantEmergencyPage() {
    const { db } = useFirebase();
    const [alert, setAlert] = useState<Alert | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const emergencyContacts = [
        { name: "Society Security", number: "011-23456789" },
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
    
    return (
        <>
            <PageHeader
                title="Emergency Alerts"
                description="High-priority alerts and important contacts."
            />
            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <Siren className="h-6 w-6" />
                            Active Alerts
                        </CardTitle>
                        <CardDescription>
                            {isLoading ? "Checking for active alerts..." : alert ? "A high-priority alert has been issued." : "Currently, there are no active emergency alerts."}
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
        </>
    );
}
