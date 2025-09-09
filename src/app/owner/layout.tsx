import { AppSidebar } from "@/components/app-sidebar";
import { ownerNavItems } from "@/lib/nav-items";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar navItems={ownerNavItems} role="Owner">
      {children}
    </AppSidebar>
  );
}
