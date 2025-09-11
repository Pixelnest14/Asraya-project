import { AppSidebar } from "@/components/app-sidebar";
import { staffNavItems } from "@/lib/nav-items";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar navItems={staffNavItems} role="Staff">
      {children}
    </AppSidebar>
  );
}
