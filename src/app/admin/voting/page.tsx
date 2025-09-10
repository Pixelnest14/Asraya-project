
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, RefreshCw, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, orderBy, getDocs } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type PollOption = {
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  status: 'Active' | 'Closed';
  options: PollOption[];
  totalVotes: number;
  createdAt: Timestamp;
};

// Function to create a sample poll
const createSamplePoll = async (db) => {
    try {
        await addDoc(collection(db, "polls"), {
            question: "Should we get new equipment for the gym?",
            options: [
                { text: "Yes, definitely!", votes: 0 },
                { text: "No, the current equipment is fine.", votes: 0 }
            ],
            status: "Active",
            totalVotes: 0,
            createdAt: Timestamp.now(),
        });
        console.log("Sample poll created.");
    } catch (error) {
        console.error("Error creating sample poll: ", error);
    }
};

export default function AdminVotingPage() {
    const { toast } = useToast();
    const { db } = useFirebase();

    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    useEffect(() => {
        if (!db) return;

        const setupAndFetchPolls = async () => {
            setIsLoading(true);
            const pollsCollection = collection(db, "polls");

            // Check if the collection is empty and create a sample if it is
            try {
                const initialSnapshot = await getDocs(pollsCollection);
                if (initialSnapshot.empty) {
                    await createSamplePoll(db);
                }
            } catch (error) {
                console.error("Error checking for initial polls:", error);
            }

            // Set up the real-time listener
            const pollsQuery = query(pollsCollection, orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(pollsQuery, (snapshot) => {
                const pollsData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        question: data.question,
                        status: data.status,
                        options: data.options || [],
                        totalVotes: data.totalVotes || 0,
                        createdAt: data.createdAt
                    } as Poll;
                });
                setPolls(pollsData);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching polls: ", error);
                toast({ title: "Error fetching polls", variant: "destructive" });
                setIsLoading(false);
            });
            return unsubscribe;
        };
        
        const unsubscribePromise = setupAndFetchPolls();
        
        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (unsubscribe) {
                    unsubscribe();
                }
            });
        };
    }, [db, toast]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, ""]);
        }
    };
    
    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = [...options];
            newOptions.splice(index, 1);
            setOptions(newOptions);
        }
    };

    const handleCreatePoll = async () => {
        if (!db) {
            toast({ title: "Database connection not available.", variant: "destructive" });
            return;
        }
        if (!question.trim()) {
            toast({ title: "Please enter a poll question.", variant: "destructive" });
            return;
        }
        const validOptions = options.map(o => o.trim()).filter(o => o !== "");
        if (validOptions.length < 2) {
            toast({ title: "Please provide at least two poll options.", variant: "destructive" });
            return;
        }

        try {
            await addDoc(collection(db, "polls"), {
                question,
                options: validOptions.map(opt => ({ text: opt, votes: 0 })),
                status: "Active",
                totalVotes: 0,
                createdAt: Timestamp.now(),
            });
            toast({ title: "Poll Created!", description: "The new poll is now live." });
            // Reset form
            setQuestion("");
            setOptions(["", ""]);
        } catch (error) {
            console.error("Error creating poll: ", error);
            toast({ title: "Error", description: "Could not create the poll.", variant: "destructive" });
        }
    };

    const handleToggleStatus = async (pollId: string, currentStatus: "Active" | "Closed") => {
        if (!db) return;
        const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
        try {
            await updateDoc(doc(db, "polls", pollId), { status: newStatus });
            toast({
                title: "Poll Status Updated!",
                description: `The poll has been ${newStatus.toLowerCase()}.`,
            });
        } catch (error) {
            console.error("Error updating poll status: ", error);
            toast({ title: "Error", description: "Could not update poll status.", variant: "destructive" });
        }
    };

    const handleDeletePoll = async (pollId: string) => {
        if (!db) return;
        if (confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "polls", pollId));
                toast({ title: "Poll Deleted", variant: "destructive" });
            } catch (error) {
                console.error("Error deleting poll: ", error);
                toast({ title: "Error", description: "Could not delete poll.", variant: "destructive" });
            }
        }
    };
    
    return (
        <>
            <PageHeader
                title="Voting Management"
                description="Create, manage, and view results of community polls."
            />
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Create Poll Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Poll</CardTitle>
                        <CardDescription>Create and publish a new poll for all residents.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Poll Question</Label>
                            <Input id="question" placeholder="e.g., Should we change gym timings?" value={question} onChange={e => setQuestion(e.target.value)} />
                        </div>
                        {options.map((option, index) => (
                             <div key={index} className="space-y-2">
                                <Label htmlFor={`option${index + 1}`}>Option {index + 1}</Label>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        id={`option${index + 1}`} 
                                        placeholder={index < 2 ? "Required" : "Optional"} 
                                        value={option}
                                        onChange={e => handleOptionChange(index, e.target.value)}
                                    />
                                    {index > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                                            <XCircle className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {options.length < 4 && (
                            <Button variant="outline" size="sm" onClick={addOption}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                            </Button>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleCreatePoll}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Poll
                        </Button>
                    </CardFooter>
                </Card>

                {/* Polls Overview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Polls Overview</CardTitle>
                            <CardDescription>View and manage existing polls.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
                            {isLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-32" />
                                    <Skeleton className="h-32" />
                                </div>
                            ) : polls.length > 0 ? (
                                polls.map((poll) => (
                                <div key={poll.id} className="p-4 rounded-lg border bg-muted/30 mb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-semibold font-headline">{poll.question}</h4>
                                            <div className="text-sm">
                                                Status: <Badge variant={poll.status === 'Active' ? 'default' : 'secondary'}>{poll.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline"
                                                size="sm" 
                                                onClick={() => handleToggleStatus(poll.id, poll.status)}
                                                className="gap-1"
                                            >
                                                {poll.status === 'Active' ? <XCircle className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                                                {poll.status === 'Active' ? 'Close' : 'Re-open'}
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDeletePoll(poll.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {poll.options.map((option, index) => {
                                            const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                                            return (
                                                <div key={index} className="space-y-1">
                                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                        <span>{option.text}</span>
                                                        <span className="font-medium text-foreground">{percentage.toFixed(0)}% ({option.votes} votes)</span>
                                                    </div>
                                                    <Progress value={percentage} className="h-2" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No polls have been created yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

    