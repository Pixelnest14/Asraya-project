

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
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';
import { firebaseConfig } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.04_6,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
    );
}

const ADMIN_PASSWORD = "admin123"; // Prototype admin password

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

    if (!email) {
      toast({
        title: 'Email is required',
        description: 'Please enter your email address to log in.',
        variant: 'destructive',
      });
      return;
    }
    
    if (role === 'tenant' && !name.trim()) {
        toast({
            title: 'Name is required',
            description: 'Please enter your name.',
            variant: 'destructive',
        });
        return;
    }
    
    setIsLoading(true);

    if (isAuthLoading || !auth) {
      toast({
        title: "Authentication service is not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    const effectivePassword = role === 'tenant' ? 'password123' : password;

    try {
      try {
        // Attempt to sign in first
        await signInWithEmailAndPassword(auth, email, effectivePassword);
      } catch (signInError: any) {
        // If user is not found, create a new account
        if (signInError.code === 'auth/user-not-found') {
          const userCredential = await createUserWithEmailAndPassword(auth, email, effectivePassword);
          await updateProfile(userCredential.user, { displayName: name });
        } else {
          // For any other sign-in error (wrong password, etc.), throw it to be caught by the outer catch block
          throw signInError;
        }
      }
      
      // If sign-in or sign-up was successful, update the profile if needed
      if (auth.currentUser && auth.currentUser.displayName !== name && role === 'tenant') {
          await updateProfile(auth.currentUser, { displayName: name });
      }

      toast({ title: 'Login Successful!' });
      router.push(role === 'staff' ? '/staff' : `/${role}`);
    } catch (authError: any) {
      console.error("Firebase Auth Error:", authError);
      let description = "An unexpected error occurred. Please try again.";
      if (authError.code === 'auth/invalid-credential') {
          if (role === 'admin') {
              description = 'Incorrect Admin Password. Please use the prototype password: "admin123"';
          } else {
              description = 'Incorrect email or password. Please try again.';
          }
      } else if (authError.code === 'auth/email-already-in-use') {
          description = 'This email is already in use. Please try logging in or use a different email.';
      } else if (authError.code === 'auth/operation-not-allowed') {
          description = 'Email/Password sign-in is not enabled. Please enable it in your Firebase console.';
      } else if (authError.code === 'auth/weak-password') {
          description = `The password must be at least 6 characters long.`;
      } else if (authError.message) {
          description = authError.message;
      }
      setError(description);
      toast({
        title: 'Login Failed',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    if (firebaseConfig.apiKey === 'AIzaSyB1gSdbomqvmuK7I4lpnHjSLCDSrcTUhto') {
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
        router.push('/tenant');
    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        let description = error.message;
        if (error.code === 'auth/operation-not-allowed') {
          description = 'Google Sign-In is not enabled in the Firebase console. Please enable it to continue.';
        }
        toast({
            title: "Google Sign-In Failed",
            description: description,
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
            {role === 'tenant' && (
              <>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isFormDisabled}>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>

                <div className="flex items-center space-x-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>
              </>
            )}
            
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
                    <SelectItem value="staff">Staff</SelectItem>
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

               {role === 'admin' && (
                <div className="space-y-2">
                    <Label htmlFor="password">Admin Password</Label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter admin password" 
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
                </div>
              )}

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
