import TenantSmartHomePage from "@/app/tenant/smart-home/page";

// Owners who live in the society have the same smart home view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerSmartHomePage() {
    return <TenantSmartHomePage />;
}
