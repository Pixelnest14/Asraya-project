import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, User, Crown } from "lucide-react";
import { AsrayaLogo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AsrayaLogo />
          </div>
          <CardTitle className="font-headline text-4xl">ASRAYA</CardTitle>
          <CardDescription>Welcome to your Society Hub. Please select your role to login.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/admin">
              <Building className="mr-2 h-5 w-5" /> Admin
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full">
            <Link href="/tenant">
              <User className="mr-2 h-5 w-5" /> Tenant
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/owner">
              <Crown className="mr-2 h-5 w-5" /> Owner
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
