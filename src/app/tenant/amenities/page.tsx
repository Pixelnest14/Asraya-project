"use client"

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

const amenities = [
    { name: "Clubhouse", image: "https://picsum.photos/600/400?random=5", dataAiHint: "clubhouse interior", description: "Perfect for parties and gatherings. Capacity: 50 people." },
    { name: "Swimming Pool", image: "https://picsum.photos/600/400?random=6", dataAiHint: "swimming pool", description: "Open from 6 AM to 10 PM. Please follow pool rules." },
    { name: "Tennis Court", image: "https://picsum.photos/600/400?random=7", dataAiHint: "tennis court", description: "Book your slot in advance. Equipment not provided." },
    { name: "Gym", image: "https://picsum.photos/600/400?random=8", dataAiHint: "gym fitness", description: "Fully equipped gym. Available 24/7 for residents." },
];


export default function AmenitiesPage() {
  return (
    <>
      <PageHeader
        title="Book Amenities"
        description="Reserve society facilities for your personal use."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {amenities.map(amenity => (
            <Card key={amenity.name}>
                 <CardHeader className="p-0">
                    <Image
                        src={amenity.image}
                        alt={amenity.name}
                        width={600}
                        height={400}
                        data-ai-hint={amenity.dataAiHint}
                        className="object-cover rounded-t-lg aspect-video"
                    />
                </CardHeader>
                <CardContent className="p-4">
                    <CardTitle className="font-headline">{amenity.name}</CardTitle>
                    <CardDescription>{amenity.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 flex gap-2">
                    <Button className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Check Availability
                    </Button>
                     <Button className="w-full" variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        View Bookings
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </>
  );
}
