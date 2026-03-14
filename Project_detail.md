# Rately - Store Rating System & AI Chatbot

## 📖 Project Overview
Rately is a full-stack web application designed to help users discover, rate, and review local stores. It features a robust Role-Based Access Control (RBAC) system catering to three distinct user types: **Admins**, **Store Owners**, and **Normal Users**. The platform includes a real-time AI Chatbot to assist users, comprehensive dashboards for analytics, and a secure authentication system.

---

## 🛠 Tech Stack

### **Frontend**
-   **Framework**: React.js (v18)
-   **Styling**: Tailwind CSS (Utility-first CSS framework)
-   **Icons**: Lucide React
-   **State/Data Management**: Context API (AuthContext), Axios (API requests)
-   **Routing**: React Router DOM (v6)
-   **Forms & Validation**: React Hook Form
-   **Notifications**: React Toastify

### **Backend**
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (via Mongoose ODM)
-   **Authentication**: JWT (JSON Web Tokens) & BcryptJS (Password Hashing)
-   **Security**: Helmet (HTTP headers), Express Rate Limit (DDoS protection), Express Validator (Input validation)
-   **AI Integration**: OpenRouter API / Google Gemini (for Chatbot)

---

## 📂 File Structure & Explanation

### **Backend (`/backend`)**

#### **Configuration (`/config`)**
-   `database.js`: Handles connection logic to MongoDB.
-   `initDb.js`: Seeding script to initialize the database with default Admin, User, and Store Owner accounts.

#### **Controllers (`/controllers`)**
-   `adminController.js`: Logic for admin tasks (dashboard stats, managing users/stores).
-   `authController.js`: Handles user registration, login, profile management, and password updates.
-   `chatController.js`: Manages AI Chatbot interactions, sending context and history to the LLM provider.
-   `storeController.js`: Logic for fetching stores, submitting ratings, and store owner dashboards.

#### **Middleware (`/middleware`)**
-   `auth.js`: JWT verification middleware. Protects routes based on user roles (Admin, Store Owner, User).
-   `validation.js`: Input validation rules using `express-validator` to ensure data integrity.

#### **Models (`/models`)**
-   `Rating.js`: Schema for user ratings (score, review, user reference, store reference).
-   `Store.js`: Schema for store details (name, address, owner reference, average rating).
-   `User.js`: Schema for user accounts (name, email, password, role).

#### **Routes (`/routes`)**
-   `admin.js`: API endpoints for admin operations.
-   `auth.js`: API endpoints for authentication.
-   `chat.js`: API endpoints for the chatbot interface.
-   `stores.js`: API endpoints for store browsing and rating.

#### **Root Files**
-   `server.js`: Entry point. Configures Express app, middleware (CORS, Helmet), connects to DB, and starts the server.
-   `.env`: Environment variables (Database URI, JWT Secrets, API Keys).

---

### **Frontend (`/frontend`)**

#### **Source (`/src`)**
-   `App.js`: Main component setting up routes and the AuthProvider.
-   `index.js`: Entry point rendering the React app.

#### **Components (`/src/components`)**
-   **Auth**
    -   `ProtectedRoute.js`: Higher-order component to restrict access to pages based on login status and user roles.
-   **Layout**
    -   `Layout.js`: Main layout wrapper containing the Sidebar/Navbar and the Chatbot integration.
-   **UI** (Reusable components)
    -   `Button.js`, `Input.js`, `Select.js`: Standardized UI elements.
    -   `Chatbot.jsx`: Floating AI chat interface component.
    -   `StarRating.js`: Interactive star component for submitting/viewing ratings.
    -   `Modal.js`: Pop-up dialogs.
    -   `Table.js`: Data display component for dashboards.
    -   `Loading.js`: Spinner for async states.

#### **Contexts (`/src/contexts`)**
-   `AuthContext.js`: Manages global authentication state (user, token, login/logout functions) accessible throughout the app.

#### **Pages (`/src/pages`)**
-   **Admin**
    -   `Analytics.js`, `Stores.js`, `Users.js`: Admin-specific management views.
-   **Auth**
    -   `Login.js`, `Register.js`: Authentication forms.
-   **StoreOwner**
    -   `StoreOwnerDashboard.js`: Dashboard for store owners to view their specific store's performance.
-   **User**
    -   `Ratings.js`: View for users to see their past ratings.
    -   `Stores.js`: Public listing of all stores.
-   **General**
    -   `Dashboard.js`: Role-agnostic landing dashboard.
    -   `Landing.js`: Public home page.
    -   `Settings.js`: User profile settings.
    -   `Unauthorized.js`: Error page for insufficient permissions.

#### **Services (`/src/services`)**
-   `api.js`: Configured Axios instance with interceptors for token handling and error management.
-   `chatService.js`: API methods specifically for chatbot communication.

---

## 🚀 Resume Points (ATS Friendly)

Here are high-impact bullet points you can add to your resume:

-   **Developed a Scalable MERN Stack Application**: Built a comprehensive store rating platform using **MongoDB, Express.js, React, and Node.js**, featuring a responsive UI with **Tailwind CSS**.
-   **Implemented Role-Based Access Control (RBAC)**: Engineered secure authentication and authorization flows using **JWT and Bcrypt**, managing distinct permissions for Admins, Store Owners, and Users.
-   **Integrated AI-Powered Chatbot**: Deployed a context-aware AI assistant using **OpenRouter/Gemini API**, enhancing user engagement and platform navigation.
-   **Optimized RESTful API Performance**: Designed efficient API endpoints with **Express**, implementing **Rate Limiting** and **Helmet** for enhanced security and DDoS protection.
-   **Modern Frontend Architecture**: Utilized **React Hooks** and **Context API** for state management, creating a modular codebase with reusable components like dynamic tables and interactive star ratings.
