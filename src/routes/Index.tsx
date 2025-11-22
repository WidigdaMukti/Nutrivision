// src/routes/Index.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import DataDiri from "@/features/auth/pages/DataDiri";
import Dashboard from "@/features/dashboard/Dashboard";
import Profile from "@/features/profile/Profile";
import AddFood from "@/features/food/page/AddFood";
import FoodDetail from "@/features/food/page/FoodDetail";

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - redirect to dashboard if already logged in */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route 
        path="/data-diri" 
        element={user ? <Navigate to="/dashboard" replace /> : <DataDiri />} 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tambah-makanan" 
        element={
          <ProtectedRoute>
            <AddFood />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/detail-makanan/:id" 
        element={
          <ProtectedRoute>
            <FoodDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;