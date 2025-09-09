import { AppSidebar } from "@/components/app-sidebar";
import { tenantNavItems } from "@/lib/nav-items";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar navItems={tenantNavItems} role="Tenant">
      {children}
    </AppSidebar>
  );
}
