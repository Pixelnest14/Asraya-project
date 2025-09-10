
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AsrayaLogo } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase } from '@/components/firebase-provider';
import { signInAnonymously, updateProfile } from 'firebase/auth';

export default function LoginPage() {
  const { auth, isLoading: isAuthLoading } = useFirebase();
  const [role, setRole] = useState('tenant');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthLoading || !auth) {
      toast({
        title: "Authentication service is not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // For prototype purposes, we'll use anonymous sign-in and just set the display name.
      const userCredential = await signInAnonymously(auth);
      
      // We can use the role and a mock name for display purposes
      const displayName = `User (${role.charAt(0).toUpperCase() + role.slice(1)})`;
      await updateProfile(userCredential.user, { displayName: displayName });

      toast({ title: 'Login Successful!' });
      router.push(`/${role}`);
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormDisabled = isLoading || isAuthLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3">
            <AsrayaLogo />
            <CardTitle className="font-headline text-2xl">Asraya Society Hub</CardTitle>
          </div>
           <CardDescription className="pt-2">Welcome! Please select your role to proceed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <Select value={role} onValueChange={setRole} disabled={isFormDisabled}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-id">Email (Optional)</Label>
              <Input 
                id="user-id" 
                type="email"
                placeholder="Enter any email for display" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFormDisabled}
              />
               <p className="text-xs text-muted-foreground">Hint: This is a prototype. Just select a role and log in.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              {isLoading || isAuthLoading ? 'Please wait...' : 'Login'}
            </Button>
            <div className="text-center">
               <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
