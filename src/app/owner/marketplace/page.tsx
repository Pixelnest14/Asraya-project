import TenantMarketplacePage from "@/app/tenant/marketplace/page";

// Owners who live in the society have the same marketplace view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerMarketplacePage() {
    return <TenantMarketplacePage />;
}
