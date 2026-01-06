# Project Contributors & Role Distribution

This document outlines a logical distribution of work for a team of four developers to build and maintain the Asraya Society Hub application.

### Team Member 1: Frontend & UI/UX Lead (The Architect)

This developer is responsible for the core user experience and the foundational structure of the application.

-   **Core Responsibilities**:
    -   Set up the Next.js project, including routing, layouts, and global styles.
    -   Implement the ShadCN UI component library and establish the project's design system.
    -   Build all the reusable, presentational components like `PageHeader`, `StatCard`, and the main `AppSidebar`.
    -   Ensure the entire application is responsive and provides a consistent user experience.
-   **Files Owned**: `tailwind.config.ts`, `src/components/ui/*`, `src/components/app-sidebar.tsx`, `src/app/layout.tsx`.

### Team Member 2: Backend & Firebase Specialist (The Data Engineer)

This developer manages the entire "Backend-as-a-Service" layer, focusing on data structure, authentication, and security.

-   **Core Responsibilities**:
    -   Set up the Firebase project and integrate the Firebase SDK into the Next.js application.
    -   Implement the complete user authentication flow, including login, registration, and role handling.
    -   Define the Firestore database schema (e.g., collections for `complaints`, `bills`, `polls`, `users`).
    -   Write the data seeding logic and mock data (`src/lib/mock-data.ts`) to ensure the app is populated with initial content.
-   **Files Owned**: `src/lib/firebase.ts`, `src/components/firebase-provider.tsx`, `src/app/page.tsx`, `src/lib/mock-data.ts`.

### Team Member 3: Admin Portal Feature Developer (The Operations Specialist)

This developer focuses on building the tools that society administrators use to manage the community.

-   **Core Responsibilities**:
    -   Develop all pages within the `/admin` route.
    -   Implement the real-time functionality for the Admin Dashboard, including complaint tracking and parking status.
    -   Build the forms and tables for managing apartments, residents, notices, and voting polls.
    -   Write the Firestore queries (`onSnapshot`, `addDoc`, `updateDoc`) required for the admin to create, read, update, and delete data.
-   **Files Owned**: All files under `src/app/admin/**`.

### Team Member 4: Tenant Portal & AI Feature Developer (The User Experience Engineer)

This developer is responsible for the tenant-facing features, ensuring residents have a smooth and engaging experience.

-   **Core Responsibilities**:
    -   Develop all pages within the `/tenant` route.
    -   Build the tenant-facing features like filing a complaint, paying a bill, booking amenities, and voting.
    -   Implement the **Genkit AI Assistant**, including defining the flow, creating the prompt, and building the chat UI.
    -   Ensure that all data displayed to the tenant is correctly filtered to their user account.
-   **Files Owned**: All files under `src/app/tenant/**`, `src/ai/**`.
