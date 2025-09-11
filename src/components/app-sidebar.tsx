
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import * as icons from "lucide-react";
import type { NavItem } from "@/lib/nav-items";
import { AsrayaLogo } from "./icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useFirebase } from "./firebase-provider";

type AppSidebarProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  role: "Admin" | "Tenant" | "Staff";
};

function SidebarNavigation({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  const smartHomeNavItems = navItems.filter(item => item.href.includes('smart-home'));
  const mainNavItems = navItems.filter(item => !item.href.includes('smart-home'));

  return (
    <>
      <SidebarMenu>
        {mainNavItems.map((item) => {
          const Icon = icons[item.icon] as icons.LucideIcon;
          const isActive = pathname.startsWith(item.href);
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={isMobile ? undefined : item.label}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      
      {smartHomeNavItems.length > 0 && (
        <SidebarGroup>
            <SidebarGroupLabel>Smart Home</SidebarGroupLabel>
            {smartHomeNavItems.map((item) => {
            const Icon = icons[item.icon] as icons.LucideIcon;
            const isActive = pathname.startsWith(item.href);
            return (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    tooltip={isMobile ? undefined : item.label}
                >
                    <Link href={item.href}>
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            );
            })}
        </SidebarGroup>
      )}
    </>
  );
}


export function AppSidebar({ children, navItems, role }: AppSidebarProps) {
  const [isClient, setIsClient] = useState(false);
  const { user } = useFirebase();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
      return null;
  }

  const handleLogout = () => {
    // In a real app, you'd call auth.signOut() here
    console.log("Logging out...");
  }

  return (
     <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <AsrayaLogo className="h-8 w-8" />
              <div>
                <h2 className="font-headline text-2xl font-semibold text-primary">ASRAYA</h2>
                <p className="text-sm text-muted-foreground">{role} Portal</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarNavigation navItems={navItems} />
          </SidebarContent>
          <SidebarFooter className="p-4 flex flex-col gap-4">
             <div className="text-center text-xs text-muted-foreground">
                <p>{user?.displayName || "User"}</p>
                <p>{user?.email}</p>
             </div>
            <Button variant="outline" className="w-full justify-center gap-2" asChild>
                <Link href="/" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col w-full">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
                <SidebarTrigger className="sm:hidden" />
                <div className="flex items-center gap-4 ml-auto">
                    {/* Placeholder for future icons like notifications */}
                </div>
            </header>
            <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
