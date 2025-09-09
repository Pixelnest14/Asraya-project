import TenantVotingPage from "@/app/tenant/voting/page";

// Owners who live in the society have the same voting view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerVotingPage() {
    return <TenantVotingPage />;
}
