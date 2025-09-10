
import TenantVehiclesPage from "@/app/tenant/vehicles/page";

// Owners who live in the society have the same vehicles view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerParkingPage() {
    return <TenantVehiclesPage />;
}
