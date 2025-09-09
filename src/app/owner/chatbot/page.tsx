import TenantChatbotPage from "@/app/tenant/chatbot/page";

// Owners who live in the society have the same chatbot view as tenants.
// The primary difference is the navigation sidebar provided by the layout.
export default function OwnerChatbotPage() {
    return <TenantChatbotPage />;
}
