
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { apartments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApartmentsPage() {
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Rented': return 'default';
      case 'Self-occupied': return 'secondary';
      case 'Vacant': return 'destructive';
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
        title="Apartments Management"
        description="A directory of all apartments in the society."
      >
        <div className="flex gap-2">
            <Input 
                placeholder="Search flat or owner..." 
                className="w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
            />
            <Select value={blockFilter} onValueChange={setBlockFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by block" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    <SelectItem value="A">Block A</SelectItem>
                    <SelectItem value="B">Block B</SelectItem>
                    <SelectItem value="C">Block C</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Apartment Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flat No.</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Tenant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApartments.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell className="font-medium">{apartment.id}</TableCell>
                  <TableCell>{apartment.block}</TableCell>
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
