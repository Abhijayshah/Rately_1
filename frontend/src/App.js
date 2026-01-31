import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import Users from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';
import Analytics from './pages/admin/Analytics';

// User Pages
import UserStores from './pages/user/Stores';
import Ratings from './pages/user/Ratings';

// Store Owner Pages
import StoreOwnerDashboard from './pages/storeOwner/StoreOwnerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      {/* Dashboard - All authenticated users */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Settings - All authenticated users */}
                      <Route path="/settings" element={<Settings />} />
                      
                      {/* Admin Routes */}
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute requiredRole="system_admin">
                            <Users />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/stores"
                        element={
                          <ProtectedRoute requiredRole="system_admin">
                            <AdminStores />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics"
                        element={
                          <ProtectedRoute requiredRole="system_admin">
                            <Analytics />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Normal User Routes */}
                      <Route
                        path="/stores"
                        element={
                          <ProtectedRoute requiredRole="normal_user">
                            <UserStores />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-ratings"
                        element={
                          <ProtectedRoute requiredRole="normal_user">
                            <Ratings />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Store Owner Routes */}
                      <Route
                        path="/my-store"
                        element={
                          <ProtectedRoute requiredRole="store_owner">
                            <StoreOwnerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Default redirect */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      
                      {/* Catch all - redirect to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;