
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AsrayaLogo } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase } from '@/components/firebase-provider';

export default function LoginPage() {
  const { auth } = useFirebase();
  const [role, setRole] = useState('tenant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const isFirebaseReady = !!auth;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseReady) {
        toast({
            title: 'Initialization Error',
            description: 'Firebase is not ready. Please wait a moment and try again.',
            variant: 'destructive',
        });
        return;
    }
    
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful!' });
      router.push(`/${role}`);

    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3">
            <AsrayaLogo />
            <CardTitle className="font-headline text-2xl">Asraya Society Hub</CardTitle>
          </div>
           <CardDescription className="pt-2">Welcome back! Please login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading || !isFirebaseReady}>
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
              <Label htmlFor="user-id">Email</Label>
              <Input 
                id="user-id" 
                type="email"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !isFirebaseReady}
              />
               <p className="text-xs text-muted-foreground">Hint: Use tenant@asraya.com, owner@asraya.com, or admin@asraya.com with password 'password'</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !isFirebaseReady}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseReady}>
              {isLoading ? 'Logging in...' : 'Login'}
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
