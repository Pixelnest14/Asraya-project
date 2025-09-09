import { PageHeader } from "@/components/page-header";
import { polls } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlusCircle } from "lucide-react";

export default function AdminVotingPage() {
    return (
        <>
            <PageHeader
                title="Voting Management"
                description="Create and manage polls on community decisions."
            >
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Poll
                </Button>
            </PageHeader>
            <div className="grid gap-6 md:grid-cols-2">
                {polls.map((poll) => (
                    <Card key={poll.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="font-headline">{poll.title}</CardTitle>
                                <Badge variant={poll.status === 'Active' ? 'default' : 'secondary'}>{poll.status}</Badge>
                            </div>
                            <CardDescription>
                                {poll.status === 'Active' ? 'Live results from resident voting.' : 'This poll is now closed.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {poll.options.map((option, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span>{option}</span>
                                        <span className="font-medium">{poll.results[index]}%</span>
                                    </div>
                                    <Progress value={poll.results[index]} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
