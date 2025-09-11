"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench, CheckCircle } from "lucide-react";

export default function StaffDashboard() {
  return (
    <>
      <PageHeader
        title="Staff Dashboard"
        description="View your assigned tasks and updates."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench />New Tasks</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">3</p>
             <p className="text-muted-foreground">New tasks assigned.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle />Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">5</p>
             <p className="text-muted-foreground">Tasks completed today.</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>My Open Tasks</CardTitle>
                <CardDescription>A list of tasks that require your attention.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Task list coming soon.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
