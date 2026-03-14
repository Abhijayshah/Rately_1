# Rately — Details for Developer

Version: 1.0 • Last Updated: 2026-02-26

## 1. PROJECT OVERVIEW
- Name: Rately
- Description: MERN application for discovering local stores, rating them, and managing store data with admin tooling.
- Purpose: Enable normal users to rate/review stores; store owners to monitor ratings; admins to manage users and stores.
- Target Audience: Shoppers (normal users), store owners, system administrators.

## 2. TECH STACK
- Frontend: React 18 (create-react-app), react-router-dom 6
- Styling: TailwindCSS 3 (utility-first), custom components in src/components/ui
- Backend: Node.js (Express 4), REST API
- Database: MongoDB (Mongoose 9)
- Authentication: JWT (jsonwebtoken), role-based middleware
- State Management: Context API (AuthContext)
- Build Tools: CRA (react-scripts 5), Tailwind (postcss, autoprefixer)
- Package Manager: npm
- Deployment: Frontend on Vercel (rewrites to index.html); Backend on Render (Web Service)

## 3. FILE STRUCTURE

```
Rately_1/
├── backend/                               # Express API
│   ├── config/
│   │   ├── database.js                    # Mongoose connection helper
│   │   └── initDb.js                      # Seed/init routines run on startup
│   ├── controllers/
│   │   ├── adminController.js             # Admin: users/stores CRUD, stats
│   │   ├── authController.js              # Auth: register/login/profile/password
│   │   ├── chatController.js              # Chatbot via OpenRouter (AI responses)
│   │   └── storeController.js             # Stores: listing/details/ratings/owner dashboard
│   ├── middleware/
│   │   ├── auth.js                        # JWT verification + role guards
│   │   └── validation.js                  # express-validator rules for inputs
│   ├── models/
│   │   ├── Rating.js                      # Ratings schema + hooks for averaging
│   │   ├── Store.js                       # Stores schema (name/email/address/owner)
│   │   └── User.js                        # Users schema (name/email/password/address/role)
│   ├── routes/
│   │   ├── admin.js                       # /api/admin/* endpoints (requires system_admin)
│   │   ├── auth.js                        # /api/auth/* endpoints (public + auth)
│   │   ├── chat.js                        # /api/chat/* endpoints (auth + public)
│   │   └── stores.js                      # /api/stores/* endpoints (auth normal/store_owner)
│   ├── package.json
│   └── server.js                          # Express app bootstrapping + CORS/security
│
├── frontend/                              # React SPA
│   ├── public/
│   │   ├── images/                        # Background images
│   │   ├── favicon.svg
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/ProtectedRoute.js     # Route guard component
│   │   │   ├── layout/Layout.js           # App shell layout
│   │   │   └── ui/                        # Reusable UI building blocks
│   │   │       ├── Button.js              # Button variants
│   │   │       ├── Chatbot.jsx            # Alternative chatbot UI component
│   │   │       ├── Input.js               # Text inputs
│   │   │       ├── Loading.js             # Loading spinner
│   │   │       ├── Modal.js               # Modal wrapper
│   │   │       ├── Select.js              # Select dropdown
│   │   │       ├── StarRating.js          # Stars display
│   │   │       └── Table.js               # Table + pagination
│   │   ├── contexts/AuthContext.js        # Login/register/profile state & helpers
│   │   ├── pages/
│   │   │   ├── admin/                     # Admin area
│   │   │   │   ├── Analytics.js
│   │   │   │   ├── Stores.js              # Admin manages stores
│   │   │   │   └── Users.js               # Admin manages users (+ optional store auto-create)
│   │   │   ├── auth/
│   │   │   │   ├── Login.js               # User login page
│   │   │   │   └── Register.js            # User registration page
│   │   │   ├── storeOwner/StoreOwnerDashboard.js # Owner portal: ratings of their store
│   │   │   ├── user/
│   │   │   │   ├── Ratings.js             # User’s ratings history
│   │   │   │   └── Stores.js              # Store list (normal users)
│   │   │   ├── Dashboard.js               # Role-based landing post-login
│   │   │   ├── Landing.js                 # Public homepage + chat widget
│   │   │   ├── Settings.js
│   │   │   └── Unauthorized.js
│   │   ├── services/
│   │   │   ├── api.js                     # Axios instance + API namespaces
│   │   │   └── chatService.js             # Chat service wrapper
│   │   ├── App.js                         # Router + app composition
│   │   ├── index.css                      # Tailwind base + global styles
│   │   └── index.js                       # React root render
│   ├── tailwind.config.js                 # Tailwind setup
│   ├── postcss.config.js                  # PostCSS setup
│   ├── vercel.json                        # SPA rewrite config
│   ├── package.json
│   └── README.md
│
├── deployment.md                          # Render/Vercel deployment steps & envs
├── README.md                              # Project readme
└── details-for-developer.md               # This document
```

## 4. KEY COMPONENTS
- ProtectedRoute ([frontend/src/components/auth/ProtectedRoute.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/frontend/src/components/auth/ProtectedRoute.js))
  - Purpose: Guard routes based on auth/role.
  - Props: children; optional role checks (see implementation).
  - Dependencies: react-router-dom, AuthContext.
- Users (Admin) ([frontend/src/pages/admin/Users.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/frontend/src/pages/admin/Users.js))
  - Purpose: Admin user CRUD; optional store auto-create for store_owner role in “Add User”.
  - Props: None (page); internal modals CreateUserModal/EditUserModal.
  - Dependencies: adminAPI, Modal, Table, Input, Select, Button.
- Stores (Admin) ([frontend/src/pages/admin/Stores.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/frontend/src/pages/admin/Stores.js))
  - Purpose: Admin store CRUD (create, list).
  - Props: None (page); CreateStoreModal collects ownerId.
  - Dependencies: adminAPI, Table, Modal, Input, Select.
- Landing ([frontend/src/pages/Landing.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/frontend/src/pages/Landing.js))
  - Purpose: Marketing hero, CTA, lightweight chat widget.
  - Props: None; uses AuthContext, chatAPI.
  - Dependencies: Button/Modal/Input/Select (indirect), lucide-react icons.
- Chatbot (alt) ([frontend/src/components/ui/Chatbot.jsx](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/frontend/src/components/ui/Chatbot.jsx))
  - Purpose: Full-featured chat window with chatService integration.
  - Props: None.
  - Dependencies: chatService, react-toastify.
- AuthContext ([frontend/src/contexts/AuthContext.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/frontend/src/contexts/AuthContext.js))
  - Purpose: Manage login/register/profile; persists token + user; helpers isAdmin/isStoreOwner.
  - Dependencies: authAPI, react-toastify.
- Backend Controllers:
  - authController ([backend/controllers/authController.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/backend/controllers/authController.js)): register/login/profile/password; returns JWT.
  - adminController ([backend/controllers/adminController.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/backend/controllers/adminController.js)): users/stores + stats; auto-create store on store_owner creation.
  - storeController ([backend/controllers/storeController.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/backend/controllers/storeController.js)): normal user store listing/details; rating submit; owner ratings dashboard.
  - chatController ([backend/controllers/chatController.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/Rately_1/backend/controllers/chatController.js)): OpenRouter chat; restricts answers to Rately-related topics.

## 5. ROUTING STRUCTURE
- Frontend (react-router-dom): defined in App.js with pages under src/pages.
  - Public: / (Landing), /login, /register, /unauthorized
  - Protected (normal_user): /user/stores, /user/ratings
  - Protected (store_owner): /storeOwner/dashboard
  - Protected (system_admin): /admin/users, /admin/stores, /admin/analytics
- Backend (Express base paths in server.js):
  - /api/auth: register, login (public); profile/password/logout (auth)
  - /api/admin: dashboard/stats; users; stores (auth + system_admin)
  - /api/stores: listing/details/ratings (auth + normal_user); owner dashboard (auth + store_owner)
  - /api/chat: /message (auth), /message/public (guest)

## 6. API ENDPOINTS
- Auth (/api/auth)
  - POST /register: {name,email,password,address} → {token,user}
  - POST /login: {email,password} → {token,user}
  - GET /profile (auth)
  - PUT /profile (auth)
  - PUT /password (auth)
  - POST /logout (auth)
- Admin (/api/admin) [requires system_admin]
  - GET /dashboard/stats
  - POST /users
  - GET /users
  - GET /users/:id
  - PUT /users/:id
  - DELETE /users/:id
  - POST /stores
  - GET /stores
- Stores (/api/stores) [requires auth]
  - GET /              (normal_user)
  - GET /:id           (normal_user)
  - POST /ratings      (normal_user)
  - GET /user/ratings  (normal_user)
  - GET /owner/dashboard (store_owner)
- Chat (/api/chat)
  - POST /message (auth)
  - POST /message/public (guest)

## 7. STYLING SYSTEM
- Methodology: Utility-first (TailwindCSS), with custom UI components.
- Global styles: frontend/src/index.css
- Design tokens: Tailwind config (tailwind.config.js).
- Responsive: Tailwind breakpoints (sm, md, lg, etc.) through utility classes.

## 8. ENVIRONMENT VARIABLES
- Backend (.env — do NOT commit real values)
  - MONGO_URI: MongoDB connection string
  - JWT_SECRET: Secret for signing tokens
  - JWT_EXPIRES_IN: Token expiration (e.g., 24h)
  - PORT: Server port (Render sets automatically)
  - NODE_ENV: development/production
  - CLIENT_URL: single allowed origin (deprecated in favor of CORS_ORIGINS)
  - CORS_ORIGINS: comma-separated allowed origins
  - OPENROUTER_API_KEY: API key for chat responses
  - AI_MODEL: Chat model identifier
- Frontend (Vercel)
  - REACT_APP_API_URL: Backend base URL (include /api)

## 9. SCRIPTS & COMMANDS
```bash
# Backend
npm run dev     # Start Express with nodemon (auto-restarts)
npm start       # Start Express in production

# Frontend
npm start       # Run CRA dev server (proxy/REACT_APP_API_URL to backend)
npm run build   # Build production bundle
npm test        # CRA test runner
```

## 10. DEPENDENCIES
- Backend:
  - express, mongoose, jsonwebtoken, bcryptjs
  - cors, helmet, express-rate-limit, express-validator
  - axios (chat integration), dotenv, nodemon (dev)
- Frontend:
  - react, react-router-dom
  - axios, react-toastify
  - tailwindcss, postcss, autoprefixer
  - lucide-react (icons), react-scripts (CRA)

## 11. DEPLOYMENT NOTES
- Backend (Render):
  - Web Service; build: npm install; start: node server.js; health: /health
  - Set environment variables as above; include CORS_ORIGINS for frontend domain(s).
- Frontend (Vercel):
  - Build: npm run build; output: build; rewrites in vercel.json to index.html
  - Set REACT_APP_API_URL to your Render backend URL with /api

## 12. FUTURE SECTIONS
- TODO: Testing strategy (unit/integration/e2e) and coverage targets
- TODO: Analytics/observability (logs, metrics)
- TODO: Accessibility and internationalization guidelines
- TODO: Performance budgets and profiling methodology

---

## Architectural Notes
- Backend enforces role-based access via middleware, keeping admin/owner/user boundaries clear.
- Admin creation of store_owner can auto-create a linked Store, simplifying onboarding.
- Chat answers are restricted to Rately-related topics to keep assistant focused.
- CORS is multi-origin and permits common hosting domains (vercel.app, onrender.com); production should set explicit CORS_ORIGINS.

## Update Process
- Append new sections under the numbered headings.
- Keep names and paths consistent with codebase.
- Update the “Version” and “Last Updated” at the top.
