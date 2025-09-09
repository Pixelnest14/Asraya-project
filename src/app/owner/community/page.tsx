import TenantCommunityPage from "@/app/tenant/community/page";

// Owners who live in the society have the same community view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerCommunityPage() {
    return <TenantCommunityPage />;
}
