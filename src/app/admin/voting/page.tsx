"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { initialPolls } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, RefreshCw, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminVotingPage() {
    const { toast } = useToast();
    const [polls, setPolls] = useState(initialPolls);

    const handleToggleStatus = (pollId: number) => {
        setPolls(polls.map(p => 
            p.id === pollId 
            ? { ...p, status: p.status === 'Active' ? 'Closed' : 'Active' }
            : p
        ));
        toast({
            title: "Poll Status Updated!",
            description: "The poll status has been successfully changed.",
        });
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
                            <Input id="question" placeholder="e.g., Should we change gym timings?" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="option1">Option 1</Label>
                            <Input id="option1" placeholder="Required" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="option2">Option 2</Label>
                            <Input id="option2" placeholder="Required" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="option3">Option 3</Label>
                            <Input id="option3" placeholder="Optional" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="option4">Option 4</Label>
                            <Input id="option4" placeholder="Optional" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Poll
                        </Button>
                    </CardFooter>
                </Card>

                {/* Polls Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Polls Overview</CardTitle>
                        <CardDescription>View and manage existing polls.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {polls.map((poll) => (
                            <div key={poll.id} className="p-4 rounded-lg border bg-muted/30">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-semibold font-headline">{poll.title}</h4>
                                        <p className="text-sm">
                                            Status: <Badge variant={poll.status === 'Active' ? 'default' : 'secondary'}>{poll.status}</Badge>
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline"
                                            size="sm" 
                                            onClick={() => handleToggleStatus(poll.id)}
                                        >
                                            {poll.status === 'Active' ? <XCircle /> : <RefreshCw />}
                                            {poll.status === 'Active' ? 'Close' : 'Re-open'}
                                        </Button>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {poll.options.map((option, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>{option}</span>
                                                <span className="font-medium text-foreground">{poll.results[index]}%</span>
                                            </div>
                                            <Progress value={poll.results[index]} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}