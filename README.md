# sde-internship-vue-firebase-app
"A full-stack Q&amp;A platform built with Vue 3 (Nuxt), Pinia, and Firebase, featuring role-based access control. Created for the SDE Internship assignment."

# SDE Internship Assignment: Vue 3 & Firebase Q&A Platform

This project is a full-stack, serverless web application built to fulfill the requirements of the SDE Internship assignment. It demonstrates a robust implementation of modern frontend technologies, secure authentication, role-based access control, and seamless database integration using the Vue 3 and Firebase ecosystem.

The application provides a platform where users can log in to answer a programming question, while administrators have a separate, secure dashboard to review submissions and manage user roles.

**Live Demo:** [Link to your deployed application, if you host it on Vercel or Netlify]
**Video Walkthrough:** [Link to your screen recording]

![Admin Dashboard Screenshot](./images/admin%20dashboard%20screenshot.jpg)

## Core Architectural Pillars

This project was built with a focus on key software engineering principles:

*   **Modularity:** The application is cleanly separated into logical components (Visitor View, Admin View) and state management concerns (Pinia stores), making it easy to maintain and scale.
*   **Security by Default:** Access control is enforced at multiple layers—through frontend routing middleware and, most importantly, via server-side Firebase Security Rules, ensuring data integrity and proper authorization.
*   **Reactivity and Real-time Updates:** Leveraging Vue 3's Composition API and Pinia, the UI is fully reactive. The admin panel uses real-time listeners to instantly reflect changes in the database (like new submissions or updated admin roles).
*   **Serverless-First Approach:** The entire application operates without a traditional backend server, relying on Firebase's backend-as-a-service (BaaS) for authentication, database, and security.

## Features Implemented

### 🧑 Visitor (User) View

*   **Google OAuth 2.0 Login:** Secure, one-click user authentication via Firebase Auth.
*   **Protected Routing:** The programming question page is only accessible to authenticated users.
*   **Code Submission:** A clean interface for users to submit their code, which is then stored in Firestore.
*   **Persistent State:** Users remain logged in across page reloads and browser sessions.

### 🛠️ Administrator View

*   **Role-Based Access Control (RBAC):** The `/admin` route is strictly protected. Only users whose UID exists in the `/admins` Firestore collection can access it.
*   **Centralized Admin Dashboard:** A single-page interface for all administrative tasks.
*   **Submission Review:** Admins can view a real-time list of all user submissions, sorted by the most recent.
*   **User & Role Management:**
    *   Admins can view a list of all users who have ever signed into the application.
    *   With a single click, an admin can promote any user to an admin or revoke their privileges.
    *   This is handled securely by writing/deleting documents in the `/admins` collection.
    *   Admins are prevented from accidentally revoking their own privileges.

### 💾 Backend & Database (Firebase)

*   **Firestore Database Schema:**
    *   `/users/{userId}`: Stores public information for every user who signs up.
    *   `/submissions/{submissionId}`: Stores all code submissions, linked to the user's UID.
    *   `/admins/{userId}`: A protected collection acting as an Access Control List (ACL) for admin roles.
*   **Robust Security Rules:** Implemented granular Firestore rules to:
    *   Allow anyone to sign up, but only create their *own* user profile.
    *   Allow authenticated users to create submissions, but *never* read, update, or delete them.
    *   Allow admins to read all submissions and full read/write access to the `/admins` collection.

## Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| **Framework** | **[Nuxt 3](https://nuxt.com/)** (Vue 3)         |
| **State Mgt** | **[Pinia](https://pinia.vuejs.org/)**           |
| **Backend**   | **[Firebase](https://firebase.google.com/)**    |
| - Auth        | Firebase Authentication (Google Provider)     |
| - Database    | Cloud Firestore (NoSQL)                       |
| - Security    | Firestore Security Rules                      |
| **Styling**   | Standard CSS / [Your CSS choice, e.g., TailwindCSS] |

## Setup and Local Development

To run this project locally, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone [your-repo-url]
    cd sde-assignment-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase Credentials**
    *   Create a `.env` file in the root of the project.
    *   Add your Firebase project configuration keys to this file. Use the following template:
        ```.env
        NUXT_PUBLIC_FIREBASE_API_KEY="AIza..."
        NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
        NUXT_PUBLIC_FIREBASE_PROJECT_ID="..."
        NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
        NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
        NUXT_PUBLIC_FIREBASE_APP_ID="..."
        ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

5.  **Set Up Initial Admin User**
    *   Log in to the application with the Google account you wish to be the first admin.
    *   Go to the Firebase Console -> Authentication -> Users tab, and copy the User UID for that account.
    *   Go to Firestore Database -> `admins` collection, and create a new document using the copied UID as the Document ID. Add a field `email` with the user's email address.

---