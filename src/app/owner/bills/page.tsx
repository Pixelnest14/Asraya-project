import TenantBillsPage from "@/app/tenant/bills/page";

// Owners who live in the society have the same bills view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerBillsPage() {
    return <TenantBillsPage />;
}
