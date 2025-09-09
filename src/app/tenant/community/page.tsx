import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const events = [
    { title: "Annual General Meeting", date: "Dec 5th, 2023 at 6:00 PM", location: "Clubhouse" },
    { title: "Christmas Carnival", date: "Dec 24th, 2023 from 3:00 PM", location: "Society Park" },
];

const announcements = [
    { title: "Diwali Celebration", content: "Join us for the annual Diwali event on Nov 12th. See events for details." },
    { title: "Water Supply Interruption", content: "Please note that water supply will be interrupted on Nov 15th from 10 AM to 1 PM for maintenance." },
]

export default function CommunityPage() {
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
                    {events.map(event => (
                        <div key={event.title} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">{event.date} - {event.location}</p>
                            </div>
                            <Button variant="outline">RSVP</Button>
                        </div>
                    ))}
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
                    {announcements.map(announcement => (
                        <div key={announcement.title} className="p-4 border rounded-lg">
                            <h4 className="font-semibold">{announcement.title}</h4>
                            <p className="text-sm text-muted-foreground">{announcement.content}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
