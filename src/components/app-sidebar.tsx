"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import * as icons from "lucide-react";
import type { NavItem } from "@/lib/nav-items";
import { AsrayaLogo } from "./icons";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  role: "Admin" | "Tenant" | "Owner";
};

export function AppSidebar({ children, navItems, role }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background text-foreground">
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
          <SidebarContent className="p-4">
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = icons[item.icon] as icons.LucideIcon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(isActive && "bg-primary/10 text-primary hover:bg-primary/20")}
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
          </SidebarContent>
          <SidebarFooter className="p-4">
             <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href="/">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Link>
             </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5"/>
                    <span className="sr-only">Settings</span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${role}`} alt={role} />
                    <AvatarFallback>{role.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
