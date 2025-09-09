import { AppSidebar } from "@/components/app-sidebar";
import { adminNavItems } from "@/lib/nav-items";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar navItems={adminNavItems} role="Admin">
      {children}
    </AppSidebar>
  );
}
