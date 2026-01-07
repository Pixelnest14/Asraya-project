# Asraya Society Hub: Development Methodology

This document outlines the methodology, processes, and best practices for the development of the Asraya Society Hub application. Our goal is to ensure a collaborative, efficient, and high-quality development lifecycle.

## 1. Core Methodology: Agile & Iterative Development

We will adopt an Agile methodology, borrowing principles from Scrum, to remain flexible and responsive to feedback. This approach allows us to build the application in small, manageable increments and adapt to new requirements as they arise.

-   **Iterative Sprints**: Development will be organized into short sprints (e.g., 1-2 weeks). Each sprint will focus on delivering a specific set of features or improvements.
-   **Continuous Feedback**: At the end of each sprint, the team will review progress, gather feedback, and adjust the plan for the next sprint.
-   **Flexibility**: The project backlog will be a living document, allowing us to re-prioritize tasks based on user feedback and changing project needs.

## 2. Roles & Responsibilities

Clear roles ensure accountability and streamlined development. The role distribution is detailed in `CONTRIBUTORS.md` and is summarized as follows:

-   **Frontend & UI/UX Lead (The Architect)**: Owns the overall user experience, component library, and application structure.
-   **Backend & Firebase Specialist (The Data Engineer)**: Manages all data, authentication, and backend services via Firebase.
-   **Admin Portal Developer (The Operations Specialist)**: Focuses on building and maintaining the administrative features.
-   **Tenant Portal & AI Developer (The User Experience Engineer)**: Focuses on building resident-facing features and integrating AI capabilities.

## 3. Development Workflow

From idea to deployment, we will follow a structured workflow to maintain code quality and predictability.

### a. Task Management
All work will be tracked on a Kanban-style project board (e.g., GitHub Projects, Trello). Tasks will move through the following stages:
-   **Backlog**: All potential tasks and features.
-   **To Do**: Tasks planned for the current sprint.
-   **In Progress**: A task being actively worked on by a developer.
-   **In Review**: A completed task with a Pull Request awaiting review.
-   **Done**: The Pull Request has been approved, merged, and the feature is complete.

### b. Branching Strategy
We will use a simple, GitFlow-inspired branching model:
-   `main`: This branch represents the stable, production-ready version of the app. Merges to `main` should only come from `develop`.
-   `develop`: The primary development branch. All feature branches are merged into `develop`. This branch should always be in a deployable state for a staging environment.
-   `feature/<feature-name>`: All new work (features, bug fixes) must be done on a dedicated feature branch (e.g., `feature/login-page`, `bugfix/fix-delete-button`).

### c. Code Development & Review
-   **Create a Feature Branch**: Before starting work, create a new branch from `develop`.
-   **Write Code**: Adhere to the established coding guidelines (Next.js, TypeScript, Tailwind CSS, etc.).
-   **Create a Pull Request (PR)**: Once work is complete, push your feature branch to the remote repository and open a PR against the `develop` branch.
-   **Code Review**: At least one other team member must review the PR. The reviewer should check for:
    -   Correctness and functionality.
    -   Adherence to coding standards.
    -   Readability and maintainability.
    -   Potential bugs or edge cases.
-   **Merge**: Once the PR is approved, the author can merge it into `develop`.

### d. Continuous Integration & Deployment (CI/CD)
-   **Automated Checks**: On every PR, automated checks will run to ensure the code lints correctly and the project builds successfully.
-   **Staging Deployment**: Merging to `develop` will automatically deploy the latest version to a staging environment for final testing.
-   **Production Deployment**: Merging `develop` into `main` will trigger a deployment to the live production environment. This is typically done at the end of a sprint or after verifying the stability of the `develop` branch.

## 4. Technology Stack

All development must adhere to the project's predefined technology stack:
-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **UI**: React, ShadCN UI, Tailwind CSS
-   **Backend & Database**: Firebase (Firestore, Authentication)
-   **Generative AI**: Genkit

Requests to change or add to this core stack must be discussed and approved by the entire team.
