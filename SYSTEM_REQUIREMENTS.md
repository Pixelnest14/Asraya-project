# System Requirements for Asraya Society Hub

This document outlines the system requirements for the Asraya Society Hub application, covering functional, non-functional, software, and hardware aspects.

---

### 4.1 Functional Requirements

This section describes the specific functions and features the system must provide.

#### **User Management & Authentication:**
-   The system must provide role-based access control for two distinct roles: **Admin** and **Tenant**.
-   Users must be able to log in by selecting their role and providing an email and password.
-   **Tenant Registration:** If a tenant logs in with an email that does not exist, an account shall be created automatically.
-   **Admin Security:** New admin accounts cannot be created from the public login page; they must be provisioned separately.

#### **Admin-Specific Functions:**
-   **Dashboard:** View a high-level summary of society metrics, including total resident count, open complaints, and parking availability.
-   **Apartment Management:** View and manage a directory of all apartments, including their occupancy status (Rented, Self-occupied, Vacant).
-   **Resident Directory:** Access a database of all registered apartment owners and tenants, including contact information.
-   **Complaint Management:** View all complaints filed by residents in real-time, inspect their details, and update their status (e.g., New, In Progress, Resolved).
-   **Billing & Payments:** Track the maintenance fee payment status for all apartments and send payment reminders.
-   **Parking Management:** View a real-time visual grid of all parking slots, see their status (Available, Allotted, Occupied), and allot available slots to residents.
-   **Notice Board:** Create, publish, and delete society-wide announcements that are instantly visible to all tenants.
-   **Voting System:** Create and manage community polls, monitor voting progress with real-time results, and close polls.
-   **Emergency Alert System:** Broadcast high-priority emergency messages to all residents instantly.
-   **Smart Home Control:** Access a dedicated page with credentials to log into the Blynk app for managing society-wide smart devices.

#### **Tenant-Specific Functions:**
-   **Dashboard:** View a personalized summary of outstanding bills, active complaints, and the latest society announcements.
-   **Bill Payment:** View outstanding maintenance bills, see payment history, and submit proof of payment for verification.
-   **Complaint Filing:** File new complaints by category (e.g., Plumbing, Electrical), provide a detailed description, and track the status of existing complaints.
-   **Community Hub:** View official society announcements and a calendar of upcoming community events.
-   **Amenity Booking:** Reserve society facilities like the party hall or swimming pool for a specific date.
-   **Vehicle Registration:** Register personal vehicles to be linked with the society's parking system.
-   **Voting:** Participate in active community polls and view the results after voting or after the poll has closed.
-   **AI Assistant:** Interact with a chatbot to get instant answers to questions about society rules, services, and events.
-   **Smart Home Access:** Access a dedicated page with credentials and a download link for the Blynk mobile app to control personal smart home devices.

### 4.2 Non-Functional Requirements

This section describes the quality attributes and constraints of the system.

-   **Performance:** The application must load quickly, and UI updates in response to data changes (e.g., a new complaint appearing) must feel instantaneous (under 200ms).
-   **Scalability:** The system must be able to support hundreds of concurrent users without a degradation in performance, leveraging the scalable architecture of Firebase.
-   **Usability:** The user interface must be intuitive, clean, and easy to navigate for non-technical users. The design must be responsive, providing a seamless experience on both desktop and mobile web browsers.
-   **Security:**
    -   User authentication must be secure. Passwords should not be stored in plain text.
    -   Access to data must be strictly controlled by Firestore Security Rules to ensure that tenants can only access their own data, while admins have broader permissions.
-   **Reliability:** The application should have high availability, with an uptime of at least 99.9%.
-   **Maintainability:** The code must be well-structured, component-based, and use TypeScript to ensure it is easy to understand, modify, and extend in the future.

### 4.3 Software Requirements

This section lists the software technologies required to run and develop the application.

-   **Frontend:**
    -   **Operating System:** Any modern OS (Windows, macOS, Linux).
    -   **Web Browser:** Latest versions of Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge.
    -   **Frameworks/Libraries:** Next.js, React, Tailwind CSS, ShadCN UI, Lucide React, Recharts.
-   **Backend:**
    -   **Platform:** Firebase (as a Backend-as-a-Service).
    -   **Services:** Firebase Firestore, Firebase Authentication.
    -   **Generative AI:** Genkit with a connection to a Google AI model (e.g., Gemini).
-   **Development Environment:**
    -   **Runtime:** Node.js (v20 or later).
    -   **Package Manager:** npm.
    -   **Code Editor:** Visual Studio Code (recommended).

### 4.4 Hardware Requirements

This section describes the hardware needed by the end-users.

-   **Client-Side (End User):**
    -   A standard desktop computer, laptop, or smartphone capable of running a modern web browser.
    -   **Processor:** 1 GHz or faster.
    -   **RAM:** Minimum of 2 GB.
    -   **Internet Connection:** A stable broadband or mobile data connection is required for real-time features.
-   **Server-Side:**
    -   No dedicated server hardware is required by the end-user or developer, as the entire backend infrastructure is managed by **Firebase App Hosting**, which provides scalable, serverless resources automatically.
