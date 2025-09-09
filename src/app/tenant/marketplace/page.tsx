
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { marketplaceItems } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type MarketplaceItem = (typeof marketplaceItems)[0];

export default function TenantMarketplacePage() {
    const { toast } = useToast();
    const [postItemOpen, setPostItemOpen] = useState(false);
    const [contactInfoOpen, setContactInfoOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<{name: string, phone: string} | null>(null);

    const handleContact = (item: MarketplaceItem) => {
        // In a real app, you'd fetch this from a user service
        const sellerInfo = { name: item.seller, phone: "987-654-3210" };
        setSelectedSeller(sellerInfo);
        setContactInfoOpen(true);
    };

    const handlePostItem = () => {
         toast({
            title: "Item Posted!",
            description: "Your item has been listed on the marketplace.",
        });
        setPostItemOpen(false);
    }

    return (
        <>
            <PageHeader 
                title="Community Marketplace"
                description="Buy, sell, or rent items with your neighbors."
            >
                <Dialog open={postItemOpen} onOpenChange={setPostItemOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post an Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Post a New Item</DialogTitle>
                            <DialogDescription>
                                Fill in the details of your item to post it on the marketplace.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="item-name" className="text-right">Item Name</Label>
                                <Input id="item-name" placeholder="e.g., Used Bicycle" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Select>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="furniture">Furniture</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="vehicles">Vehicles</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cost" className="text-right">Cost</Label>
                                <Input id="cost" placeholder="e.g., Rs 3000" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sold-by" className="text-right">Sold By</Label>
                                <Input id="sold-by" value="Mr. Raj (A-101)" disabled className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handlePostItem}>Post Item</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {marketplaceItems.map((item) => (
                    <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                        <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
                            <div>
                                <p className="text-lg font-bold text-primary">{item.price}</p>
                                <p className="text-xs text-muted-foreground">Sold by {item.seller}</p>
                            </div>
                            <Button variant="outline" onClick={() => handleContact(item)}>Contact</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={contactInfoOpen} onOpenChange={setContactInfoOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Seller Contact Information</DialogTitle>
                    </DialogHeader>
                    {selectedSeller && (
                         <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-bold">{selectedSeller.name}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-muted-foreground">Phone:</span>
                                <a href={`tel:${selectedSeller.phone}`} className="font-bold text-primary">{selectedSeller.phone}</a>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setContactInfoOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
