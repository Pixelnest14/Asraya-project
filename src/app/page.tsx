
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
import { signInAnonymously, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseConfig } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
    );
}

export default function LoginPage() {
  const { auth, isLoading: isAuthLoading } = useFirebase();
  const [role, setRole] = useState('tenant');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // If we're using placeholder credentials, just navigate to the correct page.
    if (firebaseConfig.apiKey === 'your-api-key') {
      toast({ title: 'Login Successful (Prototype Mode)!' });
      router.push(`/${role}`);
      setIsLoading(false);
      return;
    }

    if (isAuthLoading || !auth) {
      toast({
        title: "Authentication service is not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
     // If we're using placeholder credentials, just navigate to the correct page.
    if (firebaseConfig.apiKey === 'your-api-key') {
      toast({ title: 'Login Successful (Prototype Mode)!' });
      router.push('/tenant');
      setIsLoading(false);
      return;
    }

    if (!auth) {
        toast({ title: "Authentication service is not ready.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
        toast({ title: "Google Sign-In Successful!" });
        // Redirect to a default role page, e.g., tenant
        router.push('/tenant');
    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        toast({
            title: "Google Sign-In Failed",
            description: error.message,
            variant: "destructive",
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
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isFormDisabled}>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign in with Google
            </Button>

            <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
