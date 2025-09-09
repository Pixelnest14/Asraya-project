import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { CreditCard, Wrench, Package, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TenantDashboard() {
  return (
    <>
      <PageHeader title="My Dashboard" description="Your personalized summary of society life." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Outstanding Dues" value="Rs 2,500" icon={CreditCard} description="Due by 30th Nov" />
        <StatCard title="Active Complaints" value="1" icon={Wrench} description="Plumbing issue" />
        <StatCard title="Packages" value="2" icon={Package} description="Ready for pickup" />
        <StatCard title="Security" value="All Clear" icon={Shield} description="No active alerts" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest news from the society office.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Diwali Celebration</h4>
                <p className="text-sm text-muted-foreground">Join us for the annual Diwali event on Nov 12th. See events for details.</p>
            </div>
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Water Supply Interruption</h4>
                <p className="text-sm text-muted-foreground">Please note that water supply will be interrupted on Nov 15th from 10 AM to 1 PM for maintenance.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Join your neighbors for community fun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h4 className="font-semibold">Annual General Meeting</h4>
                    <p className="text-sm text-muted-foreground">Dec 5th, 2023 at 6:00 PM - Clubhouse</p>
                </div>
                <Button variant="outline">RSVP</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h4 className="font-semibold">Christmas Carnival</h4>
                    <p className="text-sm text-muted-foreground">Dec 24th, 2023 from 3:00 PM - Society Park</p>
                </div>
                <Button variant="outline">RSVP</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
