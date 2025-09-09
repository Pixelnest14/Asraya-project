
"use client"

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import { publishedNotices } from "@/lib/mock-data";

export default function NoticeBoardPage() {
    return (
        <>
            <PageHeader 
                title="Notice Board Management"
            />
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Post a New Notice</CardTitle>
                        <CardDescription>Create and publish an announcement for all residents.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., Important Maintenance Update" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea id="content" placeholder="Please provide the full details of the announcement." rows={5} />
                        </div>
                        <Button>Post Notice</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Published Notices</CardTitle>
                        <CardDescription>View and manage existing notices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {publishedNotices.map((notice) => (
                           <div key={notice.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                <div>
                                    <h4 className="font-semibold">{notice.title}</h4>
                                    <p className="text-sm text-muted-foreground">Posted on: {notice.date}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                           </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
