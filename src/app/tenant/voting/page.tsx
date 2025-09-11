
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, doc, setDoc, getDoc, updateDoc, increment, query, orderBy, Timestamp } from "firebase/firestore";
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

export default function TenantVotingPage() {
    const { toast } = useToast();
    const { db, user, isLoading: isAuthLoading } = useFirebase();

    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [votedPolls, setVotedPolls] = useState<string[]>([]);

    useEffect(() => {
        if (!db) return;
        setIsLoading(true);
        const pollsQuery = query(collection(db, "polls"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(pollsQuery, (snapshot) => {
            const pollsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
            setPolls(pollsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching polls: ", error);
            toast({ title: "Error", description: "Could not fetch polls.", variant: "destructive" });
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [db, toast]);

    useEffect(() => {
        if (!user || isAuthLoading || polls.length === 0) return;

        const checkIfVoted = async () => {
            if (!db) return;
            const newVotedPolls: string[] = [];
            for (const poll of polls) {
                const voteDocRef = doc(db, "polls", poll.id, "votes", user.uid);
                const voteDoc = await getDoc(voteDocRef);
                if (voteDoc.exists()) {
                    newVotedPolls.push(poll.id);
                }
            }
            setVotedPolls(newVotedPolls);
        };
        checkIfVoted();
    }, [user, isAuthLoading, polls, db]);

    const handleVote = async (pollId: string) => {
        if (!user) {
            toast({ title: "Please log in to vote.", variant: "destructive" });
            return;
        }
        if (!db) {
            toast({ title: "Database not available.", variant: "destructive" });
            return;
        }

        const selectedOptionText = selectedOptions[pollId];
        if (!selectedOptionText) {
            toast({ title: "Please select an option to vote.", variant: "destructive" });
            return;
        }

        const pollRef = doc(db, "polls", pollId);
        const voteRef = doc(pollRef, "votes", user.uid);

        try {
            // First, check if the user has already voted to be safe
            const voteDoc = await getDoc(voteRef);
            if (voteDoc.exists()) {
                toast({ title: "You have already voted in this poll.", variant: "destructive" });
                // Update local state just in case
                if (!votedPolls.includes(pollId)) {
                    setVotedPolls([...votedPolls, pollId]);
                }
                return;
            }

            // Record the user's vote to prevent re-voting
            await setDoc(voteRef, { option: selectedOptionText, votedAt: Timestamp.now() });

            // Update the poll counts
            const pollToUpdate = polls.find(p => p.id === pollId);
            if(pollToUpdate) {
                const newOptions = pollToUpdate.options.map(option => {
                    if (option.text === selectedOptionText) {
                        return { ...option, votes: (option.votes || 0) + 1 };
                    }
                    return option;
                });
                
                await updateDoc(pollRef, {
                    totalVotes: increment(1),
                    options: newOptions
                });
            }

            toast({
                title: "Vote Cast!",
                description: "Thank you for your participation.",
            });
            // Immediately update local state to reflect the vote
            setVotedPolls([...votedPolls, pollId]);
        } catch (error) {
            console.error("Error casting vote: ", error);
            toast({ title: "Error casting vote", description: "Could not save your vote. Please try again.", variant: "destructive" });
        }
    };
    
    return (
        <>
            <PageHeader
                title="Community Voting"
                description="Participate in community polls and make your voice heard."
            />
            {isLoading || isAuthLoading ? (
                 <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                 </div>
            ) : polls.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {polls.map((poll) => {
                        const hasVoted = votedPolls.includes(poll.id);
                        const isPollActive = poll.status === 'Active';

                        return (
                            <Card key={poll.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="font-headline">{poll.question}</CardTitle>
                                        <Badge variant={isPollActive ? 'default' : 'secondary'}>{poll.status}</Badge>
                                    </div>
                                    <CardDescription>Total Votes: {poll.totalVotes || 0}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isPollActive && !hasVoted ? (
                                        <RadioGroup 
                                            value={selectedOptions[poll.id]}
                                            onValueChange={(value) => setSelectedOptions(prev => ({...prev, [poll.id]: value}))}
                                            className="space-y-2"
                                        >
                                            {poll.options.map((option, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.text} id={`r${poll.id}-${index}`} />
                                                    <Label htmlFor={`r${poll.id}-${index}`}>{option.text}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    ) : (
                                        poll.options.map((option, index) => {
                                            const percentage = poll.totalVotes > 0 ? ((option.votes || 0) / poll.totalVotes) * 100 : 0;
                                            return (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span>{option.text}</span>
                                                        <span className="font-medium">{percentage.toFixed(0)}% ({option.votes || 0} votes)</span>
                                                    </div>
                                                    <Progress value={percentage} />
                                                </div>
                                            );
                                        })
                                    )}
                                </CardContent>
                                <CardFooter>
                                    {isPollActive && !hasVoted && (
                                        <Button className="w-full" onClick={() => handleVote(poll.id)}>Submit Vote</Button>
                                    )}
                                    {isPollActive && hasVoted && (
                                        <p className="text-sm text-muted-foreground w-full text-center">You have already voted in this poll.</p>
                                    )}
                                    {!isPollActive && (
                                        <p className="text-sm text-muted-foreground w-full text-center">This poll is closed.</p>
                                    )}
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        There are no active polls at the moment.
                    </CardContent>
                </Card>
            )}
        </>
    );
}

    
