
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SmartHomePage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <PageHeader
        title="Blynk App"
        description="Control all your smart home devices using the Blynk mobile app."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Smart Home Login</CardTitle>
            <CardDescription>
              Use these credentials to log in to the Blynk app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value="naragattiabc12@gmail.com" readOnly />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value="abcgn@542004"
                        readOnly
                        className="pr-10"
                    />
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute inset-y-0 right-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                </div>
            </div>
             <Button className="w-full" disabled>
                Login (Use Mobile App)
             </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
           <CardHeader>
            <CardTitle>How to Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
                <h4 className="font-semibold">1. Download the App</h4>
                <p className="text-sm text-muted-foreground">
                    Click the link below to download the Blynk IoT app from the Google Play Store.
                </p>
            </div>
            <div className="space-y-1">
                <h4 className="font-semibold">2. Log In</h4>
                <p className="text-sm text-muted-foreground">
                    Open the app and log in using the email and password provided on the left.
                </p>
            </div>
             <div className="space-y-1">
                <h4 className="font-semibold">3. Control Your Devices</h4>
                <p className="text-sm text-muted-foreground">
                    Once logged in, you will see your dashboard and can start controlling your smart home devices.
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="https://play.google.com/store/apps/details?id=cloud.blynk" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download Blynk App
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
