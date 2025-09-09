import TenantComplaintsPage from "@/app/tenant/complaints/page";

// Owners who live in the society have the same complaints view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerComplaintsPage() {
    return <TenantComplaintsPage />;
}
