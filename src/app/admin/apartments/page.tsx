
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { apartments } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function ApartmentsPage() {
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");

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
              {filteredApartments.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell className="font-medium">{apartment.id}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(apartment.status)}>{apartment.status}</Badge>
                  </TableCell>
                  <TableCell>{apartment.owner}</TableCell>
                  <TableCell>{apartment.tenant || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
