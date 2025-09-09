"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { polls } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TenantVotingPage() {
    const { toast } = useToast();
    const [votedPolls, setVotedPolls] = useState<number[]>([]);

    const handleVote = (pollId: number) => {
        setVotedPolls([...votedPolls, pollId]);
        toast({
            title: "Vote Cast!",
            description: "Thank you for your participation.",
        });
    };
    
    return (
        <>
            <PageHeader
                title="Community Voting"
                description="Participate in community polls and make your voice heard."
            />
            <div className="grid gap-6 md:grid-cols-2">
                {polls.map((poll) => (
                    <Card key={poll.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="font-headline">{poll.title}</CardTitle>
                                <Badge variant={poll.status === 'Active' ? 'default' : 'secondary'}>{poll.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {poll.status === 'Active' && !votedPolls.includes(poll.id) ? (
                                <RadioGroup defaultValue="option-one" className="space-y-2">
                                    {poll.options.map((option, index) => (
                                         <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`r${poll.id}-${index}`} />
                                            <Label htmlFor={`r${poll.id}-${index}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                poll.options.map((option, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span>{option}</span>
                                            <span className="font-medium">{poll.results[index]}%</span>
                                        </div>
                                        <Progress value={poll.results[index]} />
                                    </div>
                                ))
                            )}
                        </CardContent>
                        <CardFooter>
                            {poll.status === 'Active' && !votedPolls.includes(poll.id) && (
                                <Button className="w-full" onClick={() => handleVote(poll.id)}>Submit Vote</Button>
                            )}
                             {poll.status === 'Active' && votedPolls.includes(poll.id) && (
                                <p className="text-sm text-muted-foreground w-full text-center">You have already voted in this poll.</p>
                            )}
                             {poll.status === 'Closed' && (
                                <p className="text-sm text-muted-foreground w-full text-center">This poll is closed.</p>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}
