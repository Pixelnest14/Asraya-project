
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { apartments as initialApartments } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, getDocs, setDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Apartment = {
  id: string;
  block: string;
  status: 'Rented' | 'Self-occupied' | 'Vacant';
  owner: string;
  tenant: string | null;
};

export default function ApartmentsPage() {
  const { db } = useFirebase();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");

  useEffect(() => {
    if (!db) return;

    const setupAndFetchApartments = async () => {
        setIsLoading(true);
        const apartmentsCollection = collection(db, "apartments");
        
        try {
            const snapshot = await getDocs(apartmentsCollection);
            if (snapshot.empty) {
                // Pre-fill database with mock data if it's empty
                for (const apt of initialApartments) {
                    await setDoc(doc(db, "apartments", apt.id), apt);
                }
            }
        } catch (error) {
            console.error("Error setting up initial apartments:", error);
        }

        const unsubscribe = onSnapshot(apartmentsCollection, (snapshot) => {
            const apartmentsData = snapshot.docs.map(doc => doc.data() as Apartment);
            setApartments(apartmentsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching apartments:", error);
            setIsLoading(false);
        });

        return unsubscribe;
    };
    
    const unsubscribePromise = setupAndFetchApartments();
    return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [db]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Rented': return 'secondary';
      case 'Self-occupied': return 'default';
      case 'Vacant': return 'outline';
      default: return 'outline';
    }
  };

  const filteredApartments = apartments.filter(apartment => {
    const matchesSearch = apartment.id.toLowerCase().includes(search.toLowerCase()) || apartment.owner.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = blockFilter === 'all' || apartment.block === blockFilter;
    return matchesSearch && matchesBlock;
  });

  return (
    <>
      <PageHeader 
        title="Manage Apartments"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Apartment Directory</CardTitle>
          <CardDescription>View and manage all apartments in the society.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 mb-4 p-4 border rounded-lg">
                <Input 
                    placeholder="Filter by Flat Number..." 
                    className="w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <Select value={blockFilter} onValueChange={setBlockFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Blocks" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Blocks</SelectItem>
                        <SelectItem value="A">Block A</SelectItem>
                        <SelectItem value="B">Block B</SelectItem>
                        <SelectItem value="C">Block C</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                </Button>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flat Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Tenant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredApartments.map((apartment) => (
                  <TableRow key={apartment.id}>
                    <TableCell className="font-medium">{apartment.id}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(apartment.status)}>{apartment.status}</Badge>
                    </TableCell>
                    <TableCell>{apartment.owner}</TableCell>
                    <TableCell>{apartment.tenant || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
