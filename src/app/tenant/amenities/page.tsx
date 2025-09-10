
"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar as CalendarIcon, LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { useFirebase } from "@/components/firebase-provider";
import { Skeleton } from "@/components/ui/skeleton";

type Amenity = {
  id: string;
  name: string;
  image: string;
  dataAiHint: string;
  description: string;
};

export default function AmenitiesPage() {
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const { user, isLoading: isAuthLoading } = useFirebase();

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const amenitiesCollection = collection(db, "amenities");
        const amenitiesSnapshot = await getDocs(amenitiesCollection);
        const amenitiesList = amenitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Amenity));
        setAmenities(amenitiesList);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        toast({
          title: "Error",
          description: "Could not load amenities from the database.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAmenities();
  }, [toast]);


  const handleBooking = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!user) {
        toast({ title: "Please log in to book an amenity.", variant: "destructive" });
        return;
    }

    if (selectedAmenity && selectedDate) {
        try {
            await addDoc(collection(db, "bookings"), {
                amenityId: selectedAmenity.id,
                amenityName: selectedAmenity.name,
                userId: user.uid,
                bookingDate: Timestamp.fromDate(selectedDate),
                status: "Confirmed",
            });

            toast({
                title: "Booking Confirmed!",
                description: `${selectedAmenity.name} has been booked for ${selectedDate.toLocaleDateString()}.`,
            });
        } catch (error) {
             toast({
                title: "Booking Failed",
                description: "Could not save your booking.",
                variant: "destructive",
            });
            console.error("Error adding booking: ", error);
        }
    }
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Book Amenities"
        description="Reserve society facilities for your personal use."
      />
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="p-0">
                        <Skeleton className="w-full h-[225px] rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                    <CardFooter className="p-4">
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : amenities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {amenities.map(amenity => (
                <Card key={amenity.id}>
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
                        <Button className="w-full" onClick={() => handleBooking( amenity)}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Book Now
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No amenities are available at the moment. Please check back later.
          </CardContent>
        </Card>
      )}
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
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
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
