
"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, onSnapshot, deleteDoc, doc, Timestamp, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Notice = {
    id: string;
    title: string;
    content: string;
    date: string;
};

export default function NoticeBoardPage() {
    const { db } = useFirebase();
    const { toast } = useToast();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        setIsLoading(true);
        
        const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
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
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching notices: ", error);
            toast({ title: "Error", description: "Could not fetch notices.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();

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


    return (
        <>
            <PageHeader 
                title="Notice Board Management"
            />
            <div className="grid md:grid-cols-2 gap-8 items-start">
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
                        <Button onClick={handlePostNotice}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post Notice
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Published Notices</CardTitle>
                        <CardDescription>View and manage existing notices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)
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
            </div>
        </>
    );
}
