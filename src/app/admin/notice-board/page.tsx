import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function NoticeBoardPage() {
    const announcements = [
        { title: "Diwali Celebration", date: "Nov 5, 2023", content: "Join us for the annual Diwali event on Nov 12th. See events for details." },
        { title: "Water Supply Interruption", date: "Nov 10, 2023", content: "Please note that water supply will be interrupted on Nov 15th from 10 AM to 1 PM for maintenance." },
        { title: "Annual General Meeting", date: "Nov 20, 2023", content: "The Annual General Meeting will be held on Dec 5th, 2023 at 6:00 PM in the Clubhouse." },
    ]
    return (
        <>
            <PageHeader 
                title="Notice Board"
                description="Create and publish official announcements to all residents."
            >
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Announcement
                </Button>
            </PageHeader>
            <div className="space-y-6">
                {announcements.map((announcement, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{announcement.title}</CardTitle>
                            <CardDescription>{announcement.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{announcement.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
