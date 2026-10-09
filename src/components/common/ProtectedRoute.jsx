import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { patientUser, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-brandOrange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const activePatient = patientUser || (user?.role !== 'admin' ? user : null);
  if (!activePatient) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { adminUser, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 text-white">
        <div className="animate-spin w-8 h-8 border-4 border-brandOrange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const activeAdmin = adminUser || (user?.role === 'admin' ? user : null);
  if (!activeAdmin || activeAdmin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
