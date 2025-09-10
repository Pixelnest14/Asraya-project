
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { owners as initialOwners, tenants as initialTenants, staff as initialStaff } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, getDocs, setDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Person = {
    id: string;
    name: string;
    phone: string;
};

type Owner = Person & { flat: string };
type Tenant = Person & { flat: string };
type Staff = Person & { role: string };

const setupInitialData = async (db, collectionName, data) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        for (const item of data) {
            await setDoc(doc(collectionRef, item.id), item);
        }
    }
};

export default function DirectoryPage() {
  const { db } = useFirebase();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    
    const fetchData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                setupInitialData(db, "owners", initialOwners),
                setupInitialData(db, "tenants", initialTenants),
                setupInitialData(db, "staff", initialStaff),
            ]);
        } catch (error) {
            console.error("Error setting up initial directory data:", error);
        }

        const unsubOwners = onSnapshot(collection(db, "owners"), (snapshot) => {
            setOwners(snapshot.docs.map(doc => doc.data() as Owner));
        });
        const unsubTenants = onSnapshot(collection(db, "tenants"), (snapshot) => {
            setTenants(snapshot.docs.map(doc => doc.data() as Tenant));
        });
        const unsubStaff = onSnapshot(collection(db, "staff"), (snapshot) => {
            setStaff(snapshot.docs.map(doc => doc.data() as Staff));
        });

        setIsLoading(false);

        return () => {
            unsubOwners();
            unsubTenants();
            unsubStaff();
        };
    };

    fetchData();

  }, [db]);


  return (
    <>
      <PageHeader 
        title="Society Directory"
        description="A complete database of all people in the society."
      />

      <Card>
        <CardHeader>
            <CardTitle>Directory</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="owners">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="owners">Owners</TabsTrigger>
                    <TabsTrigger value="tenants">Tenants</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                <TabsContent value="owners">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Flat</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4}><Skeleton className="h-8" /></TableCell></TableRow>
                        ) : (
                            owners.map((owner) => (
                                <TableRow key={owner.id}>
                                    <TableCell className="font-medium">{owner.name}</TableCell>
                                    <TableCell>{owner.flat}</TableCell>
                                    <TableCell>{owner.phone}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Contact</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="tenants">
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Flat</TableHead>
                            <TableHead>Phone</TableHead>
                             <TableHead>Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4}><Skeleton className="h-8" /></TableCell></TableRow>
                        ) : (
                            tenants.map((tenant) => (
                                <TableRow key={tenant.id}>
                                    <TableCell className="font-medium">{tenant.name}</TableCell>
                                    <TableCell>{tenant.flat}</TableCell>
                                    <TableCell>{tenant.phone}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Contact</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="staff">
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Phone</TableHead>
                             <TableHead>Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4}><Skeleton className="h-8" /></TableCell></TableRow>
                        ) : (
                            staff.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell>{person.role}</TableCell>
                                    <TableCell>{person.phone}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Contact</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
