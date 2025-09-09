import { PageHeader } from "@/components/page-header";
import { marketplaceItems } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlusCircle } from "lucide-react";

export default function TenantMarketplacePage() {
    return (
        <>
            <PageHeader 
                title="Community Marketplace"
                description="Buy, sell, or rent items with your neighbors."
            >
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    List an Item
                </Button>
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
                            <Button variant="outline">Contact</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}
