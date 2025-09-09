
"use client"

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar as CalendarIcon, PartyPopper } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

type Amenity = {
  name: string;
  image: string;
  dataAiHint: string;
  description: string;
};

const amenities: Amenity[] = [
    { name: "Party Hall", image: "https://picsum.photos/600/400?random=5", dataAiHint: "party hall interior", description: "Perfect for parties and gatherings. Capacity: 50 people." },
    { name: "Swimming Pool", image: "https://picsum.photos/600/400?random=6", dataAiHint: "swimming pool", description: "Open from 6 AM to 10 PM. Please follow pool rules." },
    { name: "Badminton Court", image: "https://picsum.photos/600/400?random=7", dataAiHint: "badminton court", description: "Book your slot in advance. Equipment not provided." },
    { name: "Gym", image: "https://picsum.photos/600/400?random=8", dataAiHint: "gym fitness", description: "Fully equipped gym. Available 24/7 for residents." },
];


export default function AmenitiesPage() {
  const { toast } = useToast();
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const handleBooking = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setOpen(true);
  };

  const handleConfirmBooking = () => {
    if (selectedAmenity && selectedDate) {
        toast({
            title: "Booking Confirmed!",
            description: `${selectedAmenity.name} has been booked for ${selectedDate.toLocaleDateString()}.`,
        });
    }
    setOpen(false);
  }

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
                    <Button className="w-full" onClick={() => handleBooking(amenity)}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Book Now
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {selectedAmenity?.name}</DialogTitle>
            <DialogDescription>
              Select a date to book this amenity.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
