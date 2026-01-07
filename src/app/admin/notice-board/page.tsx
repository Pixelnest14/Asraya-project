
"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, onSnapshot, deleteDoc, doc, Timestamp, query, orderBy, getDocs } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { initialEvents } from "@/lib/mock-data";

type Notice = {
    id: string;
    title: string;
    content: string;
    date: string;
};

type Event = {
    id: string;
    title: string;
    date: string;
    location: string;
};

export default function NoticeBoardPage() {
    const { db } = useFirebase();
    const { toast } = useToast();

    // Notices state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notices, setNotices] = useState<Notice[]>([]);
    
    // Events state
    const [events, setEvents] = useState<Event[]>([]);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        setIsLoading(true);
        
        const setupData = async () => {
            // Setup Notices
            const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
            const unsubNotices = onSnapshot(noticesQuery, (snapshot) => {
                const noticesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        date: (data.createdAt as Timestamp).toDate().toLocaleDateString(),
                    };
                });
                setNotices(noticesData);
            }, (error) => {
                console.error("Error fetching notices: ", error);
                toast({ title: "Error", description: "Could not fetch notices.", variant: "destructive" });
            });

            // Setup Events
            const eventsCollection = collection(db, "events");
            try {
                const eventsSnapshot = await getDocs(eventsCollection);
                if (eventsSnapshot.empty) {
                    for (const event of initialEvents) {
                        await addDoc(eventsCollection, event);
                    }
                }
            } catch (error) {
                console.error("Error seeding events:", error);
            }
            
            const eventsQuery = query(collection(db, "events"), orderBy("createdAt", "desc"));
            const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
                setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
            }, (error) => {
                console.error("Error fetching events:", error);
                toast({ title: "Error", description: "Could not fetch events.", variant: "destructive" });
            });
            
            setIsLoading(false);
            return () => {
                unsubNotices();
                unsubEvents();
            };
        }

        setupData();

    }, [db, toast]);

    const handlePostNotice = async () => {
        if (!title.trim() || !content.trim()) {
            toast({ title: "Please fill out both title and content.", variant: "destructive" });
            return;
        }
        if (!db) return;

        try {
            await addDoc(collection(db, "notices"), {
                title,
                content,
                createdAt: Timestamp.now(),
            });
            toast({ title: "Notice Posted!", description: "Your notice is now live for all residents." });
            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Error posting notice: ", error);
            toast({ title: "Error", description: "Could not post the notice.", variant: "destructive" });
        }
    };
    
    const handleDeleteNotice = async (noticeId: string) => {
        if (!db) return;
        if (confirm("Are you sure you want to delete this notice?")) {
            try {
                await deleteDoc(doc(db, "notices", noticeId));
                toast({ title: "Notice Deleted" });
            } catch (error) {
                console.error("Error deleting notice: ", error);
                toast({ title: "Error", description: "Could not delete the notice.", variant: "destructive" });
            }
        }
    };
    
    const handlePostEvent = async () => {
        if (!eventTitle.trim() || !eventDate.trim() || !eventLocation.trim()) {
            toast({ title: "Please fill out all event fields.", variant: "destructive" });
            return;
        }
        if (!db) return;

        try {
            await addDoc(collection(db, "events"), {
                title: eventTitle,
                date: eventDate,
                location: eventLocation,
                createdAt: Timestamp.now(),
            });
            toast({ title: "Event Created!", description: "The new event has been published." });
            setEventTitle("");
            setEventDate("");
            setEventLocation("");
        } catch (error) {
            console.error("Error posting event: ", error);
            toast({ title: "Error", description: "Could not create the event.", variant: "destructive" });
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!db) return;
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteDoc(doc(db, "events", eventId));
                toast({ title: "Event Deleted" });
            } catch (error) {
                console.error("Error deleting event: ", error);
                toast({ title: "Error", description: "Could not delete the event.", variant: "destructive" });
            }
        }
    };


    return (
        <>
            <PageHeader 
                title="Announcements & Events"
            />
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post a New Notice</CardTitle>
                            <CardDescription>Create and publish an announcement for all residents.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input 
                                    id="title" 
                                    placeholder="e.g., Important Maintenance Update" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea 
                                    id="content" 
                                    placeholder="Please provide the full details of the announcement." 
                                    rows={5}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlePostNotice}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Post Notice
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Create an Upcoming Event</CardTitle>
                            <CardDescription>Publish a new event for the community.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="event-title">Event Title</Label>
                                <Input 
                                    id="event-title" 
                                    placeholder="e.g., Annual Diwali Gala" 
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-date">Date & Time</Label>
                                <Input 
                                    id="event-date" 
                                    placeholder="e.g., Nov 10th, 2024 at 7:00 PM" 
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="event-location">Location</Label>
                                <Input 
                                    id="event-location" 
                                    placeholder="e.g., Clubhouse" 
                                    value={eventLocation}
                                    onChange={(e) => setEventLocation(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlePostEvent}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Create Event
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Published Notices</CardTitle>
                            <CardDescription>View and manage existing notices.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20" />)
                            ) : notices.length > 0 ? (
                                notices.map((notice) => (
                                <div key={notice.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                        <div>
                                            <h4 className="font-semibold">{notice.title}</h4>
                                            <p className="text-sm text-muted-foreground">Posted on: {notice.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" disabled>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDeleteNotice(notice.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No notices have been published yet.</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Events</CardTitle>
                            <CardDescription>View and manage existing events.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20" />)
                            ) : events.length > 0 ? (
                                events.map((event) => (
                                <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                        <div>
                                            <h4 className="font-semibold">{event.title}</h4>
                                            <p className="text-sm text-muted-foreground">{event.date} at {event.location}</p>
                                        </div>
                                        <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No events have been created yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
