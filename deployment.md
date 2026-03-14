# Rately Deployment Guide (MERN: Render + Vercel)

This guide prepares the backend (Express/MongoDB) for deployment on Render and the frontend (React) for deployment on Vercel. It includes required environment variables, CORS setup, and verification steps.

## Overview
- Backend: Render Web Service (Node.js)
- Frontend: Vercel project (Create React App)
- CORS: Multi-origin, controlled via environment variables

## Prerequisites
- MongoDB Atlas cluster and connection string (MONGO_URI)
- A secure JWT secret (JWT_SECRET)
- Render and Vercel accounts connected to your Git repository

## Environment Variables

### Backend (Render)
- MONGO_URI: MongoDB connection string (Atlas or other)
- JWT_SECRET: A strong random string (at least 32 chars)
- NODE_ENV: production
- CORS_ORIGINS: Comma-separated allowed origins (e.g. `https://your-frontend.vercel.app,https://your-domain.com`)
- CLIENT_URL: Optional single origin (use CORS_ORIGINS for multiple)
- JWT_EXPIRES_IN: Optional (default: `24h`)
- OPENROUTER_API_KEY: Optional if chatbot feature is enabled
- AI_MODEL: Optional chat model override
- PORT: Render sets automatically; do not hardcode

### Frontend (Vercel)
- REACT_APP_API_URL: Your backend base URL with `/api` suffix (e.g. `https://your-backend.onrender.com/api`)
- NODE_ENV: production (optional)

Notes:
- The frontend production default currently points to `https://rately-aq95.onrender.com/api`. REACT_APP_API_URL overrides this and should be set to your actual backend URL.

## Backend Deployment (Render)
1. Create a new Web Service:
   - Runtime: Node
   - Repository: Select your repo and backend subfolder if needed
2. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Health Check Path: `/health`
3. Environment:
   - Add variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CORS_ORIGINS`
   - Optionally add `OPENROUTER_API_KEY`, `AI_MODEL`, `JWT_EXPIRES_IN`
4. Deploy:
   - Trigger deploy; wait until health check is passing
5. Custom Domain (optional):
   - Add domain in Render settings and update DNS

## Frontend Deployment (Vercel)
1. Import Project:
   - Framework preset: Create React App
2. Configure:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Environment:
   - Add `REACT_APP_API_URL` = `https://<your-render-service>.onrender.com/api`
4. Deploy:
   - Trigger a build and deploy
5. Rewrites:
   - SPA rewrites already present in `frontend/vercel.json`

## CORS Configuration
- Backend reads allowed origins from:
  - `CORS_ORIGINS` (comma-separated)
  - `CLIENT_URL` (single origin)
- Additionally allowed by default:
  - Any subdomain of `vercel.app` and `onrender.com`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

## Post-Deploy Verification
1. Backend Health:
   - `curl https://<render-backend>/health` should return `{"status":"OK"...}`
2. Frontend API calls:
   - Ensure `REACT_APP_API_URL` points to your backend and includes `/api`
3. Authentication:
   - Login with default admin (printed in backend logs)
   - Admin: `admin@rately.com` / `Admin@123`
4. Store Owner Creation:
   - Create a user with `Role = Store Owner` in Admin → Users
   - Optional: provide `Store Name`, `Store Email`, `Store Address`
   - Verify store appears in Admin → Stores and owner dashboard

## Troubleshooting
- CORS Errors:
  - Confirm frontend origin is included in `CORS_ORIGINS`
  - Check that frontend requests include proper scheme (https)
- 401/Redirects from Frontend:
  - Ensure `REACT_APP_API_URL` is correct and includes `/api`
  - Tokens are stored in localStorage; clear if stale
- Render Port Issues:
  - Render sets the port; do not hardcode PORT
- MongoDB Access:
  - Ensure IP allowlist rules allow Render outbound traffic
  - Verify MONGO_URI correctness and credentials
- Password Policy:
  - Requires 8–16 chars, one uppercase, one special character

## Sample .env Values

### Backend (.env on Render)
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<generate-a-strong-random-secret>
NODE_ENV=production
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
OPENROUTER_API_KEY=<optional>
AI_MODEL=google/gemini-2.0-flash-exp:free
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
NODE_ENV=production
```

## References
- Backend CORS setup: `backend/server.js`
- Frontend API base selection: `frontend/src/services/api.js`
- Admin store/user creation: `backend/controllers/adminController.js`
