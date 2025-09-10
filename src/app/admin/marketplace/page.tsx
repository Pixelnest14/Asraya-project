
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, doc, deleteDoc, getDocs, addDoc } from "firebase/firestore";
import { marketplaceItems as initialMarketplaceItems } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type MarketplaceItem = {
    id: string;
    title: string;
    description: string;
    price: string;
    seller: string;
    image: string;
    dataAiHint: string;
};

export default function AdminMarketplacePage() {
    const { db } = useFirebase();
    const { toast } = useToast();
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        const setupAndFetchItems = async () => {
            setIsLoading(true);
            const marketplaceCollection = collection(db, "marketplace");
            try {
                const snapshot = await getDocs(marketplaceCollection);
                if (snapshot.empty) {
                    for (const item of initialMarketplaceItems) {
                        await addDoc(marketplaceCollection, item);
                    }
                }
            } catch (error) {
                console.error("Error setting up initial marketplace items:", error);
            }

            const unsubscribe = onSnapshot(marketplaceCollection, (snapshot) => {
                const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceItem));
                setItems(itemsList);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching marketplace items:", error);
                setIsLoading(false);
            });

            return unsubscribe;
        };

        const unsubscribePromise = setupAndFetchItems();
        return () => {
            unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
        };
    }, [db]);
    
    const handleRemove = async (itemId: string) => {
        if (!db) return;
        if (confirm("Are you sure you want to remove this item?")) {
            try {
                await deleteDoc(doc(db, "marketplace", itemId));
                toast({ title: "Item Removed", description: "The item has been removed from the marketplace." });
            } catch (error) {
                toast({ title: "Error", description: "Could not remove the item.", variant: "destructive" });
                console.error("Error removing item: ", error);
            }
        }
    };

    return (
        <>
            <PageHeader 
                title="Marketplace Oversight"
                description="View and manage all items listed by residents."
            />
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                            <CardFooter className="p-4 flex justify-between">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((item) => (
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader className="p-0">
                               <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    data-ai-hint={item.dataAiHint}
                                    className="object-cover rounded-t-lg aspect-video"
                                />
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                 <CardTitle className="text-lg font-headline mb-1">{item.title}</CardTitle>
                                 <CardDescription className="text-sm">{item.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-bold text-primary">{item.price}</p>
                                    <p className="text-xs text-muted-foreground">Sold by {item.seller}</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => handleRemove(item.id)}>Remove</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
