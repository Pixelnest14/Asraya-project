
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { owners, tenants, staff } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function DirectoryPage() {
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
                        {owners.map((owner) => (
                            <TableRow key={owner.id}>
                                <TableCell className="font-medium">{owner.name}</TableCell>
                                <TableCell>{owner.flat}</TableCell>
                                <TableCell>{owner.phone}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </TableCell>
                            </TableRow>
                        ))}
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
                        {tenants.map((tenant) => (
                            <TableRow key={tenant.id}>
                                <TableCell className="font-medium">{tenant.name}</TableCell>
                                <TableCell>{tenant.flat}</TableCell>
                                <TableCell>{tenant.phone}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </TableCell>
                            </TableRow>
                        ))}
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
                        {staff.map((person) => (
                            <TableRow key={person.id}>
                                <TableCell className="font-medium">{person.name}</TableCell>
                                <TableCell>{person.role}</TableCell>
                                <TableCell>{person.phone}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
