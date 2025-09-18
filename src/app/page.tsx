

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
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile, 
} from 'firebase/auth';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { auth, isLoading: isAuthLoading } = useFirebase();
  const [role, setRole] = useState('tenant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isAuthLoading || !auth) {
      setError("Authentication service is not ready. Please wait and try again.");
      setIsLoading(false);
      return;
    }

    try {
      if (role === 'tenant') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          if (auth.currentUser && auth.currentUser.displayName !== name && name) {
            await updateProfile(auth.currentUser, { displayName: name });
          }
        } catch (signInError: any) {
          if (signInError.code === 'auth/user-not-found') {
            if (!name.trim()) {
              setError('Please enter your name to create an account.');
              throw new Error('Name is required for signup.');
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
          } else if (signInError.code === 'auth/invalid-credential') {
            setError('Incorrect email or password.');
            throw signInError;
          } else {
            setError(signInError.message);
            throw signInError;
          }
        }
      } else { // Admin
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential') {
             setError('Incorrect Credentials. For prototype purposes, the Admin password is "admin123".');
          } else {
            setError("Invalid credentials. Please try again.");
          }
          throw error;
        }
      }
        
      toast({ title: 'Login Successful!' });
      router.push(`/${role}`);

    } catch (authError: any) {
      console.error("Authentication Error:", authError.code, authError.message);
      if (!error && authError.message) {
        setError(authError.message);
      }
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
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select value={role} onValueChange={setRole} disabled={isFormDisabled}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               
              {role === 'tenant' && (
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                    id="name" 
                    type="text"
                    placeholder="Enter your full name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isFormDisabled}
                    required
                    />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="user-id">Email</Label>
                <Input 
                  id="user-id" 
                  type="email"
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isFormDisabled}
                  required
                />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                      <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isFormDisabled}
                          required
                          className={cn("pr-10", error && "border-destructive")}
                      />
                       <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute inset-y-0 right-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                      >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                  </div>
                  {role === 'admin' && <p className='text-xs text-muted-foreground'>Hint: The prototype password is "admin123"</p>}
                  {role === 'tenant' && <p className='text-xs text-muted-foreground'>For new tenants, an account will be created with this password.</p>}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
