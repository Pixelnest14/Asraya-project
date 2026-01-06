
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, addDoc, Timestamp, setDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { useFirebase } from "@/components/firebase-provider";
import { Skeleton } from "@/components/ui/skeleton";

type Amenity = {
  id: string;
  name: string;
  description: string;
};

const amenitiesData: Omit<Amenity, 'id'>[] = [
  {
    name: "Badminton Court",
    description: "A well-maintained indoor badminton court. Rackets and shuttles available."
  },
  {
    name: "Swimming Pool",
    description: "A large, clean swimming pool for all residents. Open from 6 AM to 10 PM."
  },
  {
    name: "Gym",
    description: "Fully equipped gymnasium with modern equipment for all your fitness needs."
  },
  {
    name: "Party Hall",
    description: "A spacious hall for hosting parties and events. Can accommodate up to 100 guests."
  }
];


export default function AmenitiesPage() {
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const { db, user } = useFirebase();

  useEffect(() => {
    if (!db) return;
    
    const fetchAmenities = async () => {
      setIsLoading(true);
      const amenitiesCollection = collection(db, "amenities");

      // Set up the initial data if it doesn't exist
      try {
        const snapshot = await getDocs(amenitiesCollection);
        if (snapshot.empty) {
            for (const amenityData of amenitiesData) {
                await addDoc(amenitiesCollection, amenityData);
            }
        }
      } catch (error) {
        console.error("Error setting up amenities:", error);
      }

      // Fetch and listen for real-time updates
      const unsubscribe = onSnapshot(amenitiesCollection, (snapshot) => {
        const amenitiesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Amenity));
        setAmenities(amenitiesList);
        setIsLoading(false);
      }, (error) => {
          console.error("Error fetching amenities:", error);
          setIsLoading(false);
      });

      return unsubscribe;
    };
    
    const unsubscribePromise = fetchAmenities();

    return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [db]);


  const handleBooking = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedAmenity || !selectedDate) {
      toast({ title: "Please select a date.", variant: "destructive" });
      return;
    }
    
    if (!db || !user) {
      toast({
        title: "Please log in to book an amenity",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        amenityId: selectedAmenity.id,
        amenityName: selectedAmenity.name,
        bookingDate: Timestamp.fromDate(selectedDate),
        status: "Confirmed",
        userId: user.uid,
        userFlat: "A-101" // Example data
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
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : amenities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {amenities.map(amenity => (
                <Card key={amenity.id}>
                    <CardHeader>
                        <CardTitle className="font-headline">{amenity.name}</CardTitle>
                        <CardDescription>{amenity.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
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
