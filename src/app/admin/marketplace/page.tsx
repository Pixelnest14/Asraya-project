import { PageHeader } from "@/components/page-header";
import { marketplaceItems } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminMarketplacePage() {
    return (
        <>
            <PageHeader 
                title="Marketplace Oversight"
                description="View and manage all items listed by residents."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {marketplaceItems.map((item) => (
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
                            <Button variant="destructive" size="sm">Remove</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}
