import TenantDashboard from "@/app/tenant/dashboard/page";

// Owners who live in the society have the same dashboard view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerDashboard() {
    return <TenantDashboard />;
}
