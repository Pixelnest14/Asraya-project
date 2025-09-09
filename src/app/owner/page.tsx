import { redirect } from 'next/navigation';

export default function OwnerRootPage() {
  // Owners share the tenant dashboard, but with an owner layout
  redirect('/owner/dashboard');
}
