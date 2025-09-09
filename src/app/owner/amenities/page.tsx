import TenantAmenitiesPage from "@/app/tenant/amenities/page";

// Owners who live in the society have the same amenities view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerAmenitiesPage() {
    return <TenantAmenitiesPage />;
}
