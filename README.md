# Rately - Store Rating System

A full-stack application for rating and reviewing stores, featuring separate interfaces for Users, Store Owners, and Admins.

## 🚀 Deployment Guide

This project is structured to be deployed with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

### 1. Database Setup (MongoDB Atlas)

1.  Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a database user (username/password).
3.  Allow access from anywhere (`0.0.0.0/0`) in Network Access (or whitelist Render's IP if possible).
4.  Get the Connection String (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/shop-rating?retryWrites=true&w=majority`).

---

### 2. Backend Deployment (Render)

1.  Push this repository to GitHub.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    - **Root Directory**: `backend`
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
6.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `PORT`: `5000` (Render will override this, but good to have)
    - `MONGO_URI`: *Your MongoDB Connection String*
    - `JWT_SECRET`: *A strong random string*
    - `CLIENT_URL`: *Your Vercel Frontend URL* (e.g., `https://rately.vercel.app` - add this AFTER deploying frontend)

---

### 3. Frontend Deployment (Vercel)

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Project Settings**:
    - **Root Directory**: `frontend`
    - **Framework Preset**: Create React App
    - **Build Command**: `npm run build` (default)
    - **Output Directory**: `build` (default)
5.  **Environment Variables**:
    - `REACT_APP_API_URL`: *Your Render Backend URL* + `/api` (e.g., `https://rately-backend.onrender.com/api`)
6.  Click **Deploy**.

---

### 4. Final Configuration

1.  After Frontend deployment, copy the Vercel URL (e.g., `https://rately.vercel.app`).
2.  Go back to **Render** -> **Environment Variables**.
3.  Update/Add `CLIENT_URL` with the Vercel URL.
4.  **Redeploy** the Backend Service on Render to apply the CORS change.

---

## 🛠 Project Structure

- `frontend/`: React application (Create React App)
- `backend/`: Node.js/Express API
- `root`: Deployment configuration
