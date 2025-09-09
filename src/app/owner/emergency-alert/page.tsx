import TenantEmergencyPage from "@/app/tenant/emergency-alert/page";

// Owners who live in the society have the same emergency alert view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerEmergencyPage() {
    return <TenantEmergencyPage />;
}
