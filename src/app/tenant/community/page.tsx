
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, getDocs, addDoc, Timestamp, doc, setDoc, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { initialEvents } from "@/lib/mock-data";

type CommunityEvent = {
    id: string;
    title: string;
    date: string;
    location: string;
};

type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
};

export default function CommunityPage() {
    const { db } = useFirebase();
    const { toast } = useToast();
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        const setupAndFetchData = async () => {
            setIsLoading(true);

            // Set up events
            try {
                const eventsCollection = collection(db, "events");
                const eventsSnapshot = await getDocs(eventsCollection);
                if (eventsSnapshot.empty) {
                    for (const event of initialEvents) {
                        await addDoc(eventsCollection, event);
                    }
                }
            } catch (error) {
                console.error("Error setting up initial events:", error);
            }
            
            const eventsQuery = query(collection(db, "events"), orderBy("date", "desc"));
            const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
                setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityEvent)));
            });

            // Set up announcements (notices)
            const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
            const unsubAnnouncements = onSnapshot(noticesQuery, (snapshot) => {
                const announcementsList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        date: (data.createdAt as Timestamp).toDate().toLocaleDateString(),
                    };
                });
                setAnnouncements(announcementsList);
            });
            
            setIsLoading(false);

            return () => {
                unsubEvents();
                unsubAnnouncements();
            };
        };
        
        setupAndFetchData();

    }, [db, toast]);


  return (
    <>
      <PageHeader
        title="Community Hub"
        description="Stay connected with society events and announcements."
      />

      <Tabs defaultValue="announcements">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Join your neighbors for community fun.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    {isLoading ? (
                        [...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                    ) : events.length > 0 ? (
                        events.map(event => (
                            <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{event.title}</h4>
                                    <p className="text-sm text-muted-foreground">{event.date} - {event.location}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                         <p className="text-center text-muted-foreground py-4">No upcoming events.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="announcements">
             <Card>
                <CardHeader>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>Latest news from the society office.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {isLoading ? (
                        [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                    ) : announcements.length > 0 ? (
                        announcements.map(announcement => (
                            <div key={announcement.id} className="p-4 border rounded-lg">
                                <h4 className="font-semibold">{announcement.title}</h4>
                                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">Posted on: {announcement.date}</p>
                            </div>
                        ))
                    ) : (
                         <p className="text-center text-muted-foreground py-4">No recent announcements.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
