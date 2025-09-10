
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
    const { toast } = useToast();
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch events
                const eventsSnapshot = await getDocs(collection(db, "events"));
                const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityEvent));
                setEvents(eventsList);

                // Fetch announcements
                const announcementsSnapshot = await getDocs(collection(db, "notices"));
                const announcementsList = announcementsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        date: (data.date as Timestamp).toDate().toLocaleDateString(),
                    };
                });
                setAnnouncements(announcementsList);

            } catch (error) {
                console.error("Error fetching community data:", error);
                toast({
                    title: "Error",
                    description: "Could not load community data from the database.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [toast]);


  return (
    <>
      <PageHeader
        title="Community Hub"
        description="Stay connected with society events and announcements."
      />

      <Tabs defaultValue="events">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
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
                                <Button variant="outline">RSVP</Button>
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
