import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Phone, Siren } from "lucide-react";

export default function TenantEmergencyPage() {
    const emergencyContacts = [
        { name: "Society Security", number: "011-23456789" },
        { name: "Local Police", number: "100" },
        { name: "Fire Department", number: "101" },
        { name: "Ambulance", number: "102" },
    ];
    
    return (
        <>
            <PageHeader
                title="Emergency Alerts"
                description="High-priority alerts and important contacts."
            />
            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <Siren className="h-6 w-6" />
                            Active Alerts
                        </CardTitle>
                        <CardDescription>
                            Currently, there are no active emergency alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground p-8">
                            <ShieldAlert className="mx-auto h-12 w-12 mb-4" />
                            <p>All Clear</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-6 w-6" />
                            Emergency Contacts
                        </CardTitle>
                        <CardDescription>
                            Quick access to important numbers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {emergencyContacts.map(contact => (
                            <div key={contact.name} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                <span className="font-medium">{contact.name}</span>
                                <a href={`tel:${contact.number}`} className="font-mono text-primary font-semibold tracking-wider">{contact.number}</a>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
