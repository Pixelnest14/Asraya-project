import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof import("lucide-react");
};

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Apartments", href: "/admin/apartments", icon: "Building2" },
  { label: "Directory", href: "/admin/directory", icon: "Users" },
  { label: "Complaints", href: "/admin/complaints", icon: "Wrench" },
  { label: "Billings", href: "/admin/billing", icon: "CreditCard" },
  { label: "Parking", href: "/admin/parking", icon: "ParkingCircle" },
  { label: "Notice Board", href: "/admin/notice-board", icon: "Megaphone" },
  { label: "Resident Chat", href: "/admin/resident-chat", icon: "MessageSquare" },
  { label: "Voting", href: "/admin/voting", icon: "Vote" },
  { label: "Emergency Alert", href: "/admin/emergency-alert", icon: "ShieldAlert" },
  { label: "Marketplace", href: "/admin/marketplace", icon: "ShoppingCart" },
  { label: "Smart Water", href: "/admin/smart-home/water", icon: "Droplets" },
  { label: "Smart Lights", href: "/admin/smart-home/lights", icon: "Lightbulb" },
  { label: "Smart Parking", href: "/admin/smart-home/parking", icon: "Car" },
];

export const tenantNavItems: NavItem[] = [
  { label: "Dashboard", href: "/tenant/dashboard", icon: "LayoutDashboard" },
  { label: "My Bills", href: "/tenant/bills", icon: "CreditCard" },
  { label: "Complaints", href: "/tenant/complaints", icon: "Wrench" },
  { label: "Community", href: "/tenant/community", icon: "Users" },
  { label: "Book Amenities", href: "/tenant/amenities", icon: "CalendarDays" },
  { label: "My Vehicles", href: "/tenant/vehicles", icon: "Car" },
  { label: "Voting", href: "/tenant/voting", icon: "Vote" },
  { label: "Marketplace", href: "/tenant/marketplace", icon: "ShoppingCart" },
  { label: "Emergency", href: "/tenant/emergency-alert", icon: "ShieldAlert" },
  { label: "AI Assistant", href: "/tenant/chatbot", icon: "Bot" },
  { label: "Smart Home", href: "/tenant/smart-home", icon: "Home" },
];

export const ownerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/owner/dashboard", icon: "LayoutDashboard" },
  { label: "My Bills", href: "/owner/bills", icon: "CreditCard" },
  { label: "Complaints", href: "/owner/complaints", icon: "Wrench" },
  { label: "Community", href: "/owner/community", icon: "Users" },
  { label: "Book Amenities", href: "/owner/amenities", icon: "CalendarDays" },
  { label: "My Vehicles", href: "/owner/vehicles", icon: "Car" },
  { label: "Voting", href: "/owner/voting", icon: "Vote" },
  { label: "Marketplace", href: "/owner/marketplace", icon: "ShoppingCart" },
  { label: "Emergency", href: "/owner/emergency-alert", icon: "ShieldAlert" },
  { label: "AI Assistant", href: "/owner/chatbot", icon: "Bot" },
  { label: "Smart Home", href: "/owner/smart-home", icon: "Home" },
  { label: "My Tenants", href: "/owner/my-tenants", icon: "UserCheck" },
];
