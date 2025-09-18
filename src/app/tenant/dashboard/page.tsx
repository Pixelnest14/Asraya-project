
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { CreditCard, Wrench, Package, Shield, CalendarDays, Megaphone, Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/components/firebase-provider";
import { collection, query, where, onSnapshot, orderBy, limit, Timestamp, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Announcement = {
    id: string;
    title: string;
    content: string;
};

type CommunityEvent = {
    id: string;
    title: string;
    date: string;
    location: string;
};

type EmergencyAlert = {
    id: string;
    message: string;
    timestamp: any;
};


export default function TenantDashboard() {
    const { db, user, isLoading: isAuthLoading } = useFirebase();
    
    // State for dashboard cards
    const [outstandingDues, setOutstandingDues] = useState<string | null>(null);
    const [activeComplaints, setActiveComplaints] = useState<number | null>(null);
    
    // State for alerts, announcements and events
    const [alert, setAlert] = useState<EmergencyAlert | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // In a real app, this would be fetched from the user's profile
    const userFlat = "A-101";

    useEffect(() => {
        if (isAuthLoading) return;
        setIsLoading(true);

        const subscriptions: (() => void)[] = [];

        if (db) {
            // Fetch latest active emergency alert
            const alertsQuery = query(collection(db, "emergencyAlerts"), where("active", "==", true), limit(1));
            subscriptions.push(onSnapshot(alertsQuery, (snapshot) => {
                if (!snapshot.empty) {
                    const latestAlert = snapshot.docs[0];
                    setAlert({ id: latestAlert.id, ...latestAlert.data() } as EmergencyAlert);
                } else {
                    setAlert(null);
                }
            }));

            // Fetch latest announcements
            const announcementsQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(2));
            subscriptions.push(onSnapshot(announcementsQuery, (snapshot) => {
                setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
            }));

            // Fetch upcoming events
            const eventsQuery = query(collection(db, "events"), orderBy("date", "asc"), limit(2));
            subscriptions.push(onSnapshot(eventsQuery, (snapshot) => {
                setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityEvent)));
            }));
        }

        if (db && user) {
            // Fetch outstanding dues for the logged-in user
            // We use a mock flat number here, but in a real app this would come from the user's profile
            const billRef = doc(db, "bills", userFlat);
            subscriptions.push(onSnapshot(billRef, (doc) => {
                if (doc.exists() && doc.data().status === 'Due') {
                    setOutstandingDues(`Rs ${doc.data().amount}`);
                } else {
                    setOutstandingDues("Rs 0");
                }
            }));
            
            // Fetch active complaints count for the logged-in user
            const complaintsQuery = query(collection(db, "complaints"), where("userId", "==", user.uid), where("status", "in", ["New", "In Progress"]));
            subscriptions.push(onSnapshot(complaintsQuery, (snapshot) => {
                setActiveComplaints(snapshot.size);
            }));
        } else {
            // Set default values if not logged in
            setOutstandingDues("Rs 0");
            setActiveComplaints(0);
        }

        const timer = setTimeout(() => setIsLoading(false), 1200); // Prevent flicker
        subscriptions.push(() => clearTimeout(timer));

        return () => {
            subscriptions.forEach(unsub => unsub());
        };

    }, [db, user, isAuthLoading, userFlat]);
    
    const dashboardTitle = user?.displayName ? `${user.displayName.split(' ')[0]}'s Dashboard` : "My Dashboard";

  return (
    <>
      <PageHeader title={dashboardTitle} description="Your personalized summary of society life." />
      
       {isLoading ? (
        <Skeleton className="h-24 mb-6" />
      ) : alert ? (
        <Alert variant="destructive" className="mb-6">
            <Siren className="h-4 w-4" />
            <AlertTitle>Emergency Alert!</AlertTitle>
            <AlertDescription>
                {alert.message} - <span className="text-xs">Issued at: {new Date(alert.timestamp.seconds * 1000).toLocaleTimeString()}</span>
            </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Outstanding Dues" value={outstandingDues ?? <Skeleton className="h-6 w-24" />} icon={CreditCard} />
        <StatCard title="Active Complaints" value={activeComplaints ?? <Skeleton className="h-6 w-10" />} icon={Wrench} />
        <StatCard title="Packages" value="2" icon={Package} description="Ready for pickup" />
        <StatCard title="Security" value="All Clear" icon={Shield} description="No active alerts" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5" />Announcements</CardTitle>
            <CardDescription>Latest news from the society office.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
                <><Skeleton className="h-16" /><Skeleton className="h-16" /></>
            ) : announcements.length > 0 ? (
                announcements.map(announcement => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center">No new announcements.</p>
            )}
            <Button variant="link" asChild><Link href="/tenant/community">View All</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Upcoming Events</CardTitle>
            <CardDescription>Join your neighbors for community fun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {isLoading ? (
                <><Skeleton className="h-16" /><Skeleton className="h-16" /></>
            ) : events.length > 0 ? (
                events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date} - {event.location}</p>
                        </div>
                        <Button variant="outline">RSVP</Button>
                    </div>
                ))
            ) : (
                 <p className="text-muted-foreground text-center">No upcoming events.</p>
            )}
             <Button variant="link" asChild><Link href="/tenant/community">View All</Link></Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
